import { createElement, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { GENERAL_STATE } from "common/types";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Game from "./screens/Game";
import Home from "./screens/Home";
import Host from "./screens/Host";
import Join from "./screens/Join";
import { StatusBar, Text, View } from "react-native";
import { Button, ButtonText } from "./components/ui/button";
import { OverlayProvider } from "@gluestack-ui/overlay";
import Results from "./screens/Results";
import { createStaticNavigation, StaticParamList, useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

const initialParams: GENERAL_STATE = {
	online: false,
	hosting: false,
	code: "",
	name: "",
	rosterSettings: {
		QB: 1,
		RB: 2,
		WR: 2,
		TE: 1,
		FLEX: 1
	},
	round: 0
}

const RootStack = createNativeStackNavigator({
	screenOptions: {
		headerShown: true,
		headerBackVisible: false,
		headerTitleAlign: "center",
		headerTintColor: "#ffffff",
		headerShadowVisible: false,
		headerLeft: HomeButton,
		headerStyle: {
			backgroundColor: "#18181b"
		},
		contentStyle: {
			backgroundColor: "#18181b"
		},
	},
	initialRouteName: "HOME",
	screens: {
		HOME: {
			screen: Home,
			initialParams,
			name: "HOME"
		},
		GAME: {
			screen: Game,
			initialParams,
			name: "GAME"
		},
		HOST: {
			screen: Host,
			initialParams,
			name: "HOST"
		},
		JOIN: {
			screen: Join,
			initialParams,
			name: "JOIN"
		},
		RESULTS: {
			screen: Results,
			initialParams,
			name: "RESULTS"
		}
	}
});

type RootStackParamList = StaticParamList<typeof RootStack>;
export type StackNavigationList = NativeStackNavigationProp<RootStackParamList>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
	return (
		<GluestackUIProvider mode="dark">
			<OverlayProvider>
				<SafeAreaProvider>
					<StatusBar barStyle="light-content" />
					<Navigation />
				</SafeAreaProvider>
			</OverlayProvider>
		</GluestackUIProvider>
	);
}

function HomeButton() {
	const navigation = useNavigation();
	const route = useRoute();
	
	if (route.name == "HOME") return;

	return (
		<Button
			className="m-4"
			onPress={() => navigation.reset({ index: 0, routes: [{ name: 'HOME', params: {
				...route.params,
				online: false,
				round: 0
			} }] })} 
		>
			<Text>Home</Text>
		</Button>
	);
}