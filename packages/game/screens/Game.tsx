import { Text } from 'react-native';
import { getFantasyPoints, rosterIsComplete, shuffle } from 'common';
import { ROSTER_POSITIONS, NFL_TEAMS, NFLPlayer, NFLTeam, NFLRosterPosition, GENERAL_STATE, Roster, API_URL, ScreenProps, SCREEN } from 'common/types';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import '@/global.css';
import { Box } from '../components/ui/box';

import PlayerSelector from '@/components/game/PlayerSelector';
import useEventStream, { ListenerMap } from '@/hooks/stream';
import RosterDisplay from '@/components/game/RosterDisplay';
import Join from './Join';
import { API } from '@/hooks/API';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Game({ route }: ScreenProps) {

    const navigation = useNavigation();
    const screen = useRoute();

    const [roster, setRoster] = useState<Roster>({
        "QB": null,
        "WR 1": null,
        "WR 2": null,
        "WR 3": null,
        "RB 1": null,
        "RB 2": null,
        "TE": null,
        "FLEX 1": null,
        "FLEX 2": null
    });

    const [teams, setTeams] = useState<NFLTeam[]>(shuffle([...NFL_TEAMS]));

    const listeners: Partial<ListenerMap> = useMemo(() => ({
        team: (e) => {
            setTeams(JSON.parse(e.data ?? "[]"));
        }
    }), []);

    API.stream(route.params.code, screen.name as SCREEN, route.params.online, listeners);

    const [teamIdx, setTeamIdx] = useState<number>(0);

    const team = teams[teamIdx];

    const fpts = getFantasyPoints(roster);

    const isFinished = useMemo(() => {
        return rosterIsComplete(roster)
    }, [roster]);
    useEffect(() => {
        if (!isFinished || !route.params.online) return;

        API.done(route.params.code, route.params.name, roster).then(() => {
            navigation.navigate("RESULTS", {
                ...route.params
            })
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

                <Text className="text-center text-white text-base m-2">FPTS: {fpts.toFixed(1)}</Text>

            </Box>
        </>
    );
}