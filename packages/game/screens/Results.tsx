import { ScrollView, Text, View } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { API_URL, GENERAL_STATE, ROSTER_POSITIONS, SCREEN, ScreenProps, ServerGame, ServerPlayer } from "common/types";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { Box } from "@/components/ui/box";
import RosterDisplay from "@/components/game/RosterDisplay";
import { Divider } from "@/components/ui/divider";
import { API } from "@/hooks/API";
import { useNavigation, useRoute } from "@react-navigation/native";
import navigate from "@/hooks/navigate";
import { StackNavigationList } from "@/App";

export default function Results({ route }: ScreenProps) {

	const navigation = useNavigation();
	const screen = useRoute();

	const [players, setPlayers] = useState<ServerPlayer[]>([]);
	const listeners: Partial<ListenerMap> = useMemo(() => ({
		roster: (e) => {
			const newPlayers = JSON.parse(e.data ?? "") as ServerPlayer[];
			setPlayers(newPlayers.sort((a, b) => b.fpts - a.fpts));
		},
		start: (e) => {
			navigate(navigation as StackNavigationList, "GAME", route.params);
		}
	}), []);

	let numFinished = 0;
	for (const player of players) {
		if (player.roster) numFinished++;
	}

	const onState = useCallback((state: ServerGame) => {
		setPlayers(state.players);

		if (state.round != route.params.round) {
			navigate(navigation as StackNavigationList, "GAME", {
				...route.params,
				round: state.round
			});
		}
	}, []);

	API.stream(route.params.code, route.params.online, onState);

	async function onAgain() {
		await API.start(route.params.code);
	}

	
	return <View className="flex-1">
		{route.params.hosting && <Button className="m-4" onPress={onAgain}>
			<Text>Again?</Text>
		</Button>}
		<Text className="text-center text-base text-white">{numFinished}/{players.length} Finished</Text>
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				paddingVertical: 24,
				paddingHorizontal: 16
			}}
		>
			{players.map(p => {

				if (!p.roster) return;

				return <Box key={p.name} className="p-5">
					<Text className="text-center text-base text-white">{p.name}</Text>
					{p.roster && <>
						<RosterDisplay roster={p.roster} />
						<Text className="text-center text-base text-white">FPTS: {p.fpts.toFixed(1)}</Text>
					</>}
							
					<Divider />
				</Box>
			})}
		</ScrollView>
	</View>
}