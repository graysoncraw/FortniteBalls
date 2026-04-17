# FortniteBalls

FortniteBalls is a fun little discord bot project that I started working on to improve my JS skills and learn how to make bots.

## API Suite

- Giphy
- FNBR.co
- fortnite-api.com

## Tech Stack

- Node.js
- discord.js + djs-commander
- PostgreSQL
- Axios
- Docker + Docker Compose

## Features

- `/fb stats`  
  Fortnite player stats with interactive mode switching (Overall, Solo, Duo, Squad).
- `/fb gif`  
  Sends a random Fortnite-related GIF.
- `/fb dailyshop`  
  Interactive daily shop browser with item image + quick item jump controls.
- `/fb notify item:<name>`  
  Saves item notifications to the database for a Discord user.
- `/fb managenotifs stored`  
  Lists all stored notifications.
- `/fb managenotifs shoplist`  
  Checks today’s shop against saved notifications and pings matched users.
- `/fb managenotifs delete item:<name>`  
  Deletes a saved notification.

## Environment Variables

Create a `.env` file in the project root:

```env
TOKEN=your_discord_bot_token
CHANNEL_ID=discord_channel_id_for_scheduled_notifications
FNBR_API=your_fnbr_api_key
STAT_API=your_fortnite_api_key
FORT_GIF_API=your_giphy_api_key
DATABASE_URL=postgresql://user:password@host:5432/fortniteballs
```

Notes:

- `DATABASE_URL` should point to your Postgres container/service.
- For Docker on the same network, `host` should be the Postgres container name.

## Local Development

Install dependencies:

```bash
npm install
```

Run the bot:

```bash
node index.js
```

## Database

The bot auto-creates the `notifications` table on startup if it doesn’t exist.

Current notification records store:

- `item`
- `username`
- `user_id`
- `created_at`

## Docker Deployment (App Only, Existing Postgres)

This project includes:

- `Dockerfile`
- `docker-compose.yml`

If Postgres is already running in another container:

1. Create a shared Docker network (one-time):

```bash
docker network create fortniteballs-net
```

2. Connect your Postgres container to that network:

```bash
docker network connect fortniteballs-net <postgres-container-name>
```

3. Set `DATABASE_URL` in `.env` to use that Postgres container name as host:

```env
DATABASE_URL=postgresql://user:password@<postgres-container-name>:5432/fortniteballs
```

4. Build and run the bot:

```bash
docker compose up -d --build
```

5. Check logs:

```bash
docker logs -f fortniteballs-bot
```

## Useful Commands

- Start bot with Docker:
  ```bash
  docker compose up -d --build
  ```
- Restart bot:
  ```bash
  docker compose restart bot
  ```
- Stop bot:
  ```bash
  docker compose down
  ```
- Follow logs:
  ```bash
  docker logs -f fortniteballs-bot
  ```

## Troubleshooting

- Bot starts but DB fails:
  - Confirm bot container and Postgres container are on the same Docker network.
  - Confirm `DATABASE_URL` host is the Postgres container name (not `localhost`).
- Slash commands not updating:
  - Re-deploy/restart bot and re-register commands if needed.
- API failures:
  - Verify API keys in `.env`.
