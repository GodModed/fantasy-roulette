import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { API } from "@/hooks/API";
import { useNavigate } from "@/hooks/Navigate";
import useGameState from "@/hooks/GameStore";
import { useShallow } from "zustand/shallow";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { objectKeys } from "common";
import Alert from '@blazejkustra/react-native-alert';

export default function Join() {

	const navigate = useNavigate();
	const { setClientOptions, clientName, gameStarted, gameSettings } = useGameState(
		useShallow((state) => ({
			setClientOptions: state.setClientOptions,
			clientName: state.client.name,
			gameStarted: state.game.started,
			gameSettings: state.game.settings
		}))
	)
	
	const [code, setCode] = useState<string>("");
	const [name, setName] = useState<string>(clientName);
	const [waiting, setWaiting] = useState<boolean>(false);

	useEffect(() => {
		setClientOptions({
			online: true,
			host: false
		})
	}, [])

	useEffect(() => {
		if (gameStarted && waiting) {
			navigate("GAME");
		}
	}, [gameStarted, waiting])

	async function onClick() {
		const isIn = await API.join(code, name);

		if (isIn) {
			setWaiting(true);
			setClientOptions({
				code,
				name
			});
		}
		else {
			setWaiting(false);
			Alert.alert('Error', 'Failed to join the game.');
		}
	}

	return (
		<>
			<View className="w-screen">
				<View className="m-10">
					<Text className="text-white text-4xl text-center font-black uppercase">Join</Text>
					<Text className="text-purple-600 text-4xl text-center font-black uppercase">Roulette</Text>	
				</View>
				<View className="w-3/4 md:w-1/4 bg-zinc-950 rounded-2xl p-3 m-4 self-center">
					<Input className="mx-1 my-4">
						<InputField className="text-white" value={code} onChangeText={setCode} placeholder="Code"></InputField>
					</Input>
					<Input className="mx-1 my-4">
						<InputField className="text-white" value={name} onChangeText={setName} placeholder="Name"></InputField>
					</Input>
				</View>
				<Button
					className="m-2 bg-purple-700 w-1/2 md:w-1/4 active:bg-purple-950 hover:bg-purple-800 self-center rounded-2xl disabled:bg-black px-4 py-2"
					onPress={onClick}
					disabled={waiting || name.trim() == "" || code.trim() == ""}
				>
					<Text className="text-purple-300 text-center text-2xl font-black m-auto">Join</Text>
				</Button>

				{waiting && <>
					<View className="w-3/4 md:w-1/4 bg-zinc-950 rounded-2xl p-3 m-4 self-center">
						{objectKeys(gameSettings).map(setting => (
							<View className="flex-row items-center gap-4 m-2">
								<View className="w-16">
									<Text className="text-white">{setting} {gameSettings[setting]}</Text>
								</View>
								

								<View className="flex-1">
									<Slider
										value={gameSettings[setting]}
										size="sm"
										maxValue={5}
										step={1}
										minValue={0}
										orientation="horizontal"
										className="my-4 m-auto"
										isDisabled={true}
									>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>	
								</View>

								
							</View>
						))}
						<Text className="text-center text-white text-2xl">Waiting for host to start the game...</Text>
					</View>
				</>}
			</View>

		</>
	)
}