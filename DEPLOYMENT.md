# Deployment Admiamigo 360

## 🌐 Frontend - Vercel (DESPLEGADO ✅)

**URL:**  https://frontend-phi-lemon-84.vercel.app

### Características del Deploy Frontend
- Desplegado automático desde GitHub
- HTTPS seguro
- CDN global de Vercel
- Próximos pasos: CI/CD automático en cada push a main

---

## 🖥️ Backend - Express.js

Elige una de las siguientes opciones para desplegar el backend:

### Opción 1: Render (Recomendado)

#### Configuración rápida:

1. **Ir a render.com**
   - Registrarse / Iniciar sesión
   - Conectar GitHub

2. **Crear nuevo servicio Web**
   - Seleccionar repositorio `AdmiAmigo360`
   - Nombre: `admiamigo360-backend`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment: `Node`
   - Plan: Free (para pruebas) o Starter

3. **Agregar variables de entorno:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu_jwt_secreto
   OPENAI_API_KEY=sk-...
   STRIPE_SECRET_KEY=sk_test_...
   NODE_ENV=production
   ```

4. **Deploy automático**
   - Render deploya automáticamente con cada push a main

#### Archivo de configuración (crear en raíz del backend):

```bash
# render.yaml (opcional, para auto-deploy)
```

---

### Opción 2: Railway

1. **Ir a railway.app**
   - Sign up con GitHub
   - Crear nuevo proyecto

2. **Conectar repo de GitHub**
   - Seleccionar `AdmiAmigo360`

3. **Configurar servicio**
   - Root directory: `backend`
   - Build command: `npm run build`
   - Start command: `npm start`

4. **Agregar base de datos PostgreSQL**
   - Railway ofrece PostgreSQL managed

5. **Variables de entorno**
   - Las mismas que Render

---

### Opción 3: Heroku (en fase de depreciación)

```bash
# Install Heroku CLI
# Crear aplicación
heroku create admiamigo360-backend

# Agregar base de datos
heroku addons:create heroku-postgresql:standard-0

# Configurar variables
heroku config:set JWT_SECRET=tu_secreto
heroku config:set OPENAI_API_KEY=sk-...

# Deploy
git push heroku main
```

---

## 📦 Base de Datos - PostgreSQL

### Opción 1: Managed Database (Recomendado)

- **Render Database:** render.com/postgres
- **Railway Database:** railway.app/postgres
- **AWS RDS:** aws.amazon.com/rds/postgresql
- **Neon:** neon.tech (PostgreSQL sin servidor)

### Opción 2: Local Development

```bash
# Instalar PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql-14  # Ubuntu

# Crear base de datos
createdb admiamigo360

# Conectar
psql admiamigo360
```

---

## 🔗 Conexión Frontend-Backend

Después de desplegar el backend, actualizar:

**frontend/.env.production**
```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

**O actualizar en Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL https://tu-backend.onrender.com --prod
```

---

## 📋 Checklist de Deployment

### Frontend (Vercel)
- [x] Código en GitHub
- [x] Build exitoso
- [x] Desplegado en producción
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar Analytics (opcional)

### Backend (Pendiente)
- [ ] Crear cuenta en Render/Railway
- [ ] Conectar repositorio
- [ ] Configurar Variables de Entorno
- [ ] Base de datos PostgreSQL
- [ ] Ejecutar migraciones Prisma
- [ ] Verificar health check
- [ ] Configurar CORS con URL de frontend

### Base de Datos
- [ ] Crear instancia PostgreSQL
- [ ] Backups configurados
- [ ] SSL/TLS habilitado

---

## 🚀 Deploy Automático

### GitHub Actions (CI/CD)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/srv-xxx?key=${{ secrets.RENDER_DEPLOY_KEY }}
```

---

## 🔐 Variables de Entorno Necesarias

### Backend Production (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/admiamigo360

# Server
PORT=3000
NODE_ENV=production

# Authentication
JWT_SECRET=cambiar_en_produccion_por_valor_seguro

# External APIs
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Frontend URL
FRONTEND_URL=https://frontend-phi-lemon-84.vercel.app

# Email
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

---

## ✅ Verificación de Deployments

### Frontend
```bash
# Visitar
https://frontend-phi-lemon-84.vercel.app

# Verificar health
curl https://frontend-phi-lemon-84.vercel.app/api/health
```

### Backend
```bash
# Después de desplegar
curl https://tu-backend.onrender.com/api/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "timestamp": "2026-02-18T...",
#   "service": "Admiamigo 360 API"
# }
```

---

## 🆘 Troubleshooting

### Error: "Build failed"
- Verificar `npm run build` funciona localmente
- Revisar TypeScript: `npm run type-check`

### Error: "Database connection refused"
- Verificar `DATABASE_URL` está correcto
- Agregar IP a whitelist si es necesario
- Verificar credenciales

### Error: "CORS issues"
- Verificar `FRONTEND_URL` en backend .env
- Revisar configuración CORS en `backend/src/index.ts`

### Error: "Module not found"
- Ejecutar `npm install` en directorio correcto
- Verificar `package.json` tiene dependencias necesarias

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Prisma Migration](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)

---

## 🎯 Próximos Pasos

1. [x] Desplegar frontend en Vercel
2. [ ] Desplegar backend en Render/Railway
3. [ ] Configurar base de datos PostgreSQL
4. [ ] Conectar servicios (OpenAI, Stripe)
5. [ ] Configurar dominio personalizado
6. [ ] Implementar CI/CD automático
7. [ ] Setup de monitoreo y logs
8. [ ] Backup automático de base de datos

---

**Admiamigo 360** - Desplegado ✅

Cada decisión cuenta, administra con pasión y compromiso 🏢
