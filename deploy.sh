#!/bin/bash

git pull origin master

npm ci

npm run build

pm2 restart main
