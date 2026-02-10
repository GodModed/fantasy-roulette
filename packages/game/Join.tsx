import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GENERAL_STATE, SCREEN } from "./types";
import { Text, TextInputProps } from "react-native";
import { Box } from "./components/ui/box";
import { Input, InputField } from "./components/ui/input";
import { Button } from "./components/ui/button";
import EventSource from "react-native-sse";

const API_URL = "http://localhost:3000";

export default function Join({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {


	const codeRef = useRef<TextInputProps>(null);
	const nameRef = useRef<TextInputProps>(null);

	const [waiting, setWaiting] = useState<boolean>(false);
	useEffect(() => {
		if (!waiting) return;
		const es = new EventSource<"start">(API_URL + "/hostStream/" + codeRef.current?.value, {
			lineEndingCharacter: "\n"
		});
		es.addEventListener("start", (event) => {
			setGlobalState(s => ({
				...s,
				screen: "SOLO"
			}));
		});

		return (() => {
			es.removeAllEventListeners();
			es.close();
		});

	}, [waiting]);

	function onClick() {
		fetch(API_URL + "/join/" + codeRef.current?.value + "/" + nameRef.current?.value).then((res) => {
			if (res.status == 200) setWaiting(true);
			else {
				setWaiting(false);
			}
			// setGlobalState(s => ({
			// 	...s,
			// 	screen: nextScreen
			// }));
		})
	}

	return (
		<>
			<Box className="flex-row p-4 items-center">
				<Input className="mx-4">
					<InputField ref={codeRef} placeholder="Code"></InputField>
				</Input>

				<Input className="mx-4">
					<InputField ref={nameRef} placeholder="Name"></InputField>
				</Input>

				<Button className="mx-4" onPress={onClick} disabled={waiting}>
					<Text>Join</Text>
				</Button>

			</Box>

			{waiting && (
				<Text className="text-base text-white text-xl">Waiting for host to start the game...</Text>
			)}

		</>
	)
}