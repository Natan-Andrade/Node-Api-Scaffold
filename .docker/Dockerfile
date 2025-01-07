# Stage 1: Default
FROM node:18-alpine AS default
WORKDIR /app
EXPOSE 3001
COPY .docker/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/bash"]

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install --quiet && npm run build && npm prune --production

# Stage 3: Production
FROM node:18-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]