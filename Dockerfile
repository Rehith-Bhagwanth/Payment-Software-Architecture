FROM node:18-alpine

# Create and switch to non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

# Copy only package files first (for better caching)
COPY package.json package-lock.json .  

# Install dependencies safely (omit dev dependencies for production)
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Set correct permissions
RUN chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:all"]
