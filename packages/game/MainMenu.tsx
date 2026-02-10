import { ComponentType, createElement, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import Game from "./Game";
import { GENERAL_STATE } from "common/types";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Home from "./Home";
import Host from "./Host";
import Join from "./Join";
import { Text, View } from "react-native";
import { Button } from "./components/ui/button";

export default function MainMenu() {
	const [globalState, setGlobalState] = useState<GENERAL_STATE>({
		screen: "HOME",
		playing: false,
		hosting: false	
	});

	return <>
        
		<GluestackUIProvider mode="dark">
			<SafeAreaProvider>
				<View className='flex justify-center items-center h-screen bg-zinc-900'>
					<SafeAreaView>
						{globalState.screen != "HOME" && (
							<Button
								className='bg-zinc-800 m-2 hover:bg-zinc-900'
								onPress={() => setGlobalState(s => ({
									...s,
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
								"SOLO": Game,
								"HOST": Host,
								"HOME": Home,
								"JOIN": Join
							}}
						/>
					</SafeAreaView>
				</View>
			</SafeAreaProvider>
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