FROM node:20-slim
RUN npm install -g bun

WORKDIR /app

COPY . .
RUN bun install

ENV CI=1
ENV EXPO_NO_TELEMETRY=1

RUN bun run frontend:build

EXPOSE 3000

CMD ["bun", "run", "backend:start"]
