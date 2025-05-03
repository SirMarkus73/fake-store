# Fake Store API

## Run the project with development mode

1. Copy the `.env.example` in `/packages/server` and rename it to `.env` 

2. Install the dependencies
```bash
bun run install
```

3. Run the following commands to start the project 

- On Linux

```bash
bun run dev-linux
```
   
- On windows
  
```bash
bun run dev-windows
```

4. If is the first time running the project

```bash
bun run db:generate
bun run db:migrate
```

5. Run drizzle studio to view the data on the db

```bash
bun run db:studio
```