import { Pressable, Text, View } from "react-native";
import { ButtonGroup } from "../components/ui/button";
import { SCREEN } from "common/types";
import { useNavigate } from "@/hooks/Navigate";
import useGameState from "@/hooks/GameStore";

export default function Home() {
	return (
		<>
			<View className="w-screen">
				<View className="m-10">
					<Text className="text-white text-4xl text-center font-black uppercase">Fantasy</Text>
					<Text className="text-purple-600 text-4xl text-center font-black uppercase">Roulette</Text>	
				</View>
				<ButtonGroup space="sm" flexDirection="column" className="w-screen self-center">
					<ScreenButton displayName="SOLO" screen="GAME" />
					<ScreenButton displayName="JOIN" screen="JOIN" />
					<ScreenButton displayName="HOST" screen="HOST" />
				</ButtonGroup>
			</View>
		</>
	)
}

function ScreenButton({
	displayName,
	screen
}: {
	displayName: string,
	screen: SCREEN
}) {

	const setClientOptions = useGameState(state => state.setClientOptions);
	const navigate = useNavigate();


	return <Pressable
		className="bg-purple-700 w-3/4 md:w-1/4 active:bg-purple-950 hover:bg-purple-800 shadow-md self-center px-4 py-2 rounded-2xl"
		onPress={() => {
			setClientOptions({
				code: "XXXXXX",
				online: false
			});

			navigate(screen)
		}}
	>
		<Text className="text-purple-300 text-center text-2xl font-black m-auto">{displayName}</Text>
	</Pressable>
}