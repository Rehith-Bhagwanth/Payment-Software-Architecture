FROM node:18-alpine

# Create and switch to non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

# Copy only necessary files
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci --omit=dev --ignore-scripts

# Copy the remaining application files
COPY config/ config/
COPY controllers/ controllers/
COPY events/ events/
COPY models/ models/
COPY public/ public/
COPY routes/ routes/
COPY service/ service/
COPY views/ views/
COPY worker/ worker/
COPY server.js ./

# Set correct permissions
RUN chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:all"]
