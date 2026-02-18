# Guía de Configuración - Admiamigo 360

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/admiamigo360.git
cd AdmiAmigo360
```

### 2. Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Configurar Variables de Entorno

#### Backend (`backend/.env`)
```bash
# Copiar del archivo de ejemplo
cp .env.example .env

# Editar con tus valores:
DATABASE_URL=postgresql://usuario:password@localhost:5432/admiamigo360
JWT_SECRET=tu_jwt_secreto_cambiar_en_produccion
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
```

#### Frontend (`frontend/.env.local`)
```bash
cp .env.example .env.local

# Editar si es necesario:
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb admiamigo360

# Ejecutar migraciones Prisma
cd backend
npx prisma migrate dev --name init

# Generar Prisma client
npx prisma generate
```

### 5. Iniciar Desarrollo

#### Opción A: Ambas aplicaciones (desde raíz)
```bash
npm run dev
```

#### Opción B: Por separado

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Accede a:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

## 📋 Configuración de Servicios Externos

### OpenAI API
1. Registrarse en https://platform.openai.com
2. Crear API key
3. Agregar a `backend/.env`

### Stripe/PayU
1. Crear cuenta en stripe.com
2. Obtener keys de prueba
3. Agregar a `backend/.env`

### PostgreSQL
```bash
# Instalar si no está instalado:
# macOS:
brew install postgresql

# Ubuntu:
sudo apt install postgresql-14

# Iniciar servicio:
# macOS:
brew services start postgresql

# Ubuntu:
sudo systemctl start postgresql
```

## 🔍 Validar Instalación

```bash
# Verificar Node.js
node --version  # >= 18

# Verificar npm
npm --version

# Verificar PostgreSQL
psql --version

# Verificar conexión a base de datos
psql admiamigo360 -c "SELECT 1"

# Verificar APIs
curl http://localhost:3001/api/health
```

## 📁 Estructura de Proyectos

```
AdmiAmigo360/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   ├── next.config.js
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma
│   └── tsconfig.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── API.md
└── package.json
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
# Si el error persiste después de npm install
rm -rf node_modules package-lock.json
npm install
```

### Error: Database connection refused
```bash
# Verificar si PostgreSQL está corriendo
psql -U postgres

# Si no está corriendo, iniciar:
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
```

### Error: PORT 3001 already in use
```bash
# Encontrar proceso usando el puerto
lsof -i :3001

# Matarlo
kill -9 <PID>

# O cambiar puerto en .env
PORT=3002
```

### Error: CORS issues
```bash
# Verificar que FRONTEND_URL esté correcto en backend/.env
FRONTEND_URL=http://localhost:3000
```

## ✅ Próximos Pasos

1. [✓] Instalar dependencias
2. [✓] Configurar base de datos
3. [ ] Configurar servicios externos (OpenAI, Stripe)
4. [ ] Crear usuario inicial (admin)
5. [ ] Desarrollar módulos principales
6. [ ] Realizar tests
7. [ ] Deploy a producción

---

¿Necesitas ayuda? Contacta a soporte@admiamigo360.com
