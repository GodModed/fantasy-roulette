import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Button, ButtonGroup } from "./components/ui/button";
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

				{SCREEN.map(status => {

					if (status == globalState.screen) return;

					return <Button
						className='bg-zinc-800 hover:bg-zinc-900'
						onPress={() => setGlobalState(s => ({
							...s,
							screen: status
						}))}
					>
						<Text className="text-white text-base" >{status}</Text>
					</Button>
				})}
			</ButtonGroup>

		</>
	)
}