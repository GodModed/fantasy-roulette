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
    const { game, client } = useGameState();

    const [roster, setRoster] = useState<Roster>(genRoster(game.settings));
    const [teams, setTeams] = useState<NFLTeam[]>(shuffle([...NFL_TEAMS]));

    useEffect(() => {
        if (!client.online) return;
        if (game.teamOrder.length != 0) {
            console.log("GOT TEAMS", game.teamOrder);
            console.log("GOT ROSTER SETTINGS", game.settings);
            setTeams(game.teamOrder);
            setRoster(genRoster(game.settings));
        }
    }, [game.teamOrder, game.settings]);

    const [teamIdx, setTeamIdx] = useState<number>(0);
    const team = teams[teamIdx];

    const fpts = getFantasyPoints(roster);
    const isFinished = useMemo(() => {
        return rosterIsComplete(roster)
    }, [roster]);

    useEffect(() => {
        if (!isFinished || !client.online) return;

        API.done(client.code, client.name, roster).then(() => {
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