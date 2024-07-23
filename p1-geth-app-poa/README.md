# Geth app based on Smart Contracts and Proof-of-Authority

The aim of this project was to create a secure platform which facilitates decision making and provides persistent storage for a management board of a company within the Go-ethereum framework based on a Proof-of-Authority concept and Solidity Smart Contracts.

## Project structure

The project has 4 main modules:
- [Web frontend](./frontend/): end-user UI for creating, reading and signing contracts   
- [Web backend](./backend/src/index.ts): provides API for the frontend and operates MongoDB and Geth    
- [Contract deployer](./backend/src/deploy.ts): creates a Monitoring Smart Contract instance   
- [Contract subscriber](./backend/src/subscribe.ts): listens to the Monitoring Contract events which are emitted when a new Decision Smart Contract is generated, and saves the Decision Contract address to MongoDB    

## Setup

### Prerequisites

- [Geth](https://geth.ethereum.org/) is required to bootstrap a private network   
- [Node.js](https://nodejs.org/en) should be installed to run the application   

### Dependencies & configuration
- `cd backend && npm i && cd ../frontend && npm i && cd ..` - download project dependencies   
- `cd backend && touch .env .env.deploy .env.sub` - create environment files for backend, deployer and subscriber
- Configure `.env`, `.env.deploy` and `.env.sub` as shown in `*.example` files   

## Run

### Local Ethereum network

1. Generate 5 accounts: `geth account new --datadir data` x 5 times   
2. Edit `genesis.json`:
    - `alloc` should reference all 5 accounts, each with initial balance around `30000000000000000000000`   
    - `extradata` should contain concatenated accounts #3,4,5 (as miners)   
2. Initialize 5 nodes: `geth init --datadir data genesis.json` - for `data` directory being data,data2,data3,data4,data5
    - bootnode: /data   
    - member: /data2   
    - miners: /data3, /data4, /data5   
3. Run nodes:
    - `sh scripts/bootnode.sh` - start bootstrap node   
    - `sh scripts/enr.sh | xargs -I{} sh scripts/server.sh {}` - start server node   
    - set environment variable `enr="enr:-..."` as output from `sh scripts/enr.sh` to link other nodes to bootnode   
    - set `acc=0x...` as account #3, run `sh scripts/miner.sh data3 3003 8223 $acc $enr`   
    - set `acc=0x...` as account #4, run `sh scripts/miner.sh data4 3004 8224 $acc $enr`   
    - set `acc=0x...` as account #5, run `sh scripts/miner.sh data5 3005 8225 $acc $enr`   
    - All 3 miners must be running in order to produce blocks   

### Project modules

1. `cd backend`   
1. `npm run contract:deploy` - deploy a Monitoring Contract and use the output address to configure `.env` and `.env.sub`    
2. `npm run contract:subscribe` - subscribe to Monitoring Contract events; this process should run concurrently with the backend   
3. `npm run build && npm run start` - bootstrap backend   
4. `cd ../frontend`   
5. `npm run start` - bootstrap frontend and visit `http://localhost:3000/` in the browser   
