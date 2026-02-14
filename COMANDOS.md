# 🚀 Comandos para Ejecutar el Sistema

## ✨ Comando Principal (RECOMENDADO)

Ejecuta tanto el backend como el frontend desde la raíz del proyecto:

```bash
npm run dev
```

Este comando iniciará:
- ✅ Backend en `http://localhost:3001` (con auto-reload)
- ✅ Frontend en `http://localhost:5173`

---

## 📋 Otros Comandos Disponibles

### Desde la raíz del proyecto:

```bash
# Instalar todas las dependencias (backend + frontend)
npm run install:all

# Modo desarrollo (backend + frontend con auto-reload)
npm run dev

# Modo producción (backend + frontend)
npm start

# Solo backend en modo desarrollo
npm run dev:backend

# Solo frontend
npm run dev:frontend
```

### Desde la carpeta `backend/`:

```bash
# Iniciar servidor backend (producción)
npm start

# Iniciar servidor backend (desarrollo con nodemon)
npm run dev
```

### Desde la carpeta `frontend/`:

```bash
# Iniciar servidor frontend (desarrollo)
npm run dev

# Construir para producción
npm run build

# Preview de build
npm run preview
```

---

## 🔧 Solución de Problemas

### Error: "EADDRINUSE: address already in use :::3001"

El puerto 3001 ya está en uso. Para matarlo:

**En macOS/Linux:**
```bash
lsof -ti:3001 | xargs kill -9
```

**En Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID [número_del_pid] /F
```

### Error: "Cannot find module"

Instala las dependencias:

```bash
npm run install:all
```

O manualmente:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📱 Acceso a la Aplicación

Una vez iniciado con `npm run dev`:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

---

## 💡 Tips

- Usa `npm run dev` para desarrollo (tiene auto-reload)
- Usa `npm start` para simular producción
- Mantén ambas terminales abiertas mientras trabajas
- Los cambios en el código se reflejan automáticamente

---

## 🎯 Flujo de Trabajo Recomendado

1. Abre una terminal en la raíz del proyecto
2. Ejecuta: `npm run dev`
3. Espera a que ambos servidores inicien
4. Abre el navegador en `http://localhost:5173`
5. ¡Comienza a trabajar!

---

## 📊 Puertos Usados

- **3001** - Backend API (Express)
- **5173** - Frontend (Vite dev server)

Asegúrate de que estos puertos estén disponibles antes de iniciar.
