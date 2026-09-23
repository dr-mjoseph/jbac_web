# Stage 1: Build Angular application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code and build production bundle
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled Angular distribution
COPY --from=builder /app/dist/churchwebsite /usr/share/nginx/html

# Copy custom Nginx configuration for Angular SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
