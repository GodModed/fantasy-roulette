import { API_URL, Roster, SCREEN, ServerGame } from "common/types";
import { hc } from "hono/client"; 
import { Server } from "server";
import useEventStream, { ListenerMap } from "./stream";

const client = hc<Server>(API_URL);

export const API = {
	getCode: async (): Promise<string> => {
		const res = await client.api.getCode.$get();
		if (!res.ok) return "XXXXXX"
	
		const json = await res.json();
		console.log(json);
		return json.code;
	},
	join: async (id: string, name: string): Promise<boolean> => {
		const res = await client.api.join[":id"][":name"].$get({
			param: {
				id,
				name
			}
		});
		
		return res.ok;
	},
	start: async (id: string): Promise<boolean> => {
		const res = await client.api.start[":id"].$get({
			param: {
				id
			}
		});

		return res.ok;
	},
	done: async (id: string, name: string, roster: Roster) => {
		const res = await client.api.done[":id"][":name"].$post({
			param: {
				id,
				name
			},
			json: {
				roster
			}
		})

		return res.ok;
	},
	stream: (id: string, enabled: boolean, onState: (state: ServerGame) => void) => useEventStream(id, enabled, onState)

};