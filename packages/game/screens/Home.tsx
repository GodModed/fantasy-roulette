import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { GENERAL_STATE, SCREEN } from "common/types";
import { Dispatch, SetStateAction } from "react";

export default function Home({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {
	return (
		<>
			<Text className="text-white text-base text-lg m-10">Fantasy Roulette</Text>
			<ButtonGroup space="sm" flexDirection="column">
				<ScreenButton displayName="SOLO" screen="GAME" setGlobalState={setGlobalState} />
				<ScreenButton displayName="JOIN" screen="JOIN" setGlobalState={setGlobalState} />
				<ScreenButton displayName="HOST" screen="HOST" setGlobalState={setGlobalState} />
			</ButtonGroup>

		</>
	)
}

function ScreenButton({
	displayName,
	screen,
	setGlobalState
}: {
	displayName: string,
	screen: SCREEN,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {
	return <Button
				className="bg-zinc-800 hover:bg-zinc-900"
				onPress={() => {
					setGlobalState(s => ({
						...s,
						screen,
						online: false
					}))
				}}
			>
				<Text className="text-white text-base">{displayName}</Text>
			</Button>
}