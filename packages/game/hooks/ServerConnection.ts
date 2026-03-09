import { API_URL, ServerGame } from "common/types";
import { useEffect } from "react";
import useGameState from "./GameStore";
import EventSource from "react-native-sse";

export default function useServerConnection() {

	const { client, setGame } = useGameState();

	useEffect(() => {
		if (client.code == "XXXXXX" || !client.online) return;
		
		const es = new EventSource<"state">(`${API_URL}/api/hostStream/${client.code}`, {
			lineEndingCharacter: "\n",
		});

		es.addEventListener("state", (e) => {
			setGame(JSON.parse(e.data!) as Partial<ServerGame>);
		});

		return (() => {
			es.removeAllEventListeners();
			es.close();
		});

	}, [client.code, client.online]);
}