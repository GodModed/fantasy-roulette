import { Text } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { SCREEN } from "common/types";
import { useNavigate } from "@/hooks/Navigate";
import useGameState from "@/hooks/GameStore";

export default function Home() {
	return (
		<>
			<Text className="text-white text-center text-base text-lg m-10">Fantasy Roulette</Text>
			<ButtonGroup space="sm" flexDirection="column">
				<ScreenButton displayName="SOLO" screen="GAME" />
				<ScreenButton displayName="JOIN" screen="JOIN" />
				<ScreenButton displayName="HOST" screen="HOST" />
			</ButtonGroup>

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


	return <Button
		className="bg-zinc-800 hover:bg-zinc-900"
		onPress={() => {
			setClientOptions({
				code: "XXXXXX",
				online: false
			});

			navigate(screen)
		}}
	>
		<Text className="text-white text-base">{displayName}</Text>
	</Button>
}