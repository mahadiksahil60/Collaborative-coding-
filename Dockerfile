# Use a smaller base image
FROM node:18-alpine

# Install necessary tools and dependencies
RUN apk update && apk add --no-cache build-base
RUN apk add --no-cache openjdk17
RUN apk add --no-cache python3 python3-dev
RUN apk add --no-cache g++

# Create and set the working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install application dependencies
RUN npm install

# Expose the necessary ports
EXPOSE 3001 3000

# Start both Next.js and WebSocket server
CMD ["sh", "-c", "npm run start:socket & npm run start"]

