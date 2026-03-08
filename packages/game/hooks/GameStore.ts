import { ClientOptions, ServerGame } from "common/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GameState {
	game: ServerGame,
	client: ClientOptions,
	setGame: (game: Partial<ServerGame>) => void;
	setClientOptions: (client: Partial<ClientOptions>) => void
}

const useGameState = create<GameState>()(set => ({
	game: {
		date: Date.now(),
		players: [],
		listeners: 0,
		started: false,
		teamOrder: [],
		round: 0,
		settings: {
			QB: 1,
			RB: 2,
			WR: 2,
			TE: 1,
			FLEX: 1
		}
	},
	client: {
		online: false,
		host: false,
		code: "XXXXXX",
		name: ""
	},
	setGame: game => set((state) => ({game: { ...state.game, ...game }})),
	setClientOptions: client => set((state) => ({ client: { ...state.client, ...client } }))
}));

export default useGameState;