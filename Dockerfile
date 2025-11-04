# Étape 1 — Build du projet React/Vite
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

