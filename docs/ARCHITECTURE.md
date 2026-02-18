# Arquitectura Admiamigo 360

## 📐 Visión General

Admiamigo 360 es una plataforma SaaS construida con una arquitectura moderna y escalable:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│            (React + TypeScript + TailwindCSS)            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│                Backend (Express.js)                      │
│           (Node.js + TypeScript + Prisma)               │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────┐
│             Database (PostgreSQL)                        │
│         (Usuarios, Propiedades, Finanzas, etc)          │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Componentes Principales

### Frontend (Next.js 14)
- **Framework**: Next.js con App Router
- **UI**: React 18 + TailwindCSS
- **Estado**: Zustand/React Context
- **HTTP Client**: Axios
- **Formularios**: React Hook Form

### Backend (Express.js)
- **Framework**: Express.js
- **ORM**: Prisma
- **Autenticación**: JWT
- **Validación**: Zod/Joi
- **IA**: OpenAI API

### Database (PostgreSQL)
- **Versión**: 14+
- **ORM**: Prisma
- **Migraciones**: Prisma Migrations

## 📊 Modelos de Datos Principales

### usuarios
```
- id (UUID)
- email (unique)
- password (hash)
- nombre
- rol (admin, resident, manager)
- propiedad_id
- created_at
```

### propiedades_horizontales
```
- id (UUID)
- nombre
- direccion
- ciudad
- no_unidades
- reglamento_interno
- created_at
```

### solicitudes (PQRS)
```
- id (UUID)
- usuario_id
- tipo (peticion|queja|reclamo|sugerencia)
- titulo
- descripcion
- estado (abierta|en_proceso|resuelta|cerrada)
- prioridad (baja|media|alta)
- created_at
- updated_at
```

### finanzas
```
- id (UUID)
- propiedad_id
- tipo (ingreso|egreso)
- concepto
- monto
- fecha
- comprobante_url
- created_at
```

### pagos
```
- id (UUID)
- usuario_id
- propiedad_id
- monto
- estado (pendiente|completado|fallido)
- metodo (tarjeta|transferencia)
- created_at
```

## 🔄 Flujos Principales

### Flujo de Solicitud (PQRS)
1. Usuario crea solicitud en el portal
2. Chatbot IA analiza y clasifica la solicitud
3. Sistema genera respuesta automática o asigna a administrador
4. Se registra en historial de interacciones
5. Seguimiento en tiempo real

### Flujo de Pago
1. Usuario inicia proceso de pago
2. Integración con Stripe/PayU
3. Confirmación de transacción
4. Actualización de estado de cuota
5. Notificación a usuario y administrador

### Flujo de Asamblea
1. Administrador crea convocatoria
2. Invitaciones automáticas a copropietarios
3. Votación en línea
4. Validación automática de quórum
5. Generación de acta

## 🔐 Seguridad

- **Autenticación**: JWT con refresh tokens
- **Encriptación**: bcryptjs para contraseñas
- **CORS**: Configurado para frontend
- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Helmet**: Headers HTTP de seguridad
- **Validación**: Validación de entrada en cada endpoint

## 📈 Escalabilidad

- **Deploy**: Vercel (Frontend), Render/Railway (Backend)
- **Database**: PostgreSQL managed (AWS RDS/Railway)
- **Caché**: Redis (a futuro)
- **CDN**: Vercel CDN para assets estáticos
- **Logs**: CloudWatch/Sentry

## 🚀 Deployment

### Frontend
```bash
# Vercel CLI (recomendado)
vercel deploy
```

### Backend
```bash
# Render, Railway, o Heroku
git push heroku main
```

## 📝 API Endpoints

(A completar con documentación Swagger)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/solicitudes`
- `GET /api/finanzas`
- `POST /api/pagos`
- `POST /api/asambleas`

## 🔗 Integraciones Externas

- **OpenAI API**: Chatbot IA
- **Stripe/PayU**: Pasarela de pagos
- **SendGrid/Gmail**: Envío de emails
- **Twilio**: SMS (futuro)

---

Para más detalles, ver documentación de APIs en `/docs/API.md`
