import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AllNFLRosters, NFL_POSITIONS, ROSTER_POSITIONS, NFL_TEAMS, NFLPlayer, NFLPosition, NFLTeam, NFLTeamRoster, NFLRosterPosition, GENERAL_STATE } from 'common/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import '@/global.css';
import { Box } from '../components/ui/box';
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetScrollView
} from '../components/ui/actionsheet';
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from '@/components/ui/select';
import { Button, ButtonText } from '../components/ui/button';

import { PLAYERS } from "../players";

const rosters: Record<string, Partial<NFLTeamRoster>> = PLAYERS as unknown as Record<string, Partial<NFLTeamRoster>>;

// for (const team of NFL_TEAMS) {
//     rosters[team] = {};
//     for (const pos of NFL_POSITIONS) {
//         rosters[team][pos] = [];

//         for (let i = 0; i < 4; i++) {
//             const name = pos + " " + (i + 1);
//             const playerArr = rosters[team][pos];
//             playerArr.push({
//                 name,
//                 position: pos,
//                 team,
//                 fpts: 0
//             });
//         }

//     }
// }

function fillBlankRoster() {
    const roster = {} as Record<NFLRosterPosition, NFLPlayer | null>;
    for (const pos of ROSTER_POSITIONS) {
        roster[pos] = null;
    }
    return roster;
}

function shuffle<T>(arr: T[]): T[] {
    const newArr = [...arr]; 
    let currentIndex = newArr.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArr[currentIndex], newArr[randomIndex]] = [
            newArr[randomIndex], newArr[currentIndex]
        ];
    }

    return newArr;
};

export default function Game({
    globalState,
    setGlobalState
}: {
    globalState: GENERAL_STATE,
    setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

    const [roster, setRoster] = useState<ReturnType<typeof fillBlankRoster>>(fillBlankRoster());
    const [teams, _] = useState<NFLTeam[]>(shuffle([...NFL_TEAMS]));

    useEffect(() => {
        console.log(teams);
    }, []);

    const [teamIdx, setTeamIdx] = useState<number>(0);

    const team = teams[teamIdx];

    let fpts = 0;
    for (const pos of ROSTER_POSITIONS) {
        fpts += roster[pos]?.fpts || 0;
    }


    return (
        <>
            <Box className='p-5'>

                <Text className="text-center text-white text-base m-2">{team}</Text>

                {/*<PlayerSelector pos={NFL_POSITIONS[0]} team={NFL_TEAMS[0]} />*/}
                {ROSTER_POSITIONS.map(pos => (
                    <PlayerSelector
                        key={pos}
                        pos={pos}
                        team={team}
                        selectedPlayer={roster[pos]}
                        setSelectedPlayer={(p) => {
                            setRoster(prev => ({
                                ...prev,
                                [pos]: p
                            }));

                            setTeamIdx(prev => prev + 1);

                        }} />
                ))}

                <Text className="text-center text-white text-base m-2">FPTS: {fpts}</Text>

            </Box>
        </>
    );
}

function PlayerSelector({
    pos, team,
    selectedPlayer,
    setSelectedPlayer
}: {
    pos: NFLRosterPosition, team: NFLTeam,
    selectedPlayer: NFLPlayer | null,
    setSelectedPlayer: (player: NFLPlayer) => void
}) {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Select onOpen={() => setOpen(true)} className="m-1" >
                <SelectTrigger className={selectedPlayer != null ? "cursor-pointer" : ""} variant="outline">
                    <SelectInput className={selectedPlayer != null ? "placeholder:text-white" : ""} placeholder={selectedPlayer == null ? `Select a ${pos.split(" ")[0]}` : selectedPlayer?.name} />
                    {/*<SelectInput />*/}
                </SelectTrigger>
            </Select>


            <Actionsheet
                className='border border-solid border-zinc-900'
                isOpen={open && selectedPlayer == null}
                onClose={() => setOpen(false)}
            // snapPoints={[300, 500]}
            >
                <ActionsheetBackdrop />
                <ActionsheetContent style={{ maxHeight: 300 }}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetItem onPress={() => setOpen(false)}>
                        <ActionsheetItemText>Close</ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetScrollView>
                        {getAllPlayers(team, pos.split(" ")[0] as NFLPosition | "FLEX").map(player => (
                            <ActionsheetItem key={player.name} onPress={() => {
                                setOpen(false);
                                setSelectedPlayer(player)
                            }}>
                                <ActionsheetItemText>{player.name}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </ActionsheetScrollView>
                </ActionsheetContent>
            </Actionsheet>
        </>
    )
}

function getAllPlayers(team: NFLTeam, pos: NFLRosterPosition | NFLPosition | "FLEX"): NFLPlayer[] {

    const nflPos = pos.split(" ")[0] as NFLPosition | "FLEX";
    if (nflPos == "FLEX") {
        return [...getAllPlayers(team, "RB"), ...getAllPlayers(team, "WR"), ...getAllPlayers(team, "TE")];
    }

    const players = [];
    const rosterTeam = rosters[team];

    if (!rosterTeam[nflPos]) return [];
    players.push(...(rosterTeam[nflPos] ?? []));
    return players;
}
