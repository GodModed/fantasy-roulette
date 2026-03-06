import { useEffect } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";
import { API_URL, ServerEvent } from "common/types"
import type { SCREEN, ServerGame } from "common/types"

const url = API_URL + "/api/hostStream/";

export type ListenerMap = {
	[k in ServerEvent]: EventSourceListener<ServerEvent, k>
}

export default function useEventStream(code: string, enabled: boolean, onState: (state: ServerGame) => void) {

	useEffect(() => {

		if (!enabled) return;

		const es = new EventSource<"state">(url + code, {
			lineEndingCharacter: "\n"
		});

		es.addEventListener("state", (e) => {
			onState(JSON.parse(e.data ?? "") as ServerGame);
		});

		return () => {
			es.removeAllEventListeners();
			es.close();
		}
	}, [code, enabled, onState]);
}