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

export const TEAM_NAME: Record<string, string> = {
    "WAS": "Washington Commanders",
    "TEN": "Tennessee Titans",
    "TB": "Tampa Bay Buccaneers",
    "SEA": "Seattle Seahawks",
    "SF": "San Francisco 49ers",
    "PIT": "Pittsburgh Steelers",
    "PHI": "Philadelphia Eagles",
    "NYJ": "New York Jets",
    "NYG": "New York Giants",
    "NO": "New Orleans Saints",
    "NE": "New England Patriots",
    "MIN": "Minnesota Vikings",
    "MIA": "Miami Dolphins",
    "LA": "Los Angeles Rams",
    "LAC": "Los Angeles Chargers",
    "LV": "Las Vegas Raiders",
    "KC": "Kansas City Chiefs",
    "JAX": "Jacksonville Jaguars",
    "IND": "Indianapolis Colts",
    "HOU": "Houston Texans",
    "GB": "Green Bay Packers",
    "DET": "Detroit Lions",
    "DEN": "Denver Broncos",
    "DAL": "Dallas Cowboys",
    "CLE": "Cleveland Browns",
    "CIN": "Cincinnati Bengals",
    "CHI": "Chicago Bears",
    "CAR": "Carolina Panthers",
    "BUF": "Buffalo Bills",
    "BAL": "Baltimore Ravens",
    "ATL": "Atlanta Falcons",
    "ARI": "Arizona Cardinals"
};