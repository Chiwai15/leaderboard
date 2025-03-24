# Stage 1: Build
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
# Set NODE_ENV to development to install all dependencies
ENV NODE_ENV=development
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install a lightweight HTTP server
RUN npm install -g serve
RUN npm install -g vite

# Copy the build output from the previous stage
COPY --from=builder /app/dist .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["serve", "-s", ".", "-l", "3000"]
