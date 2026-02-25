import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { API_URL, GENERAL_STATE, SCREEN } from "common/types";
import { Text, TextInputProps } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { API } from "@/hooks/API";

export default function Join({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

	const [code, setCode] = useState<string>("");
	const [name, setName] = useState<string>(globalState.name);

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

	API.stream(code, waiting, listeners);

	async function onClick() {
		const isIn = await API.join(code, name);
		if (isIn) setWaiting(true);
		else setWaiting(false);
	}

	return (
		<>
			<Box className="flex-column p-4 items-center">
				<Input className="m-4">
					<InputField className="text-white" value={code} onChangeText={setCode} placeholder="Code"></InputField>
				</Input>

				<Input className="m-4">
					<InputField className="text-white" value={name} onChangeText={setName} placeholder="Name"></InputField>
				</Input>

				<Button className="m-4" onPress={onClick} disabled={waiting || name.trim() == "" || code.trim() == ""}>
					<Text>Join</Text>
				</Button>

			</Box>

			{waiting && (
				<Text className="text-base text-white text-xl">Waiting for host to start the game...</Text>
			)}

		</>
	)
}