import { NFLPlayer, NFLPosition, NFLRosterPosition, NFLTeam, Roster, ROSTER_POSITIONS } from "common/types";
import { useState } from "react";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText, ActionsheetScrollView } from "../ui/actionsheet";
import { Select, SelectTrigger, SelectInput } from "../ui/select";
import { ROSTERS } from "common/rosters";
import PlayerSelector from "./PlayerSelector";

export default function RosterDisplay({
    roster,
    team,
    nextTeam,
    setRoster
}: {
    roster: Roster,
    setRoster?: (roster: Roster) => void
    team?: NFLTeam,
    nextTeam?: () => void
}) {
    if (!team || !nextTeam || !setRoster) {
        return ROSTER_POSITIONS.map(pos => (
            <PlayerSelector
                key={pos}
                pos={pos}
                selectedPlayer={roster[pos]}
            />
        ))        
    } else {
        return ROSTER_POSITIONS.map(pos => (
            <PlayerSelector
                key={pos}
                pos={pos}
                team={team}
                selectedPlayer={roster[pos]}
                setSelectedPlayer={(p) => {
                    setRoster({
                        ...roster,
                        [pos]: p
                    });

                    nextTeam();
                }}
            />
        ))
    }
}