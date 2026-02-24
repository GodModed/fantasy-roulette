import { createElement, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { GENERAL_STATE } from "common/types";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Game from "./screens/Game";
import Home from "./screens/Home";
import Host from "./screens/Host";
import Join from "./screens/Join";
import { StatusBar, Text, View } from "react-native";
import { Button } from "./components/ui/button";
import { OverlayProvider } from "@gluestack-ui/overlay";
import Results from "./screens/Results";

export default function MainMenu() {
	const [globalState, setGlobalState] = useState<GENERAL_STATE>({
		screen: "HOME",
		online: false,
		hosting: false,
		code: "",
		name: ""
	});

	return <>
		<GluestackUIProvider mode="dark">
			<OverlayProvider>
				<SafeAreaProvider>
					<View className='flex justify-center items-center h-screen bg-zinc-900 flex-1'>
						<SafeAreaView className="flex-1">
							<StatusBar barStyle="light-content" />
							{globalState.screen != "HOME" && (
								<Button
									className='bg-zinc-800 m-2 hover:bg-zinc-900'
									onPress={() => setGlobalState(s => ({
										...s,
										online: false,
										code: "",
										screen: "HOME"
									}))}
								>
									<Text className="text-white text-base">Back</Text>
								</Button>
							)}
							<Switch
								globalState={globalState}
								setGlobalState={setGlobalState}
								keys={{
									"GAME": Game,
									"HOST": Host,
									"HOME": Home,
									"JOIN": Join,
									"RESULTS": Results
								}}
							/>
						</SafeAreaView>
					</View>
				</SafeAreaProvider>
			</OverlayProvider>
		</GluestackUIProvider>
	        
	</>

}

export function Switch({
	globalState,
	setGlobalState,
	keys
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>> 
	keys: Record<GENERAL_STATE["screen"], ReactNode | FC<{ globalState: GENERAL_STATE, setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>> }>>
}) {

	const elm = keys[globalState.screen];
	if (elm instanceof Function) {
		return createElement(elm, { globalState, setGlobalState });
	}
	return <>{elm}</>;
}