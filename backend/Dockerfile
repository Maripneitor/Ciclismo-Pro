FROM node:20-alpine

# Instalar dependencias necesarias para node-postgres si es necesario (generalmente no en alpine)
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# La base de datos estará en otro contenedor, por lo que usaremos variables de entorno enviadas por docker-compose

EXPOSE 3001

CMD ["node", "--watch", "src/server.js"]
