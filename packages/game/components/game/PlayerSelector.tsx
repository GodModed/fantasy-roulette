import { NFLPlayer, NFLPosition, NFLRosterPosition, NFLTeam } from "common/types";
import { useState } from "react";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText, ActionsheetScrollView } from "../ui/actionsheet";
import { Select, SelectTrigger, SelectInput } from "../ui/select";
import { ROSTERS } from "common/rosters";

export default function PlayerSelector({
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
    const rosterTeam = ROSTERS[team];

    if (!rosterTeam[nflPos]) return [];
    players.push(...(rosterTeam[nflPos] ?? []));
    return players;
}
