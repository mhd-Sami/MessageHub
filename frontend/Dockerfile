FROM node:16

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the React app's source code
COPY . ./

# Expose the development server's port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
