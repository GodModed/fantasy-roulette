import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { GENERAL_STATE } from "common/types";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { listen } from "bun";

const API_URL = "http://10.212.46.68:3000";

export default function Host({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

	const [id, setID] = useState<string>("XXXXXX");
	const [names, setNames] = useState<string[]>([]);
	useEffect(() => {
		fetch(API_URL + "/getCode")
			.then(res => res.json())
			.then(json => setID(json.code));

		console.log("Created", id);
	}, []);

	const listeners: Partial<ListenerMap> = useMemo(() => ({
	    join: (event) => {
	        const data = event.data;
	        if (!data) return;
	        setNames(n => ([...n, data]));
	    }
	}), []);

	useEventStream(id, id != "XXXXXX", listeners);

	function onStart() {
		fetch(API_URL + "/start/" + id)
			.then(res => {

			});
	}

	// make network request here to get id generated for game

	return (
		<>
			<Box className="flex-row p-4 items-center">
				<Text className="mx-4 text-white bg-rose-700 p-2 rounded text-base text-center justify-center font-mono">
					{id}
				</Text>

				<Input className="mx-4">
					<InputField placeholder="Name"></InputField>
				</Input>

				<Button className="mx-4" onPress={onStart}>
					<Text>Start</Text>
				</Button>

			</Box>

			{names.map(name => (
				<Text className="text-white text-base text-center" key={name}>{name}</Text>
			))}

		</>
	)
}