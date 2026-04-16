import { useEffect, useState } from "react";
import { ROSTER_SETTINGS } from "common/types";
import { Text, View } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { API } from "@/hooks/API";
import { useNavigate } from "@/hooks/Navigate";
import { objectKeys } from "common";
import useGameState from "@/hooks/GameStore";
import { useShallow } from "zustand/shallow";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import Alert from "@blazejkustra/react-native-alert";
import { useDebounce } from "@/hooks/Debouncer";

export default function Host() {

	const navigate = useNavigate();

	const { clientName, gameSettings, setClientOptions, gamePlayers } = useGameState(
		useShallow(state => ({
			clientName: state.client.name,
			gameSettings: state.game.settings,
			setClientOptions: state.setClientOptions,
			gamePlayers: state.game.players
		}))
	);


	const [id, setID] = useState<string>("XXXXXX");
	const [hostName, setHostName] = useState<string>(clientName);
	const [rosterSettings, setRosterSettings] = useState<ROSTER_SETTINGS>(gameSettings);

	useEffect(() => {
		API.getCode().then(id => {
			if (id == "XXXXXX") return Alert.alert('Error', 'Could not generate a game code.');
			setID(id);
			setClientOptions({
				code: id,
				online: true,
				host: true
			});
			API.settings(id, rosterSettings);
		});
	}, []);

	useDebounce(() => {
		API.settings(id, rosterSettings);
	}, [id, rosterSettings], 500);

	async function onStart() {
		try {
			await API.settings(id, rosterSettings);
			setClientOptions({
				name: hostName
			})
			await API.join(id, hostName);
			await API.start(id);
			navigate("GAME");		
		} catch (e) {
			Alert.alert('Erorr', 'Could not start the game.');
		}
		

	}


	return (
		<>
			<View className="w-screen">

				<View className="m-10">
					<Text className="text-white text-4xl text-center font-black uppercase">
						Host
					</Text>
					<Text className="text-purple-600 text-4xl text-center font-black uppercase">
						Roulette
					</Text>
				</View>

				<Box className="flex-column items-center">
					<View className="bg-purple-700 w-3/4 lg:w-1/4 h-20 rounded-2xl justify-center">
						<Text className="text-white font-black text-2xl uppercase text-center self-center">
							Code: {id}
						</Text>	
					</View>

					<View className="w-3/4 lg:w-1/4 bg-zinc-950 rounded-2xl p-3 m-4">

						<Input className="mx-1 mb-4">
							<InputField className="text-white" placeholder="Name" value={hostName} onChangeText={setHostName}></InputField>
						</Input>

						{objectKeys(rosterSettings).map(setting => (
							// <Input key={setting} className="m-1">
							// 	<InputField
							// 		className="text-white"
							// 		placeholder={setting}
							// 		value={rosterSettings[setting]!.toString()}
							// 		onChangeText={n => {
							// 			const num = parseInt(n);
							// 			if (Number.isNaN(num)) return;
							// 			setRosterSettings({
							// 				...rosterSettings,
							// 				[setting]: num
							// 			});
							// 		}}
							// 	/>
							// </Input>

							<View className="flex-row items-center gap-4 m-2" key={setting}>
								<View className="w-16">
									<Text className="text-white">{setting} {rosterSettings[setting]}</Text>
								</View>
								

								<View className="flex-1">
									<Slider
										value={rosterSettings[setting]}
										onChange={e => {
											const newSettings = {
												...rosterSettings,
												[setting]: e
											}
											setRosterSettings(newSettings);
										}}
										size="sm"
										maxValue={5}
										step={1}
										minValue={0}
										orientation="horizontal"
										className="my-4 m-auto"
									>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>	
								</View>

								
							</View>

							
						))}
					</View>

					<Button
						className="m-2 bg-purple-700 w-1/2 lg:w-1/4 active:bg-purple-950 hover:bg-purple-800 self-center rounded-2xl disabled:bg-black px-4 py-2"
						onPress={onStart}
						disabled={id == "XXXXXX" || hostName.trim() == ""}
					>
						<Text className="text-purple-300 text-center text-2xl font-black m-auto">Start</Text>
					</Button>

				</Box>

				<Text className="text-white text-2xl text-center">Connected players: {gamePlayers.length}</Text>
				{gamePlayers.map(player => (
					<Text className="text-white text-md text-center" key={player.name}>{player.name}</Text>
				))}

			</View>

		</>
	)
}