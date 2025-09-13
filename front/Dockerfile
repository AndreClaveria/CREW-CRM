FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Nettoyer le cache Next.js
RUN rm -rf .next

# Build SANS appels API
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]