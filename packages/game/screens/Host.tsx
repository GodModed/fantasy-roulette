import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { API_URL, GENERAL_STATE } from "common/types";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";


export default function Host({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

	const [id, setID] = useState<string>("XXXXXX");
	const [names, setNames] = useState<string[]>([]);

	const [hostName, setHostName] = useState<string>("");

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

	async function onStart() {
		await fetch(API_URL + "/join/" + id + "/" + hostName);
		const res = await fetch(API_URL + "/start/" + id)
		setGlobalState(s => ({
			...s,
			screen: "GAME",
			online: true,
			hosting: true,
			code: id,
			name: hostName
		}));
	}

	// make network request here to get id generated for game

	return (
		<>
			<Box className="flex-row p-4 items-center">
				<Text className="mx-4 text-white bg-rose-700 p-2 rounded text-base text-center justify-center font-mono">
					{id}
				</Text>

				<Input className="mx-4">
					<InputField placeholder="Name" value={hostName} onChangeText={setHostName}></InputField>
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