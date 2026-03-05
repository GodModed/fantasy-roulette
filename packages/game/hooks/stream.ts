import { useEffect } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";
import { API_URL, ServerEvent } from "common/types"
import type { SCREEN } from "common/types"

const url = API_URL + "/api/hostStream/";

export type ListenerMap = {
	[k in ServerEvent]: EventSourceListener<ServerEvent, k>
}

export default function useEventStream(code: string, screen: SCREEN, enabled: boolean, listeners: Partial<ListenerMap>) {

	useEffect(() => {

		if (!enabled) return;

		const es = new EventSource<ServerEvent>(url + code + "/" + screen, {
			lineEndingCharacter: "\n"
		});

		(Object.keys(listeners) as ServerEvent[]).forEach(type => {
			const listener = listeners[type];
			if (!listener) return;
			es.addEventListener(type, listener as any);
		});

		return () => {
			es.removeAllEventListeners();
			es.close();
		}
	}, [code, enabled, listeners]);
}