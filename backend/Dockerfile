FROM node:23

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY backend ./backend

EXPOSE 8080

CMD ["node", "backend/server.js"]
