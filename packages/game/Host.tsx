import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GENERAL_STATE } from "./types";
import { Text } from "react-native";
import { Box } from "./components/ui/box";
import { Input, InputField } from "./components/ui/input";
import { Button } from "./components/ui/button";
import EventSource from "react-native-sse";

const API_URL = "http://localhost:3000";

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

	useEffect(() => {
		if (id == "XXXXXX") return;
		console.log(id);
		const es = new EventSource<"join">(API_URL + "/hostStream/" + id, {
			lineEndingCharacter: "\n"
		});
		es.addEventListener("join", (event) => {
			const data = event.data;
			console.log(data);
			if (!data) return;
			setNames(n => ([...n, data]));
		});

		return (() => {
			es.removeAllEventListeners();
			es.close();
		});

	}, [id]);

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