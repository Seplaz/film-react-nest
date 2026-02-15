FROM node:20-slim AS builder

WORKDIR /app

# Copy only package.json to avoid platform-specific optional deps from host lockfile
COPY package.json ./
# Use npm install so optional native packages are resolved for the build container
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
