# -------------------------------
# Etapa 1: Build de Angular
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# -------------------------------
# Etapa 2: Servir con Nginx
# -------------------------------
FROM nginx:1.27-alpine

# Limpia la carpeta por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos construidos desde la etapa de build
COPY --from=builder /app/dist/azteca-frontend/browser /usr/share/nginx/html

# Ajustar permisos
RUN chmod -R 755 /usr/share/nginx/html

# Copiar configuración Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
