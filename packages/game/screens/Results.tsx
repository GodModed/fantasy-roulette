import { ScrollView, Text, View } from "react-native";
import { Button, ButtonGroup } from "../components/ui/button";
import { GENERAL_STATE, ROSTER_POSITIONS, SCREEN, ServerPlayer } from "common/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import useEventStream, { ListenerMap } from "@/hooks/stream";
import { Box } from "@/components/ui/box";
import RosterDisplay from "@/components/game/RosterDisplay";
import { Divider } from "@/components/ui/divider";

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
			setPlayers(newPlayers);
		}
	}), []);


	useEventStream(globalState.code, globalState.online, listeners);

	const playerFPTS = useMemo(() => {
		const map: Record<string, number> = {};
		for (const p of players) {
			let fpts = 0;
			if (p.roster) {
				for (const pos of ROSTER_POSITIONS) {
					fpts += p.roster[pos]?.fpts || 0;
				}
			}
			map[p.name] = fpts;
		}
		return map;
	}, [players]);


	
	return <View className="flex-1"> 
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				paddingVertical: 24,
				paddingHorizontal: 16
			}}
		>
			{players.map(p => (
				<Box key={p.name} className="p-5">
					<Text className="text-center text-base text-white">{p.name}</Text>
					{p.roster && <>
						<RosterDisplay roster={p.roster} />
						<Text className="text-center text-base text-white">FPTS: {playerFPTS[p.name].toFixed(2)}</Text>
					</>}
							
					<Divider />
				</Box>
			))}
		</ScrollView>
	</View>
}