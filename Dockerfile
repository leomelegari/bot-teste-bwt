# Etapa de build
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

# Etapa final
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install -g ts-node typescript

CMD ["npm", "run", "start"]
