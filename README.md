# Fantasy Roulette

A real-time multiplayer drafting game to summarize the Fantasy Season

Players can join a lobby, configure their roster, and are dealt random NFL teams one by one. An NFL Player must be chosen from each NFL team until the roster is filled. To win, the player needs to obtain the fantasy team with the highest FPTS with their drafted players.

## Tech Stack
* Monorepo: (Bun workspaces)
* Backend: Hono, SSE for real-time updates
* Frontend: React Native / Expo, Gluestack, Nativewind (Tailwind)

## Getting Started
I am hosting a public server at [https://fantasy.godmode.social](https://fantasy.godmode.social)

### Hosting Locally
1. Install [bun](https://bun.sh)
2. Clone the repository:
```sh
git clone https://github.com/Godmoded/fantasy-roulette
cd fantasy-roulette
```
3. Install dependencies
```sh
bun i
```
4. Build the web app
```sh
cd packages/game
bunx expo export --platform web
cd ../../
```
5. Run the server!
```sh
cd packages/server
bun run index.ts
```
Now, the server is running on port 3000.

## Roadmap
* Add alerts
* Add settings page
* Add animations to the different screens to make the game more fluid
* Add draft timers
* Implement partial game synching to decrease bandwidth