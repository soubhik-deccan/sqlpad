# SQLPad dev setup: seed data, auth bypass, server restart

This folder holds implementation notes for local development. All paths are relative to the **project root** unless stated otherwise.

---

## 1. Bypass auth (local testing only)

To skip sign-in and get an auto “noauth” user for testing:

1. Edit **`server/config.dev.env`**.
2. Add or ensure these lines (remove or comment them for production):

```env
SQLPAD_AUTH_DISABLED = true
SQLPAD_AUTH_DISABLED_DEFAULT_ROLE = admin
```

- **`SQLPAD_AUTH_DISABLED = true`** — Every request is treated as authenticated (no login).
- **`SQLPAD_AUTH_DISABLED_DEFAULT_ROLE = admin`** — The noauth user has admin role.

3. Restart the server (see [Server restart](#3-server-restart) below) so the config is picked up.

---

## 2. Seed data (local SQLite)

The dev connection uses **`server/data/local.sqlite`**. Seed script: **`server/data/seed-local.sql`**.

### Apply or refresh seed data

From project root:

```bash
cd server/data && sqlite3 local.sqlite < seed-local.sql
```

Or from **`server/data`**:

```bash
sqlite3 local.sqlite < seed-local.sql
```

### What the seed creates

- **Tables:** `users`, `products`, `orders`
- **Sample rows:** 3 users, 4 products, 4 orders

The script is idempotent: it deletes existing rows and re-inserts, so you can re-run it anytime.

### Point dev connection to this DB

In **`server/config.dev.env`** the dev connection should use the local DB:

```env
SQLPAD_CONNECTIONS__devdbdriverid123__filename = "./data/local.sqlite"
```

Paths are relative to the server process (run from **`server/`**), so `./data/local.sqlite` is **`server/data/local.sqlite`**.

---

## 3. Server restart

After changing **`server/config.dev.env`** (e.g. auth bypass or connection filename), restart the SQLPad server.

1. Stop the current server (Ctrl+C in the terminal where it’s running, or kill the process).
2. From project root, start again:

```bash
cd server && yarn start
```

Or from **`server`**:

```bash
yarn start
```

The app will be at **http://localhost:3010/sqlpad** (or the port set by `SQLPAD_PORT` in `config.dev.env`).

---

## 4. Run both (server + client)

**Option A — one command (from project root)**

```bash
yarn dev
```

Runs server and client together in one terminal via `concurrently`. Stop with Ctrl+C.

**Option B — two terminals**

**Terminal 1 — server**

From project root:

```bash
cd server && yarn start
```

Or from **`server`**:

```bash
yarn start
```

**Terminal 2 — client**

From project root:

```bash
cd client && yarn start
```

Or from **`client`**:

```bash
yarn start
```

- **Server:** http://localhost:3010 (API + base URL `/sqlpad`).
- **Client:** Vite dev server (e.g. http://localhost:5173); set the app to use the server base URL if needed (e.g. proxy or `VITE_*` env).

---

## Quick reference

| Task           | Where                   | Action                                                                            |
| -------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Run both       | project root            | `yarn dev` (or **T1:** `cd server && yarn start` · **T2:** `cd client && yarn start`) |
| Bypass auth    | `server/config.dev.env` | Set `SQLPAD_AUTH_DISABLED = true` and `SQLPAD_AUTH_DISABLED_DEFAULT_ROLE = admin` |
| Seed local DB  | `server/data/`          | `sqlite3 local.sqlite < seed-local.sql`                                           |
| Dev DB path    | `server/config.dev.env` | `SQLPAD_CONNECTIONS__devdbdriverid123__filename = "./data/local.sqlite"`          |
| Restart server | terminal                | Stop process, then `cd server && yarn start`                                      |
