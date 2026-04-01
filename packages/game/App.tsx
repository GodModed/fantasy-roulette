import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Game from "./screens/Game";
import Home from "./screens/Home";
import Host from "./screens/Host";
import Join from "./screens/Join";
import { Pressable, StatusBar, Text } from "react-native";
import { House } from "lucide-react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";
import Results from "./screens/Results";
import { createStaticNavigation, StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigate } from "./hooks/Navigate";
import useGameState from "./hooks/GameStore";
import useServerConnection from "./hooks/ServerConnection";

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
		}
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

	useServerConnection();

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

	const setClientOptions = useGameState(state => state.setClientOptions);
	const setGame = useGameState(state => state.setGame);

	const navigate = useNavigate();


	return (
		<Pressable className="w-10 h-10 items-center justify-center"
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
			<House color="white" className="m-auto" size={32} />
		</Pressable>
	);
}
