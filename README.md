# Fake Store API

## Run the project with development mode

1. Copy the `.env.example` in `/packages/server` and rename it to `.env` 

2. Run the following commands to start the project 

   - On Linux

    ```bash
    bun install
    bun run dev
    ```
   
   - On windows
  
    ```bash
    wsl
    bun install
    bun run dev
    ```
3. If is the first time running the project

```bash
bun run db:generate
bun run db:migrate
```

4. Run drizzle studio to view the data on the db

> [!warning]
> If you are using windows make sure to run the command outside wsl

```bash
bun run db:studio
```