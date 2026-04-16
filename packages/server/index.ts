import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { EventEmitter } from 'node:events';
import { type ServerGame, NFL_TEAMS, type Roster, type ROSTER_SETTINGS } from "common/types";
import { getFantasyPoints, shuffle } from 'common';
import { logger } from 'hono/logger';
import { validator } from 'hono/validator';
import { cors } from 'hono/cors';
import { websocket, serveStatic } from 'hono/bun';
import { setTimeout } from 'node:timers';

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
const timeouts: Record<string, ReturnType<typeof setTimeout>> = {};
const hostRoomEmitter = new EventEmitter();

const api = new Hono()
	.get('/getCode', (c) => {

		const code = getUniqueCode();
		games[code] = {
			date: Date.now(),
			players: [],
			listeners: 0,
			started: false,
			teamOrder: [],
			round: 0,
			settings: {
				QB: 1,
				RB: 2,
				WR: 2,
				TE: 1,
				FLEX: 1
			}
		}


		return c.json({
			code
		});
	}).get('/join/:id/:name', (c) => {
		const code = c.req.param('id');
		if (!code) return c.text("No id", 404);
		if (games[code] == null) {
			c.status(404);
			return c.text("Not found");
		}

		const game = games[code];

		const name = c.req.param('name');
		if (!name) return c.text("No name", 404);
		game.players.push({ name, fpts: 0 });

		hostRoomEmitter.emit("state-" + code);

		c.status(200);
		return c.text("Game found");
	}).get('/start/:id', (c) => {
		const code = c.req.param('id');
		if (!code) return c.text("No id", 404);
		const game = games[code];
		if (game == null) {
			c.status(404);
			return c.text("Not found");
		}

		game.started = true;
		game.teamOrder = shuffle([...NFL_TEAMS]);
		game.round++;

		for (const p of game.players) {
			delete p.roster;
			p.fpts = 0;
		}


		hostRoomEmitter.emit("state-" + code);
		c.status(200);
		return c.text("Started");
	}).post('/settings/:id', validator('json', (value) => {
		return value as { settings: ROSTER_SETTINGS }
	}), async (c) => {

		const id = c.req.param('id');
		if (!id) return c.text("No id", 404);
		const game = games[id];
		if (!game) return c.text("Not found", 404);

		const body = await c.req.json<{ settings: ROSTER_SETTINGS }>();
		if (!body.settings) return c.text("No settings", 404);

		game.settings = body.settings;

		hostRoomEmitter.emit("state-" + id);
		return c.text("Done!");


	}).post('/done/:id/:name', validator('json', (value) => {
		return value as { roster: Roster };
	}), async (c) => {

		const { id, name } = c.req.param();
		if (!id || !name) return c.text("Invalid params", 404);
		const game = games[id];
		if (!game) return c.text("Not found", 404);

		const player = game.players.find(p => p.name == name);
		if (!player) return c.text("Player not found", 404);

		const body = await c.req.json<{ roster: Roster }>();
		if (!body.roster) return c.text("No roster", 404);
		player.roster = body.roster;
		player.fpts = getFantasyPoints(player.roster);

		hostRoomEmitter.emit("state-" + id);
		return c.text("Done!");
	}).get('/hostStream/:id', (c) => {
		const code = c.req.param('id');
		if (!code) return c.text("No id", 404);
		if (games[code] == null) {
			c.status(404);
			return c.text("Not found");
		}
		const game = games[code];
		return streamSSE(c, async (stream) => {
			const emitState = async () => {
				await stream.writeSSE({ event: "state", data: JSON.stringify(game) });
			}

			game.listeners++;
			if (timeouts[code]) clearTimeout(timeouts[code]);
			emitState();

			let aborted = false;

			hostRoomEmitter.on("state-" + code, emitState);
			stream.onAbort(() => {
				aborted = true;
				hostRoomEmitter.off("state-" + code, emitState);
				game.listeners--;

				if (game.listeners == 0) {
					if (timeouts[code]) clearTimeout(timeouts[code]);
					timeouts[code] = setTimeout(() => {
						if (game.listeners != 0) return;
						console.log("Deleted code", code);
						delete games[code];
						delete timeouts[code];
					}, 1000 * 60 * 10)

					console.log("Started timeout for code", code);
				}

			});

			while (!aborted) {
				await stream.writeSSE({ event: 'keep-alive', data: "" });
				await stream.sleep(3000);
			}
		})
	})

const app = new Hono()
	.use(logger())
	.use('*', cors())
	.route('/api', api)
	.get('*', serveStatic({
		root: "../game/dist"
	}))
	// .all('*', (c) => {
	// 	const url = new URL(c.req.url);
	// 	url.host = new URL(TARGET).host;
	// 	url.protocol = new URL(TARGET).protocol;

	// 	return proxyWs(url.toString(), {
	// 		...c.req,
	// 		headers: {
	// 			...c.req.header(),
	// 			host: new URL(TARGET).host
	// 		}
	// 	}, c)
	// })



export default {
	port: 3000,
	fetch: app.fetch,
	websocket
};
export type Server = typeof app;