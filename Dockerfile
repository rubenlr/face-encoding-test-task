FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /api
COPY --chown=node:node --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /app/dist/ .
ENV NPM_CONFIG_LOGLEVEL=warn NODE_ENV=production
RUN chown -R node:node /api
EXPOSE 3000
USER node
CMD ["sh", "-c", "node ./server.js"]
