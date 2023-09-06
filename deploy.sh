#!/bin/bash

cd /home/ubuntu/repositories/back-nestjs

git pull origin main

export NODE_OPTIONS=--max-old-space-size=2046

npm install

npm run build

pm2 delete back-nestjs

pm2 start dist/main.js --name "claudiomelopsicologo-nestjs"
