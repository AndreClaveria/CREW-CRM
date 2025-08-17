FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm ci

# Copier la config TypeScript
COPY tsconfig.json ./

# Copier le code source
COPY src/ ./src/

# Compiler TypeScript
RUN npm run build

RUN cp src/swagger.yaml dist/
# Exposer le port (à adapter selon le service)
EXPOSE 3003

# Démarrer l'application
CMD ["node", "dist/server.js"]