import { ScrollView, Text, View } from "react-native";
import { Button } from "../components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@/components/ui/box";
import RosterDisplay from "@/components/game/RosterDisplay";
import { Divider } from "@/components/ui/divider";
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

	
	return <View className="flex-1">
		{clientHost && <Button className="m-4" onPress={onAgain}>
			<Text>Again?</Text>
		</Button>}
		<Text className="text-center text-base text-white">{numFinished}/{gamePlayers.length} Finished</Text>
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				paddingVertical: 24,
				paddingHorizontal: 16
			}}
		>
			{sortedPlayers.map(p => {

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