import { ScrollView, Text, View } from "react-native";
import { Button } from "../components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@/components/ui/box";
import RosterDisplay from "@/components/game/RosterDisplay";
import { API } from "@/hooks/API";
import useGameState from "@/hooks/GameStore";
import { useNavigate } from "@/hooks/Navigate";
import { rosterIsComplete } from "common";
import { useShallow } from "zustand/shallow";

export default function Results() {

	const navigate = useNavigate();


	const { gamePlayers, gameRound, clientHost, clientCode } = useGameState(
		useShallow((state) => ({
			gamePlayers: state.game.players,
			gameRound: state.game.round,
			clientHost: state.client.host,
			clientCode: state.client.code
		}))
	);

	const numFinished = useMemo(() => {
		return gamePlayers.reduce((acc, player) => {
			if (player.roster && rosterIsComplete(player.roster)) return acc + 1;
			return acc;
		}, 0);
	}, [gamePlayers]);

	const sortedPlayers = useMemo(() => {
		return gamePlayers.sort((a, b) => b.fpts - a.fpts);
	}, [gamePlayers]);

	const [round, _] = useState<number>(gameRound);
	useEffect(() => {
		if (gameRound == round) return;
		navigate("GAME");
	}, [gameRound]);

	async function onAgain() {
		await API.start(clientCode);
	}

	
	return <View className="flex-1 w-screen">
		{clientHost && <Button className="m-2 bg-purple-700 w-1/2 md:w-1/4 active:bg-purple-950 hover:bg-purple-800 self-center justify-center rounded-2xl disabled:bg-black px-4 py-2" onPress={onAgain}>
			<Text className="text-white text-center text-2xl font-black m-auto">Again?</Text>
		</Button>}
		<Text className="text-center text-white font-black text-xl rounded">{numFinished}/{gamePlayers.length} Finished</Text>
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				paddingVertical: 24,
				paddingHorizontal: 16
			}}
		>
			{sortedPlayers.map((p, i) => {
				return <Box key={i} className="p-5 border m-2">
					<Text className="text-center text-2xl text-white">#{i + 1} {p.name}</Text>
					{p.roster && <>
						<RosterDisplay roster={p.roster} />
						<Text className="text-center text-white text-2xl m-2">FPTS: {p.fpts.toFixed(1)}</Text>
					</>}							
				</Box>
			})}
		</ScrollView>
	</View>
}