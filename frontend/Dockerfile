# Stage 1: Build the Angular app
FROM node:18.20.4-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]
