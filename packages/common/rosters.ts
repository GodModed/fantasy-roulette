import { PLAYERS } from "./players";
import type { NFLTeamRoster } from "./types";

export const ROSTERS: Record<string, Partial<NFLTeamRoster>> = PLAYERS as unknown as Record<string, Partial<NFLTeamRoster>>;