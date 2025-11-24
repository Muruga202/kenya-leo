# Optional: Node Dockerfile for production
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node","dist/server.js"]