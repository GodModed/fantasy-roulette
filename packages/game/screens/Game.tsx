import { Text } from 'react-native';
import { shuffle } from 'common';
import { ROSTER_POSITIONS, NFL_TEAMS, NFLPlayer, NFLTeam, NFLRosterPosition, GENERAL_STATE } from 'common/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import '@/global.css';
import { Box } from '../components/ui/box';

import PlayerSelector from '@/components/game/PlayerSelector';

function fillBlankRoster() {
    const roster = {} as Record<NFLRosterPosition, NFLPlayer | null>;
    for (const pos of ROSTER_POSITIONS) {
        roster[pos] = null;
    }
    return roster;
}

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

                <Text className="text-center text-white text-base m-2">FPTS: {fpts.toFixed(2)}</Text>

            </Box>
        </>
    );
}