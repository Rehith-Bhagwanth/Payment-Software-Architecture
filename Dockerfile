FROM node:18-alpine


WORKDIR /usr/src/app


COPY package.json package-lock.json* ./


RUN npm ci --ignore-scripts


COPY . .


EXPOSE 3000


CMD ["npm", "run", "start:all"]
