# Utiliser une image Node compatible Vite (>=20.19 ou 22.12)
FROM node:22

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (ou pnpm-lock.yaml / yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code frontend
COPY . .

# Exposer le port de développement Vite
EXPOSE 5173

# Lancer Vite en mode dev et accepter les connexions externes
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
