import { NFLPlayer, NFLPosition, NFLRosterPosition, NFLTeam, Roster, ROSTER_POSITIONS } from "common/types";
import { useState } from "react";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText, ActionsheetScrollView } from "../ui/actionsheet";
import { Select, SelectTrigger, SelectInput } from "../ui/select";
import { ROSTERS } from "common/rosters";
import PlayerSelector from "./PlayerSelector";
import { ScrollView } from "react-native";

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

    return <ScrollView
        className="flex-1"
        contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 16
        }}
    >
        {ROSTER_POSITIONS.map(pos => {
            if (!team || !nextTeam || !setRoster) {
                return <PlayerSelector
                    key={pos}
                    pos={pos}
                    selectedPlayer={roster[pos]}
                />
            } else {
                return <PlayerSelector
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
            }
        })}
    </ScrollView>
}