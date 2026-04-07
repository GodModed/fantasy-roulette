import players from "./players.json";
import teams from "./teams.json";
import type { NFLPlayer, NFLPosition } from "./types";

export const PLAYERS = players as Record<string, NFLPlayer>;
export const TEAMS = teams as Record<string, {
    name: string,
    positions: {
        [P in NFLPosition]?: string[]
    }
}>;