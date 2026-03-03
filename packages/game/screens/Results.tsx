import { ScrollView, Text, View } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { API_URL, GENERAL_STATE, ROSTER_POSITIONS, SCREEN, ServerPlayer } from "common/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { Box } from "@/components/ui/box";
import RosterDisplay from "@/components/game/RosterDisplay";
import { Divider } from "@/components/ui/divider";
import { API } from "@/hooks/API";

export default function Results({
	globalState,
	setGlobalState
}: {
	globalState: GENERAL_STATE,
	setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

	const [players, setPlayers] = useState<ServerPlayer[]>([]);
	const listeners: Partial<ListenerMap> = useMemo(() => ({
		roster: (e) => {
			const newPlayers = JSON.parse(e.data ?? "") as ServerPlayer[];
			setPlayers(newPlayers.sort((a, b) => b.fpts - a.fpts));
		},
		start: (e) => {
			setGlobalState(s => ({
				...s,
				screen: "GAME",
			}))
		}
	}), []);


	API.stream(globalState.code, globalState.screen, globalState.online, listeners);

	async function onAgain() {
		await API.start(globalState.code);
	}

	
	return <View className="flex-1">
		{globalState.hosting && <Button className="m-4" onPress={onAgain}>
			<Text>Again?</Text>
		</Button>} 
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