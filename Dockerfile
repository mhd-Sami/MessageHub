FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY backend ./backend
COPY .env ./

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
