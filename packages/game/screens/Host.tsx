import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { API_URL, GENERAL_STATE, SCREEN, ScreenProps } from "common/types";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { type Server} from "server";
import { hc } from "hono/client";
import { API } from "@/hooks/API";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Host({ route }: ScreenProps) {

	const navigation = useNavigation();
	const screen = useRoute();

	const [id, setID] = useState<string>("XXXXXX");
	const [names, setNames] = useState<string[]>([]);

	const [hostName, setHostName] = useState<string>(route.params.name);

	useEffect(() => {
		API.getCode().then(id => setID(id));
	}, []);

	const listeners: Partial<ListenerMap> = useMemo(() => ({
	    join: (event) => {
	        const data = event.data;
	        if (!data) return;
	        setNames(n => ([...n, data]));
	    }
	}), []);


	API.stream(id, screen.name as SCREEN, id != "XXXXXX", listeners);

	async function onStart() {
		await API.join(id, hostName);
		await API.start(id);

		navigation.navigate("GAME", {
			...route.params,
			online: true,
			hosting: true,
			code: id,
			name: hostName
		})
	}

	// make network request here to get id generated for game

	return (
		<>
			<Box className="flex-column p-4 items-center">
				<Text className="m-4 text-white bg-rose-700 p-2 rounded text-base text-center justify-center font-mono">
					{id}
				</Text>

				<Input className="m-4 text-white">
					<InputField className="text-white" placeholder="Name" value={hostName} onChangeText={setHostName}></InputField>
				</Input>

				<Button className="m-4" onPress={onStart} disabled={id == "XXXXXX" || hostName.trim() == ""}>
					<Text className="text-black">Start</Text>
				</Button>

			</Box>

			{names.map(name => (
				<Text className="text-white text-base text-center" key={name}>{name}</Text>
			))}

		</>
	)
}