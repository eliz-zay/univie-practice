# Geth Management and Monitoring Dashboard

The goal of this project was to implement a tool which facilitates go-ethereum (Geth) network deployment and management.
An interactive dashboard allows to launch and shutdown Geth nodes and to deploy multiple local networks; it also visualises Geth node configuration and network topology graph.

## Project structure

- [Backend](./backend/): provides API for the frontend and operates external DB and Geth.   
- [Frontend](./frontend/): end-user dashboard UI.   

## Setup

### Prerequisites

- [Geth](https://geth.ethereum.org/) is required to bootstrap a private Geth network.
    - `V1.13.5-stable` version is required (due to the PoA `clique` support).
- [Node.js](https://nodejs.org/en) should be installed to run the backend and frontend.

### Dependencies & configuration

#### Backend

1. `cd backend` - move to [backend](./backend/) folder.
2. `npm install` - install delendencies.
3. `touch .env` - create `.env` file for environment variables.
4. Configure `.env` as shown in `.env.example`.

#### Frontend

1. `cd frontend` - move to [frontend](./frontend/) folder.
2. `npm install` - install delendencies.
3. `touch .env` - create `.env` file for environment variables.
4. Configure `.env` as shown in `.env.example`.

## Run

#### Backend

First, run `cd backend` to move to [backend](./backend/) folder.  

**Option 1. Development mode**   
- `npm run dev` - run the app in the development mode.   

**Option 2. Production mode**
1. `npm run build` - build the app for production to the `dist` folder.   
2. `npm run start` - run the app in the production mode.   

API is opened on `http://localhost:PORT` (`PORT` should be configured in `.env` file).   
OpenAPI UI is available on `http://localhost:PORT/api`   

#### Frontend

First, run `cd frontend` to move to [frontend](./frontend/) folder.

- `npm start` - run the app.   
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.   
