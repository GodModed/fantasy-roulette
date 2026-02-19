export const NFL_TEAMS =
        ["Arizona Cardinals",
        "Atlanta Falcons",
        "Baltimore Ravens",
        "Buffalo Bills",
        "Carolina Panthers",
        "Chicago Bears",
        "Cincinnati Bengals",
        "Cleveland Browns",
        "Dallas Cowboys",
        "Denver Broncos",
        "Detroit Lions",
        "Green Bay Packers",
        "Houston Texans",
        "Indianapolis Colts",
        "Jacksonville Jaguars",
        "Kansas City Chiefs",
        "Las Vegas Raiders",
        "Los Angeles Chargers",
        "Los Angeles Rams",
        "Miami Dolphins",
        "Minnesota Vikings",
        "New England Patriots",
        "New Orleans Saints",
        "New York Giants",
        "New York Jets",
        "Philadelphia Eagles",
        "Pittsburgh Steelers",
        "San Francisco 49ers",
        "Seattle Seahawks",
        "Tampa Bay Buccaneers",
        "Tennessee Titans",
        "Washington Commanders"] as const;

export const NFL_POSITIONS = [
    "QB",
    "RB",
    "WR",
    "TE",
    "PK",
    "D/ST"
] as const;

export const ROSTER_POSITIONS = [
    "QB",
    "RB 1",
    "RB 2",
    "WR 1",
    "WR 2",
    "TE",
    "FLEX",
    // "PK",
    // "D/ST"
] as const;

export type NFLTeam = typeof NFL_TEAMS[number];
export type NFLPosition = typeof NFL_POSITIONS[number];
export type NFLRosterPosition = typeof ROSTER_POSITIONS[number];

export type NFLPlayer = {
    name: string;
    position: NFLPosition;
    team: NFLTeam;
    fpts: number;
};

export type NFLTeamRoster = {
    [position in NFLPosition]?: NFLPlayer[];
};

export type AllNFLRosters = {
    [T in NFLTeam]?: NFLTeamRoster;
};

export const SCREEN = [ "HOME", "JOIN", "HOST", "GAME" ] as const;
export type SCREEN = typeof SCREEN[number];
export type GENERAL_STATE = {
    screen: SCREEN,
    online: boolean,
    hosting: boolean,
    code: string,
    name: string
};

export type ServerPlayer = {
    name: string
};

export type ServerGame = {
    date: number,
    players: ServerPlayer[],
    listeners: number,
    started: boolean,
    teamOrder: NFLTeam[],
};

export type ServerEvent = "join" | "start" | "team";