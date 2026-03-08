import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Game from "./screens/Game";
import Home from "./screens/Home";
import Host from "./screens/Host";
import Join from "./screens/Join";
import { StatusBar, Text } from "react-native";
import { Button } from "./components/ui/button";
import { OverlayProvider } from "@gluestack-ui/overlay";
import Results from "./screens/Results";
import { createStaticNavigation, StaticParamList, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigate } from "./hooks/Navigate";
import ServerConnection from "./hooks/ServerConnection";
import useGameState from "./hooks/GameStore";

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
			name: "HOME"
		},
		GAME: {
			screen: Game,
			name: "GAME"
		},
		HOST: {
			screen: Host,
			name: "HOST"
		},
		JOIN: {
			screen: Join,
			name: "JOIN"
		},
		RESULTS: {
			screen: Results,
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
					<ServerConnection />
					<Navigation />
				</SafeAreaProvider>
			</OverlayProvider>
		</GluestackUIProvider>
	);
}

function HomeButton() {

	const { setClientOptions, setGame } = useGameState();
	const navigate = useNavigate();

	const route = useRoute();	
	if (route.name == "HOME") return;


	return (
		<Button
			className="m-4"
			onPress={() => {
				setClientOptions({
					code: "XXXXXX",
					online: false,
					host: false
				});
				setGame({
					round: 0,
					started: false
				})
				navigate("HOME");
			}} 
		>
			<Text>Home</Text>
		</Button>
	);
}