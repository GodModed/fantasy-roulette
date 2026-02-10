const text = await (Bun.file("OffensivePlayers.csv")).text();

function shuffle<T>(arr: T[]): T[] {
    // Create a copy of the array
    const newArr = [...arr]; 
    let currentIndex = newArr.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArr[currentIndex], newArr[randomIndex]] = [
            newArr[randomIndex], newArr[currentIndex]
        ];
    }

    return newArr;
};

export const PFRTEAM_TO_NFLTEAM = {
    "IND": "Indianapolis Colts",
    "SFO": "San Francisco 49ers",
    "ATL": "Atlanta Falcons",
    "DET": "Detroit Lions",
    "LAR": "Los Angeles Rams",
    "SEA": "Seattle Seahawks",
    "BUF": "Buffalo Bills",
    "BAL": "Baltimore Ravens",
    "MIA": "Miami Dolphins",
    "ARI": "Arizona Cardinals",
    "DAL": "Dallas Cowboys",
    "NWE": "New England Patriots",
    "CIN": "Cincinnati Bengals",
    "JAX": "Jacksonville Jaguars",
    "GNB": "Green Bay Packers",
    "NOR": "New Orleans Saints",
    "CHI": "Chicago Bears",
    "PHI": "Philadelphia Eagles",
    "LVR": "Las Vegas Raiders",
    "HOU": "Houston Texans",
    "DEN": "Denver Broncos",
    "CAR": "Carolina Panthers",
    "PIT": "Pittsburgh Steelers",
    "NYJ": "New York Jets",
    "LAC": "Los Angeles Chargers",
    "TAM": "Tampa Bay Buccaneers",
    "KAN": "Kansas City Chiefs",
    "CLE": "Cleveland Browns",
    "NYG": "New York Giants",
    "TEN": "Tennessee Titans",
    "WAS": "Washington Commanders",
    "MIN": "Minnesota Vikings"
} as const;

const playerTeam = {};
const players = [];
for (const line of text.split("\n")) {
    const splitLine = line.split(",");
    const playerName = splitLine[1];
    if (playerName == "Player") continue;
    const team = PFRTEAM_TO_NFLTEAM[splitLine[2]];
    const pos = splitLine[3];
    const FPTS = parseFloat(splitLine[4]);
    if (!playerTeam[team]) playerTeam[team] = {};
    if (!playerTeam[team][pos]) playerTeam[team][pos] = [];
    playerTeam[team][pos].push({
        name: playerName.replace("+", "").replace("*", ""),
        position: pos,
        team,
        fpts: FPTS || 0
    });

    playerTeam[team][pos] = shuffle(playerTeam[team][pos]);
}

await Bun.write("players.ts", "export const PLAYERS = " + JSON.stringify(playerTeam));