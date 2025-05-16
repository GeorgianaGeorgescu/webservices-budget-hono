# Budget Backend with Hono

## Before starting the project
- Create a .env
``` 
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>

ARGON_HASH_LENGTH=32
ARGON_TIME_COST=6
ARGON_MEMORY_COST=131072

AUTH_JWT_AUDIENCE=budget.hogent.be
AUTH_JWT_ISSUER=budget.hogent.be

NODE_ENV=development
PORT=3000

AUTH_JWT_SECRET=<YOUR-JWT-SECRET>
AUTH_JWT_EXPIRATION_INTERVAL=3600

LOG_LEVEL=silly
LOG_DISABLED=false

```

## Project setup

```bash
#install dependencies:
$ yarn install

#run prisma migrations
$ yarn prisma migrate dev --name init

#seed the database
$ yarn prisma db seed
```

## Compile and run the project

```bash
# production
$ yarn start

# development
$ yarn dev

```