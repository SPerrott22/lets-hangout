FROM node:17-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN mkdir /app/node_modules/.vite && mkdir /app/node_modules/.vite/deps && chmod 777 /app/node_modules/.vite && chmod 777 /app/node_modules/.vite/deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]