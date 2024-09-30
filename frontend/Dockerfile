# Stage 1: Build the Angular app
FROM node:18.20.4-alpine AS build

# Set environment variables using Docker ARG directives
ARG PRODUCTION=true
ARG HOSTNAME=localhost:8000/
ARG WS_ENDPOINT=ws/rideshare/
ARG SIGNUP=v1/signup
ARG LOGIN=v1/login
ARG TOKEN_REFRESH=v1/token/refresh
ARG TRIPS=v1/trip
ARG GOOGLE_MAPS_API_KEY

ENV PRODUCTION=$PRODUCTION
ENV HOSTNAME=$HOSTNAME
ENV WS_ENDPOINT=$WS_ENDPOINT
ENV SIGNUP=$SIGNUP
ENV LOGIN=$LOGIN
ENV TOKEN_REFRESH=$TOKEN_REFRESH
ENV TRIPS=$TRIPS
ENV GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Write the environment variables to a TypeScript file
RUN cat <<EOF > src/environments/environment.prod.ts
export const environment = {
  production: ${PRODUCTION:-true},
  hostname: '${HOSTNAME:-localhost:8000/}',
  wsEndpoint: '${WS_ENDPOINT:-ws/rideshare/}',
  signup: '${SIGNUP:-v1/signup}',
  login: '${LOGIN:-v1/login}',
  tokenRefresh: '${TOKEN_REFRESH:-v1/token/refresh}',
  trips: '${TRIPS:-v1/trip}',
  googleMapsApiKey: '${GOOGLE_MAPS_API_KEY}',
};
EOF

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Remove the 50x.html default Nginx page
RUN rm /usr/share/nginx/html/50x.html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]
