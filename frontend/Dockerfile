FROM node:20.10.0-slim as development

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
