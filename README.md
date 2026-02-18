# Admiamigo 360

Plataforma digital integral para la gestión de propiedades horizontales en Bogotá, Colombia.

## 📋 Descripción

Admiamigo 360 es una solución SaaS (Software como Servicio) que moderniza la administración de propiedades horizontales urbanas, integrando:

- 🤖 **Chatbot con IA**: Gestión automática de solicitudes y resolución de conflictos
- 💰 **Control Presupuestal**: Dashboard en tiempo real de ingresos y egresos
- 💳 **Pasarela de Pagos**: Recaudo digital de cuotas y reservas
- 📅 **Gestión de Espacios Comunes**: Calendario interactivo y reservas automáticas
- 🏛️ **Asambleas Digitales**: Convocatorias, votaciones y actas virtuales
- 🤝 **Economía Colaborativa**: Marketplace de servicios verificados
- 📋 **Gestión Documental**: Centralización de PQRS y solicitudes

## 🏗️ Arquitectura

```
AdmiAmigo360/
├── frontend/              # Aplicación React/Next.js
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # API Express.js
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
├── docs/                  # Documentación
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Requisitos Previos
- Node.js 18+
- npm o yarn
- PostgreSQL 14+ (para producción)
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/admiamigo360.git
cd AdmiAmigo360
```

2. **Instalar dependencias del Frontend**
```bash
cd frontend
npm install
```

3. **Instalar dependencias del Backend**
```bash
cd ../backend
npm install
```

4. **Configurar variables de entorno**
```bash
# En backend/.env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/admiamigo360
JWT_SECRET=tu_jwt_secreto
OPENAI_API_KEY=tu_api_key_openai

# En frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Desarrollo Local

1. **Iniciar Backend** (puerto 3001)
```bash
cd backend
npm run dev
```

2. **Iniciar Frontend** (puerto 3000)
```bash
cd frontend
npm run dev
```

Accede a http://localhost:3000

## 📦 Dependencias Principales

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Axios

### Backend
- Express.js
- TypeScript
- PostgreSQL/Prisma
- JWT
- OpenAI API

## 🔑 Módulos Principales

### 1. Módulo Integrador de Solicitudes
- Chatbot AI para atención 24/7
- Gestión centralizada de PQRS
- Historial de interacciones

### 2. Control Presupuestal
- Dashboard de ingresos/egresos
- Reportes en tiempo real
- Estado de cuotas por unidad

### 3. Pasarela de Pagos
- Integración con proveedores certificados
- Recaudo de cuotas
- Gestión de mora

### 4. Reserva de Espacios Comunes
- Calendario digital interactivo
- Validación automática de disponibilidad
- Confirmación de pagos

### 5. Asambleas Virtuales
- Convocatorias automatizadas
- Votaciones en línea
- Generación automática de actas

### 6. Economía Colaborativa
- Directorio de proveedores verificados
- Sistema de calificación
- Comisiones transparentes

## 🛠️ Desarrollo

### Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Páginas de Next.js
│   ├── styles/        # Estilos globales
│   └── utils/         # Funciones auxiliares

backend/
├── src/
│   ├── controllers/   # Lógica de negocio
│   ├── routes/        # Rutas de API
│   ├── models/        # Modelos de datos
│   ├── middleware/    # Middlewares
│   └── services/      # Servicios externos (IA, pagos, etc)
```

## 🔐 Seguridad

- Autenticación JWT
- Protección de datos personales (LGPD)
- Cumplimiento de Ley 675 de 2001 (Propiedad Horizontal)
- Cumplimiento de Ley 1581 de 2012 (Protección de Datos)
- Encriptación de datos sensibles

## 📊 KPIs Principales

- ⏱️ Tiempo de respuesta: < 1.5 segundos
- 🟢 Disponibilidad: > 99.5%
- 📈 Precisión del Chatbot: > 90%
- 😊 NPS (Net Promoter Score): > 40

## 📝 Documentación

Ver carpeta `/docs` para:
- Especificaciones técnicas
- Guías de API
- Diagramas de arquitectura
- Procesos de negocio

## 👥 Equipo de Desarrollo

- **CEO**: Vandessa García (Dirección Estratégica)
- **CTO**: Juan Camilo Díaz (Arquitectura Tecnológica)
- **COO**: Juan David López (Operaciones y Comercial)

## 📄 Licencia

Propiedad Intelectual © 2026 Admiamigo 360 S.A.S.

## 📞 Soporte

Para soporte técnico:
- Email: soporte@admiamigo360.com
- Documentación: https://docs.admiamigo360.com

---

**Admiamigo 360**: Cada decisión cuenta, administra con pasión y compromiso 🏢
