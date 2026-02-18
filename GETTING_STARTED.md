# 🚀 Admiamigo 360 - Primeros Pasos

## ✅ Lo que ya está hecho

- [x] Repositorio creado y subido a GitHub
- [x] Estructura full-stack (Frontend + Backend) lista
- [x] Configuración de TypeScript
- [x] Configuración de TailwindCSS
- [x] Página de inicio con módulos principales
- [x] Base del API Backend en Express.js
- [x] Documentación de arquitectura

**URL del Repositorio:** https://github.com/Andru775/AdmiAmigo360

## ⚙️ Próximos Pasos

### 1. Clonar y Configurar Localmente

```bash
# Clonar desde GitHub
git clone https://github.com/Andru775/AdmiAmigo360.git
cd AdmiAmigo360

# Copiar archivos de configuración
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Configurar las variables de entorno en:
# - backend/.env
# - frontend/.env.local
```

### 2. Instalar Dependencias

```bash
# En la raíz del proyecto
npm install

# O instalar por separado:
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
createdb admiamigo360

# Ejecutar migraciones Prisma (cuando esté configurado)
# cd backend && npx prisma migrate dev --name init
```

### 4. Iniciar Aplicación en Desarrollo

**Opción A - Ambas aplicaciones desde raíz:**
```bash
npm run dev
```

**Opción B - Por separado:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Se ejecuta en http://localhost:3001
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Se ejecuta en http://localhost:3000
```

### 5. Verificar que Todo Funciona

- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- Debug: http://localhost:3000/debug

## 📋 Módulos por Implementar

### Fase 1 (Semanas 1-2)
- [ ] Módulo de Autenticación (Login/Registro)
- [ ] Dashboard Principal
- [ ] Integración Base de Datos

### Fase 2 (Semanas 3-4)
- [ ] Módulo de Solicitudes (PQRS)
- [ ] Chatbot IA (integración OpenAI)

### Fase 3 (Semanas 5-6)
- [ ] Módulo de Finanzas
- [ ] Control Presupuestal

### Fase 4 (Semanas 7-8)
- [ ] Pasarela de Pagos (Stripe)
- [ ] Reserva de Espacios

### Fase 5 (Semanas 9-10)
- [ ] Asambleas Digitales
- [ ] Economía Colaborativa

## 🔑 Variables de Entorno Necesarias

### Backend (.env)
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/admiamigo360
JWT_SECRET=tu_jwt_secreto_cambiar_en_produccion
OPENAI_API_KEY=sk-... # Registrarse en openai.com
STRIPE_SECRET_KEY=sk_test_... # Registrarse en stripe.com
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 Documentación

- [ARQUITECTURA](./docs/ARCHITECTURE.md) - Diagrama técnico del sistema
- [SETUP](./docs/SETUP.md) - Guía detallada de instalación
- [README](./README.md) - Descripción general del proyecto

## 🛠️ Comandos Útiles

### Backend
```bash
cd backend

# Desarrollo
npm run dev

# Build
npm run build

# Iniciar producción
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Frontend
```bash
cd frontend

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Type checking
npm run type-check
```

## 🔐 Servicios Externos a Registrar

1. **OpenAI API** (para Chatbot IA)
   - Ir a: https://platform.openai.com
   - Crear cuenta
   - Generar API key
   - Agregar a `OPENAI_API_KEY`

2. **Stripe** (para Pagos)
   - Ir a: https://stripe.com
   - Crear cuenta
   - Obtener keys de prueba
   - Agregar a `STRIPE_SECRET_KEY` y `STRIPE_PUBLIC_KEY`

3. **PostgreSQL** (Base de Datos)
   - Instalar localmente o usar servicio managed
   - Crear base de datos `admiamigo360`

## 📦 Especificación de Tecnologías

### Frontend
- ✅ Next.js 14
- ✅ React 18
- ✅ TypeScript
- ✅ TailwindCSS
- ✅ Axios

### Backend
- ✅ Express.js
- ✅ TypeScript
- ✅ PostgreSQL
- ✅ Prisma ORM
- ✅ JWT Authentication

## 🎯 Objetivos Principales

1. ✅ Plataforma web escalable
2. ⚙️ Chatbot IA para atención 24/7
3. ⚙️ Control presupuestal en tiempo real
4. ⚙️ Pasarela de pagos integrada
5. ⚙️ Asambleas virtuales
6. ⚙️ Economía colaborativa

## 💡 Recomendaciones

- Usar Visual Studio Code con extensiones:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint
  - Thunder Client o Postman para testing de APIs

- Seguir las convenciones de código en:
  - `/docs`

- Commit messages en formato:
  - `feat: Agregar nuevo módulo`
  - `fix: Corregir bug en autenticación`
  - `docs: Actualizar documentación`

## 🤝 Contacto y Soporte

- **Email**: dev@admiamigo360.com
- **Repositorio**: https://github.com/Andru775/AdmiAmigo360
- **Equipo**:
  - CEO: Vandessa García
  - CTO: Juan Camilo Díaz
  - COO: Juan David López

## 📞 Recursos Adicionales

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Express.js](https://expressjs.com/)
- [Documentación Prisma](https://www.prisma.io/docs/)
- [API Reference OpenAI](https://platform.openai.com/docs/api-reference)

---

**¡Bienvenido a Admiamigo 360!** 🏢

Cada decisión cuenta, administra con pasión y compromiso.
