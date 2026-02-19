import { useEffect } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";
import { ServerEvent } from "common/types"

const url = "http://10.168.168.146:3000/hostStream/";


export type ListenerMap = {
	[k in ServerEvent]: EventSourceListener<ServerEvent, k>
}

export default function useEventStream(code: string, enabled: boolean, listeners: Partial<ListenerMap>) {

	useEffect(() => {

		if (!enabled) return;

		const es = new EventSource<ServerEvent>(url + code, {
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