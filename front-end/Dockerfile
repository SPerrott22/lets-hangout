FROM node:17-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN mkdir /app/node_modules/.vite && chmod -R 777 /app/node_modules/.vite

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]