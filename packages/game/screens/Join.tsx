import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { API_URL, GENERAL_STATE, SCREEN } from "common/types";
import { Text, TextInputProps } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";

export default function Join({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

	const [code, setCode] = useState<string>("");
	const [name, setName] = useState<string>("");

	const [waiting, setWaiting] = useState<boolean>(false);

	const listeners: Partial<ListenerMap> = useMemo(() => ({
	    start: (event) => {
	        setGlobalState(s => ({
	        	...s,
	        	screen: "GAME",
	        	code,
	        	online: true,
	        	name
	        }));
	    }
	}), [code, name]);

	useEventStream(code, waiting, listeners);

	function onClick() {
		fetch(API_URL + "/join/" + code + "/" + name).then((res) => {
			if (res.status == 200) setWaiting(true);
			else {
				setWaiting(false);
			}
		})
	}

	return (
		<>
			<Box className="flex-row p-4 items-center">
				<Input className="mx-4">
					<InputField value={code} onChangeText={setCode} placeholder="Code"></InputField>
				</Input>

				<Input className="mx-4">
					<InputField value={name} onChangeText={setName} placeholder="Name"></InputField>
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