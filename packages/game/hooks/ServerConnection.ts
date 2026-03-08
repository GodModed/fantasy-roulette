import { ClientOptions, ServerGame } from "common/types";
import { useEffect, useState } from "react";
import useGameState from "./GameStore";
import EventSource from "react-native-sse";

export default function ServerConnection() {

	const { client, setGame } = useGameState();

	useEffect(() => {
		console.log("Checking cond");
		if (client.code == "XXXXXX" || !client.online) return;
		
		const es = new EventSource<"state">(`/api/hostStream/${client.code}`, {
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

	return null;
}