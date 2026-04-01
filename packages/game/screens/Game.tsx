import { Text } from 'react-native';
import { getFantasyPoints, objectKeys, rosterIsComplete, shuffle } from 'common';
import { NFL_TEAMS, NFLTeam, Roster, ROSTER_SETTINGS } from 'common/types';
import { useEffect, useMemo, useState } from 'react';
import RosterDisplay from '@/components/game/RosterDisplay';
import { API } from '@/hooks/API';
import { useNavigate } from '@/hooks/Navigate';
import useGameState from '@/hooks/GameStore';
import { useShallow } from 'zustand/shallow';
import { View } from 'react-native';

function genRoster(settings: ROSTER_SETTINGS): Roster {
    const roster: Record<string, null | undefined> = {};
    objectKeys(settings).map(pos => {
        for (let i = 0; i < settings?.[pos]!; i++) {
            roster[pos + ` ${i + 1}`] = null;
        }
    });

    return roster as Roster;

}

export default function Game() {

    const navigate = useNavigate();

    const { gameSettings, clientOnline, gameTeamOrder, clientCode, clientName } = useGameState(
        useShallow(state => ({
            gameSettings: state.game.settings,
            clientOnline: state.client.online,
            gameTeamOrder: state.game.teamOrder,
            clientCode: state.client.code,
            clientName: state.client.name
        }))
    );

    const [roster, setRoster] = useState<Roster>(genRoster(gameSettings));
    const [teams, setTeams] = useState<NFLTeam[]>(shuffle([...NFL_TEAMS]));
    const [rosterSet, setRosterSet] = useState<boolean>(false);

    useEffect(() => {
        if (!clientOnline || rosterSet) return;
        if (gameTeamOrder.length != 0) {
            console.log("GOT TEAMS", gameTeamOrder);
            console.log("GOT ROSTER SETTINGS", gameSettings);
            setTeams(gameTeamOrder);
            setRoster(genRoster(gameSettings));
            setRosterSet(true);
        }
    }, [gameTeamOrder, gameSettings, rosterSet]);

    const [teamIdx, setTeamIdx] = useState<number>(0);
    const team = teams[teamIdx];

    const fpts = getFantasyPoints(roster);
    const isFinished = useMemo(() => {
        return rosterIsComplete(roster)
    }, [roster]);

    useEffect(() => {

        if (!clientOnline) return;
        API.done(clientCode, clientName, roster).then(() => {
            if (!isFinished) return;
            navigate("RESULTS");
        });

    }, [roster]);

    return (
        <>
            <View className='w-screen flex-1'>

                <View className="bg-purple-700 w-3/4 md:w-1/4 h-20 rounded-2xl self-center justify-center">
                    <Text className="text-white font-black text-2xl uppercase text-center">
                        {isFinished ? "Done!" : team}
                    </Text>
                </View>

                <RosterDisplay
                    roster={roster}
                    setRoster={setRoster}
                    team={team}
                    nextTeam={() => {
                        setTeamIdx(i => i + 1);
                    }}
                />

                <Text className="text-center text-white text-2xl m-2">Total FPTS: {fpts.toFixed(1)}</Text>

            </View>
        </>
    );
}