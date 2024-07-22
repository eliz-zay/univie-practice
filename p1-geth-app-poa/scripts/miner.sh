#!/bin/bash

geth --datadir $1 --networkid 12345 --nat extip:127.0.0.1 \
    --port $2 --authrpc.port $3 \
    --unlock $4 \
    --mine --keystore data/keystore --miner.etherbase $4 \
    --bootnodes $5