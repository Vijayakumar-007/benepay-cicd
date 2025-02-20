# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /Documents/project1/coll-182/benecollect-dashboard-ui/src/app-router.js

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port the React app runs on (optional)
EXPOSE 3000

# Command to start the React application
CMD ["npm", "start"]