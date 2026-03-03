import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE, SSEStreamingApi } from 'hono/streaming';
import { EventEmitter } from 'node:events';
import { type ServerPlayer, type ServerGame, NFL_TEAMS, type Roster, SCREEN } from "common/types";
import { getFantasyPoints, shuffle } from 'common';
import { logger } from 'hono/logger';
import { validator } from 'hono/validator';

EventEmitter.setMaxListeners(100);

function getRandomCode(): string {
	let code = "";
	for (let i = 0; i < 6; i++) {
		code += Math.floor(Math.random() * 9 + 1);
	}
	return code;
}

function getUniqueCode(): string {
	let code = getRandomCode();
	while (games[code] != null) {
		code = getRandomCode();
	}
	return code;
}

const games: Record<string, ServerGame> = {};
const hostRoomEmitter = new EventEmitter();

const app = new Hono()
	.use(logger())
	.use('*', cors())
	.get('/', (c) => c.text('Hono!'))
	.get('/getCode', (c) => {

		const code = getUniqueCode();
		games[code] = {
			date: Date.now(),
			players: [],
			listeners: 0,
			started: false,
			teamOrder: []
		}

		console.log("Created room", code);

		return c.json({
			code
		});
	}).get('/join/:id/:name', (c) => {
		const code = c.req.param('id');
		if (games[code] == null) {
			c.status(404);
			return c.text("Not found");
		}

		const game = games[code];

		const name = c.req.param('name');
		games[code].players.push({ name, fpts: 0 });

		console.log("Added", name, "to room", code);
		hostRoomEmitter.emit("join-" + code, name);

		c.status(200);
		return c.text("Game found");
	}).get('/start/:id', (c) => {
		const code = c.req.param('id');
		const game = games[code];
		if (game == null) {
			c.status(404);
			return c.text("Not found");
		}

		game.started = true;
		game.teamOrder = shuffle([...NFL_TEAMS]);

		for (const p of game.players) {
			delete p.roster;
		}


		hostRoomEmitter.emit("start-" + code);
		c.status(200);
		return c.text("Started");
	}).post('/done/:id/:name', validator('json', (value) => {
		return value as { roster: Roster };
	}), async (c) => {

		const { id, name } = c.req.param();

		const game = games[id];
		if (!game) return c.text("Not found", 404);

		const player = game.players.find(p => p.name == name);
		if (!player) return c.text("Player not found", 404);

		const body = await c.req.json<{ roster: Roster }>();
		if (!body.roster) return c.text("No roster", 404);
		player.roster = body.roster;
		player.fpts = getFantasyPoints(player.roster);

		hostRoomEmitter.emit("roster-" + id);
		return c.text("Done!");
	}).get('/hostStream/:id/:screen', (c) => {
		const code = c.req.param('id');
		const screen = c.req.param('screen') as SCREEN;
		if (games[code] == null) {
			c.status(404);
			return c.text("Not found");
		}
		const game = games[code];
		return streamSSE(c, async (stream) => {

			game.listeners++;

			if (game.started) {
				switch (screen) {
					case "RESULTS":
						await stream.writeSSE({ event: 'roster', data: JSON.stringify(game.players) })
						break;
					case "GAME":
						await stream.writeSSE({ event: 'team', data: JSON.stringify(game.teamOrder) })
						break;
					case "JOIN":
						await stream.writeSSE({ event: 'start', data: '' });
						break;
				}
			}

			let aborted = false;
			const onJoin = async (name: string) => {
				if (screen == "HOST") await stream.writeSSE({ event: 'join', data: name });
			};

			const onStart = async () => {
				if (screen == "RESULTS" || screen == "JOIN") await stream.writeSSE({ event: 'start', data: '' });
			};

			const onDone = async () => {
				if (screen == "RESULTS") await stream.writeSSE({ event: 'roster', data: JSON.stringify(game.players) });
			}

			hostRoomEmitter.on("join-" + code, onJoin);
			hostRoomEmitter.on("start-" + code, onStart);
			hostRoomEmitter.on("roster-" + code, onDone);
			stream.onAbort(() => {
				aborted = true;
				console.log("Host stream ended");
				hostRoomEmitter.off("join-" + code, onJoin);
				hostRoomEmitter.off("start-" + code, onStart);
				hostRoomEmitter.off("roster-" + code, onDone);
				game.listeners--;
				if (game.listeners == 0 && !game.started) {
					delete games[code];
					console.log("Removed inactive room");
				}

			});

			while (!aborted) {
				await stream.writeSSE({ event: 'keep-alive', data: "" });
				await stream.sleep(3000);
			}
		})
	})

export default app;
export type Server = typeof app;