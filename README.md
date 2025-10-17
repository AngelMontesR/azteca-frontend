1. Requisitos Previos
Asegúrate de tener instalado:

Node.js y npm (versión recomendada: 20).
Angular CLI (npm install -g @angular/cli).


2. Descargar el Proyecto
Primero, descarga o clona el repositorio del proyecto:

Bash
    git clone https://github.com/AngelMontesR/azteca-frontend
    cd azteca-frontend
3. Levantar el Frontend (Angular)
Accede a la carpeta del frontend e inicia la aplicación Angular:

Acceder al directorio:

Bash

cd frontend
Instalar dependencias:

Bash

npm install
Ejecutar el servicio:

Bash

ng serve
El frontend estará disponible en http://localhost:4200/.

4. Levantar el Backend (Node.js)
Abre una nueva ventana de terminal y accede a la carpeta del backend para iniciar la API:

Acceder al directorio:

Bash

cd backend
Instalar dependencias:

Bash

npm install
Ejecutar el servicio:

Bash

npm run dev
El backend estará disponible en el puerto configurado (ej: http://localhost:3000/).

Ambos servicios deben estar corriendo simultáneamente para que la aplicación funcione correctamente.