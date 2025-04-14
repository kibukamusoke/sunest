# Base image
FROM node:21-alpine

RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000
EXPOSE 5555

# Start the server
CMD ["./dist/scripts/startup.sh"]