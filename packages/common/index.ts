import type { Roster } from "./types";

export function shuffle<T>(arr: T[]): T[] {
    const newArr = [...arr]; 
    let currentIndex = newArr.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArr[randomIndex], newArr[currentIndex]] = [newArr[currentIndex]!, newArr[randomIndex]!];

    }

    return newArr;
};

function objectKeys<TObj extends Record<any, any>>(obj: TObj): Array<keyof TObj> {
    return Object.keys(obj) as Array<keyof TObj>;
}


export function rosterIsComplete(roster: Roster): boolean {
    for (const key of objectKeys(roster)) {
        if (!roster[key]) return false;
    }
    return true;
}