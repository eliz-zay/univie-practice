# Backend

## Setup

1. `npm install` - install delendencies.
2. `touch .env` - create `.env` file for environment variables.
3. Configure `.env` as shown in `.env.example`.

## Run

First, run `cd backend` to move to [backend](./backend/) folder.  

**Option 1. Development mode**   
- `npm run dev` - run the app in the development mode.   

**Option 2. Production mode**
1. `npm run build` - build the app for production to the `dist` folder.   
2. `npm run start` - run the app in the production mode.   

API is opened on `http://localhost:PORT` (`PORT` should be configured in `.env` file).   
OpenAPI UI is available on `http://localhost:PORT/api`   
