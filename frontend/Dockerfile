# Stage 1: Build the React application
FROM node:18

WORKDIR /app

COPY package.json ./
# COPY package-lock.json ./

RUN npm install

COPY . .

# Expose the port and start the development server
EXPOSE 3000
CMD ["npm", "start"]