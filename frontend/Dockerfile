FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite utiliza --host para permitir conexiones desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
