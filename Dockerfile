# Stage 1: Base for dependencies and build
FROM node:20 AS base

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files for installing dependencies
COPY package.json yarn.lock ./

# Install all dependencies using yarn
RUN yarn install

# Copy the rest of the project files including the server files
COPY . .

# Build the project
RUN yarn build


# Stage 2: Production image (lighter version)
FROM node:20-alpine3.19 AS release

# Set the working directory
WORKDIR /app

# Copy necessary files and folders from the base stage
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/public ./public

# Copy the server files from the base stage
COPY --from=base /app/src/server ./src/server

# Set environment variables for production
ENV NODE_ENV=production

# Expose the ports used by Next.js and the WebSocket server
EXPOSE 3000
EXPOSE 3004

# Default command to start the application
CMD ["yarn", "start"]
