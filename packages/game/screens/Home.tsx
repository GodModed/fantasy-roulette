import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { GENERAL_STATE, SCREEN, ScreenProps } from "common/types";
import { Dispatch, SetStateAction } from "react";
import { useNavigation } from "@react-navigation/native";
import navigate from "@/hooks/navigate";
import { StackNavigationList } from "@/App";

export default function Home({ route }: ScreenProps) {
	return (
		<>
			<Text className="text-white text-center text-base text-lg m-10">Fantasy Roulette</Text>
			<ButtonGroup space="sm" flexDirection="column">
				<ScreenButton displayName="SOLO" screen="GAME" state={route.params} />
				<ScreenButton displayName="JOIN" screen="JOIN" state={route.params} />
				<ScreenButton displayName="HOST" screen="HOST" state={route.params} />
			</ButtonGroup>

		</>
	)
}

function ScreenButton({
	displayName,
	screen,
	state
}: {
	displayName: string,
	screen: SCREEN,
	state: GENERAL_STATE
}) {


	const navigation = useNavigation();

	return <Button
				className="bg-zinc-800 hover:bg-zinc-900"
				onPress={() => {
					navigate(navigation as StackNavigationList, screen, {
						...state,
						online: false,
						code: ""
					});
				}}
			>
				<Text className="text-white text-base">{displayName}</Text>
			</Button>
}