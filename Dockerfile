FROM node:24-bookworm-slim
WORKDIR /app
COPY dist ./dist
COPY game ./game
COPY server.mjs ./server.mjs
ENV PORT=3000 DATA_DIR=/data HOST=0.0.0.0
VOLUME /data
EXPOSE 3000
CMD ["node", "server.mjs"]
