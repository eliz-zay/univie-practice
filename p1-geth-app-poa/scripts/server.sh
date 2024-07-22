#!/bin/bash

geth --datadir data2 --networkid 12345 --nat extip:127.0.0.1 \
    --port 30302 --authrpc.port 8552 \
    --keystore data/keystore --allow-insecure-unlock \
    --http.api eth,net,web3,personal --http --http.port 8000 \
    --ws.api eth,net,web3,personal --ws --ws.port 3002 \
    --bootnodes $1
