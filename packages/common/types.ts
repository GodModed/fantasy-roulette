import type { StaticScreenProps } from '@react-navigation/native';

export const NFL_TEAMS = [
    "ARI",
    "ATL",
    "BAL",
    "BUF",
    "CAR",
    "CHI",
    "CIN",
    "CLE",
    "DAL",
    "DEN",
    "DET",
    "GB",
    "HOU",
    "IND",
    "JAX",
    "KC",
    "LV",
    "LAC",
    "LA",
    "MIA",
    "MIN",
    "NE",
    "NO",
    "NYG",
    "NYJ",
    "PHI",
    "PIT",
    "SF",
    "SEA",
    "TB",
    "TEN",
    "WAS"
] as const;

export const NFL_POSITIONS = [
    "QB",
    "RB",
    "WR",
    "TE",
    "PK",
    "D/ST"
] as const;

export type NFLTeam = typeof NFL_TEAMS[number];

export type NFLPosition = typeof NFL_POSITIONS[number];

export type NFLRosterPosition = `${NFLPosition | "FLEX"} ${number}`

export type NFLPlayer = {
    id: string;
    displayName: string,
    position: NFLPosition;
    team: NFLTeam;
    fpts: number[];
    totalFpts: number;
};

export type NFLTeamRoster = {
    [position in NFLPosition]?: NFLPlayer[];
};

export type Roster = Record<NFLRosterPosition, NFLPlayer | null>;

export const SCREEN = ["HOME", "JOIN", "HOST", "GAME", "RESULTS"] as const;
export type SCREEN = typeof SCREEN[number];

export type ROSTER_SETTINGS = {
    [P in NFLPosition | "FLEX"]?: number
};

export type GENERAL_STATE = {
    online: boolean,
    hosting: boolean,
    code: string,
    name: string,
    rosterSettings: ROSTER_SETTINGS,
    round: number
};

export type ClientOptions = {
    online: boolean,
    host: boolean,
    code: string,
    name: string
};

export type ServerPlayer = {
    name: string,
    roster?: Roster,
    fpts: number
};

export type ServerGame = {
    date: number,
    players: ServerPlayer[],
    listeners: number,
    started: boolean,
    teamOrder: NFLTeam[],
    round: number,
    settings: ROSTER_SETTINGS
};

export type ServerEvent = "join" | "start" | "team" | "roster";

export const API_URL = "";

export type ScreenProps = StaticScreenProps<GENERAL_STATE>;