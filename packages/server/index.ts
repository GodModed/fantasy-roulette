import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE, SSEStreamingApi } from 'hono/streaming';
import { EventEmitter } from 'node:events';
import type { ServerPlayer, ServerGame } from "common/types";
const app = new Hono();
app.use('*', cors());

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
const hostRoomEmitter = new EventEmitter<{
	[K in (`join-${string}` | `start-${string}`)]: []
}>();

app.get('/', (c) => c.text('Hono!'));
app.get('/getCode', (c) => {

	const code = getUniqueCode();
	games[code] = {
		date: Date.now(),
		players: []
	};

	console.log("Created room", code);

	return c.json({
		code
	});
});
app.get('/join/:id/:name', (c) => {
	const code = c.req.param('id');
	if (games[code] == null) {
		c.status(404);
		return c.text("Not found");
	}

	const game = games[code];

	const name = c.req.param('name');
	games[code].players.push({ name });

	console.log("Added", name, "to room", code);
	hostRoomEmitter.emit("join-" + code, name);

	c.status(200);
	return c.text("Game found");
});
app.get('/start/:id', (c) => {
	const code = c.req.param('id');
	if (games[code] == null) {
		c.status(404);
		return c.text("Not found");
	}

	hostRoomEmitter.emit("start-" + code);
	c.status(200);
	return c.text("Started");
});
app.get('/hostStream/:id', (c) => {
	const code = c.req.param('id');
	if (games[code] == null) {
		c.status(404);
		return c.text("Not found");
	}
	const game = games[code];
	return streamSSE(c, async (stream) => {
		let aborted = false;
		const onJoin = async (name: string) => {
			await stream.writeSSE({ event: 'join', data: name });
		};

		const onStart = async () => {
			await stream.writeSSE({ event: 'start', data: '' });
		};

		hostRoomEmitter.on("join-" + code, onJoin);
		hostRoomEmitter.on("start-" + code, onStart);
		stream.onAbort(() => {
			aborted = true;
			console.log("Host stream ended");
			hostRoomEmitter.off("join-" + code, onJoin);
			hostRoomEmitter.off("start-" + code, onStart);
		});

		while (!aborted) {
			await stream.writeSSE({ event: 'keep-alive', data: "" });
			await stream.sleep(3000);
		}
	})
})

export default app;