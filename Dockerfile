FROM node:18-alpine

# Create non-root user with minimal privileges
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup -h /usr/src/app && \
    mkdir -p /usr/src/app && \
    chown -R appuser:appgroup /usr/src/app && \
    chmod -R 755 /usr/src/app

WORKDIR /usr/src/app

# Copy package files with secure permissions (read-only)
COPY --chown=appuser:appgroup package.json package-lock.json ./
RUN chmod 444 package.json package-lock.json

# Install dependencies (temporarily need write access)
USER root
RUN chmod 755 . && \
    npm ci --ignore-scripts --only=production --unsafe-perm=false && \
    chown -R appuser:appgroup node_modules && \
    chmod -R 755 node_modules
USER appuser

# Copy app files with secure permissions
COPY --chown=appuser:appgroup . .
RUN find . -type f -exec chmod 444 {} \; && \
    find . -type d -exec chmod 555 {} \; && \
    chmod 755 /usr/src/app

EXPOSE 3000
CMD ["npm", "run", "start:all"]