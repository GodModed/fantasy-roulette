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

export default function Results() {

	const navigate = useNavigate();
	const { game, client } = useGameState();

	let numFinished = useMemo(() => {
		return game.players.reduce((acc, player) => {
			if (player.roster && rosterIsComplete(player.roster)) return acc + 1;
			return acc;
		}, 0);
	}, game.players);

	const [round, _] = useState<number>(game.round);
	useEffect(() => {
		if (game.round == round) return;
		navigate("GAME");
	}, [game.round]);

	async function onAgain() {
		await API.start(client.code);
	}

	
	return <View className="flex-1">
		{client.host && <Button className="m-4" onPress={onAgain}>
			<Text>Again?</Text>
		</Button>}
		<Text className="text-center text-base text-white">{numFinished}/{game.players.length} Finished</Text>
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				paddingVertical: 24,
				paddingHorizontal: 16
			}}
		>
			{game.players.map(p => {

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