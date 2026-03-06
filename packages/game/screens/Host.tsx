import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { API_URL, GENERAL_STATE, ROSTER_SETTINGS, SCREEN, ScreenProps, ServerGame, ServerPlayer } from "common/types";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EventSource from "react-native-sse";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { type Server } from "server";
import { hc } from "hono/client";
import { API } from "@/hooks/API";
import { useNavigation, useRoute } from "@react-navigation/native";
import navigate from "@/hooks/navigate";
import { objectKeys } from "common";
import { StackNavigationList } from "@/App";

export default function Host({ route }: ScreenProps) {

	const navigation = useNavigation();
	const screen = useRoute();

	const [id, setID] = useState<string>("XXXXXX");
	const [players, setPlayers] = useState<ServerPlayer[]>([]);

	const [hostName, setHostName] = useState<string>(route.params.name);

	const [rosterSettings, setRosterSettings] = useState<ROSTER_SETTINGS>(route.params.rosterSettings);

	useEffect(() => {
		API.getCode().then(id => setID(id));
	}, []);

	const onState = useCallback((state: ServerGame) => {
		setPlayers(state.players);
	}, []);


	API.stream(id, id != "XXXXXX", onState);

	async function onStart() {
		await API.join(id, hostName);
		await API.start(id);

		navigate(navigation as StackNavigationList, "GAME", {
			...route.params,
			online: true,
			hosting: true,
			code: id,
			name: hostName,
			rosterSettings,
			round: 1
		});
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

				{objectKeys(rosterSettings).map(setting => (
					<Input className="m-1 text-white" key={setting}>
						<InputField className="text-white" placeholder={setting} value={rosterSettings[setting]!.toString()} onChangeText={n => {
							const num = parseInt(n);
							if (Number.isNaN(num)) return;
							setRosterSettings({
								...rosterSettings,
								[setting]: num
							})
						}} />
					</Input>
				))}

				<Button className="m-4" onPress={onStart} disabled={id == "XXXXXX" || hostName.trim() == ""}>
					<Text className="text-black">Start</Text>
				</Button>

			</Box>

			{players.map(player => (
				<Text className="text-white text-base text-center" key={player.name}>{player.name}</Text>
			))}

		</>
	)
}