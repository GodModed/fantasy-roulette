import { useEffect, useState } from "react";
import { ROSTER_SETTINGS } from "common/types";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { API } from "@/hooks/API";
import { useNavigate } from "@/hooks/Navigate";
import { objectKeys } from "common";
import useGameState from "@/hooks/GameStore";

export default function Host() {

	const navigate = useNavigate();
	const { game, client, setClientOptions } = useGameState();

	const [id, setID] = useState<string>("XXXXXX");
	const [hostName, setHostName] = useState<string>(client.name);
	const [rosterSettings, setRosterSettings] = useState<ROSTER_SETTINGS>(game.settings);

	useEffect(() => {
		API.getCode().then(id => {
			setID(id);
			setClientOptions({
				code: id,
				online: true,
				host: true
			});
		});
	}, []);

	async function onStart() {
		await API.settings(id, rosterSettings);
		setClientOptions({
			name: hostName
		})
		await API.join(id, hostName);
		await API.start(id);

		navigate("GAME");
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

			{game.players.map(player => (
				<Text className="text-white text-base text-center" key={player.name}>{player.name}</Text>
			))}

		</>
	)
}