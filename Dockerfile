# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts-alpine AS development

# Set working directory
WORKDIR /app

#
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install
RUN npm ci

COPY . /app

ENV CI=true
ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start", "--", "--port", "3000" ]
