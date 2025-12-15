#!/bin/bash

echo "Subindo Auth..."
cd auth && node index.js &

sleep 2

echo "Subindo Chat..."
node chat/index.js &

sleep 2

echo "Abrindo Frontend no Windows..."
wslview frontend/index.html

