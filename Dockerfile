FROM node:18-alpine


RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    mkdir -p /usr/src/app && \
    chown -R appuser:appgroup /usr/src/app

WORKDIR /usr/src/app


USER appuser


COPY --chown=appuser:appgroup package.json package-lock.json ./


RUN npm ci --ignore-scripts --only=production


COPY --chown=appuser:appgroup . .

EXPOSE 3000

CMD ["npm", "run", "start:all"]