import { NFLPlayer, NFLPosition, NFLRosterPosition, NFLTeam } from "common/types";
import { useState } from "react";
import { ROSTERS } from "common/rosters";
import { Image, Pressable, View, Text, Modal, ScrollView } from "react-native";

export default function PlayerSelector({
    pos, team,
    selectedPlayer,
    setSelectedPlayer
}: {
    pos: NFLRosterPosition, team?: NFLTeam,
    selectedPlayer: NFLPlayer | null,
    setSelectedPlayer?: (player: NFLPlayer) => void
}) {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Pressable onPress={() => setOpen(true)} disabled={selectedPlayer != null}>
                <View className={`h-[60px] border overflow-hidden justify-center rounded ${selectedPlayer ? "cursor-pointer border-white" : "border-dashed border-gray-500"} m-1 w-full md:w-1/4 self-center`}>
                    {selectedPlayer && <Image
                        className="self-center absolute scale-50 opacity-60"
                        source={require("@/assets/J.Gibbs.jpg")}
                    />}
                    <Text className={`text-xl text-center ${selectedPlayer ? "text-white" : "text-gray-400"}`}>{selectedPlayer ? `${selectedPlayer.name}\n${selectedPlayer.fpts} FPTS` : `Select a ${pos.split(" ")[0]}`}</Text>
                </View>
            </Pressable>

            {setSelectedPlayer && team && <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={() => setOpen(false)}
            >
                <View className="bg-black w-full self-center mt-auto rounded-t-3xl h-1/2 p-4">
                    <Pressable
                        className="m-4 bg-purple-700 w-full md:w-1/4 active:bg-purple-950 hover:bg-purple-800 shadow-md self-center px-4 py-2 rounded-2xl"
                        onPress={() => setOpen(false)}
                    >
                        <Text className="text-purple-300 text-center text-2xl font-black m-auto">Close</Text>
                    </Pressable>
                    <ScrollView>
                        {getAllPlayers(team, pos.split(" ")[0] as NFLPosition | "FLEX").map(player => (
                            <Pressable
                                key={player.name}
                                className="m-1 bg-purple-700 w-full md:w-1/4 active:bg-purple-950 hover:bg-purple-800 shadow-md self-center px-4 py-2 rounded-2xl"
                                onPress={() => {
                                    setOpen(false);
                                    setSelectedPlayer(player);
                                }}
                            >
                                <Text className="text-purple-300 text-center text-2xl font-black m-auto">{player.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>}
        </>
    )
}

function getAllPlayers(team: NFLTeam, pos: NFLRosterPosition | NFLPosition | "FLEX"): NFLPlayer[] {

    const nflPos = pos.split(" ")[0] as NFLPosition | "FLEX";
    if (nflPos == "FLEX") {
        return [...getAllPlayers(team, "RB"), ...getAllPlayers(team, "WR"), ...getAllPlayers(team, "TE")];
    }

    const players = [];
    const rosterTeam = ROSTERS[team];

    if (!rosterTeam[nflPos]) return [];
    players.push(...(rosterTeam[nflPos] ?? []));
    return players;
}
