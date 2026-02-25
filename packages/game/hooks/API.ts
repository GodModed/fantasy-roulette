import { API_URL, Roster } from "common/types";
import { hc } from "hono/client"; 
import { Server } from "server";
import useEventStream, { ListenerMap } from "./stream";

const client = hc<Server>(API_URL);

export const API = {
	index: () => {},
	getCode: async (): Promise<string> => {
		const res = await client.getCode.$get();
		if (!res.ok) return "XXXXXX"
	
		const json = await res.json();
		return json.code;
	},
	join: async (id: string, name: string): Promise<boolean> => {
		const res = await client.join[":id"][":name"].$get({
			param: {
				id,
				name
			}
		});
		
		return res.ok;
	},
	start: async (id: string): Promise<boolean> => {
		const res = await client.start[":id"].$get({
			param: {
				id
			}
		});

		return res.ok;
	},
	done: async (id: string, name: string, roster: Roster) => {
		const res = await client.done[":id"][":name"].$post({
			param: {
				id,
				name
			},
			json: {
				roster
			}
		})
	},
	stream: (id: string, enabled: boolean, listeners: Partial<ListenerMap>) => useEventStream(id, enabled, listeners)

};