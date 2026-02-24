import { Text } from 'react-native';
import { rosterIsComplete, shuffle } from 'common';
import { ROSTER_POSITIONS, NFL_TEAMS, NFLPlayer, NFLTeam, NFLRosterPosition, GENERAL_STATE, Roster, API_URL } from 'common/types';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import '@/global.css';
import { Box } from '../components/ui/box';

import PlayerSelector from '@/components/game/PlayerSelector';
import useEventStream, { ListenerMap } from '@/hooks/stream';
import RosterDisplay from '@/components/game/RosterDisplay';
import Join from './Join';

export default function Game({
    globalState,
    setGlobalState
}: {
    globalState: GENERAL_STATE,
    setGlobalState: Dispatch<SetStateAction<GENERAL_STATE>>
}) {

    const [roster, setRoster] = useState<Roster>({
        "QB": null,
        "WR 1": null,
        "WR 2": null,
        "RB 1": null,
        "RB 2": null,
        "TE": null,
        "FLEX": null
    });

    const [teams, setTeams] = useState<NFLTeam[]>(shuffle([...NFL_TEAMS]));

    const listeners: Partial<ListenerMap> = useMemo(() => ({
        team: (e) => {
            setTeams(JSON.parse(e.data ?? "[]"));
        }
    }), []);

    useEventStream(globalState.code, globalState.online, listeners);

    const [teamIdx, setTeamIdx] = useState<number>(0);

    const team = teams[teamIdx];

    let fpts = 0;
    for (const pos of ROSTER_POSITIONS) {
        fpts += roster[pos]?.fpts || 0;
    }

    const isFinished = useMemo(() => {
        return rosterIsComplete(roster)
    }, [roster]);
    useEffect(() => {
        if (!isFinished || !globalState.online) return;

        fetch(API_URL + "/done/" + globalState.code + "/" + globalState.name + "?roster=" + JSON.stringify(roster))
            .then(() => {
                setGlobalState(s => ({
                    ...s,
                    screen: "RESULTS"
                }))
            });

    }, [isFinished]);


    return (
        <>
            <Box className='p-5'>

                <Text className="text-center text-white text-base m-2">{isFinished ? "Done!" : team}</Text>

                {/*<PlayerSelector pos={NFL_POSITIONS[0]} team={NFL_TEAMS[0]} />*/}
                <RosterDisplay
                    roster={roster}
                    setRoster={setRoster}
                    team={team}
                    nextTeam={() => {
                        setTeamIdx(i => i + 1);
                    }}
                />

                <Text className="text-center text-white text-base m-2">FPTS: {fpts.toFixed(2)}</Text>

            </Box>
        </>
    );
}