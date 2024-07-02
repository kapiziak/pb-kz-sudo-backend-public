#!/bin/bash

echo Starting SUDO Backend...

npx prisma migrate deploy

npm start