import { Text } from 'react-native';
import { getFantasyPoints, objectKeys, rosterIsComplete, shuffle } from 'common';
import { NFL_TEAMS, NFLTeam, Roster, ROSTER_SETTINGS } from 'common/types';
import { useEffect, useMemo, useState } from 'react';

import '@/global.css';
import { Box } from '../components/ui/box';

import RosterDisplay from '@/components/game/RosterDisplay';
import { API } from '@/hooks/API';
import { useNavigate } from '@/hooks/Navigate';
import useGameState from '@/hooks/GameStore';
import { useShallow } from 'zustand/shallow';

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
        if (!isFinished || !clientOnline) return;

        API.done(clientCode, clientName, roster).then(() => {
            navigate("RESULTS");
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