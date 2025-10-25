# Entrar al directorio frontend
cd frontend

# Instalar dependencias (primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev

# Entrar al directorio backend
cd backend

# Instalar dependencias
npm install

# Ejecutar servidor (depende de tu package.json)
npm start
# o
npm run dev
# Construir para producción
npm run build

# Previsualizar build
npm run preview



# Actualizar desde GitHub antes de trabajar
git pull origin main

# Ver estado de los archivos
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Cambios tarea "

# Subir a GitHub
git push origin main


Trabajar con Ramas



# Ver ramas existentes
git branch

# Crear nueva rama
git checkout -b nombre-de-la-rama

# Cambiar entre ramas
git checkout nombre-rama

# Subir rama al repositorio remoto
git push -u origin nombre-rama

# Fusionar rama con main
git checkout main
git pull origin main
git merge nombre-rama



# Descargar últimos cambios
git pull origin main

# Forzar actualización (cuidado)
git fetch origin
git reset --hard origin/main