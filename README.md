# AdmiAmigo 360 App

Aplicación mobile-first para administración de conjuntos residenciales. Incluye frontend Next.js, conexión con Supabase, autenticación por correo, Google y Microsoft, pantallas de administrador/residente, migraciones de base de datos y referencias visuales exportadas desde Stitch.

## Estructura

- `web/`: aplicación principal en Next.js.
- `supabase/`: migraciones SQL para crear tablas, relaciones, RLS y datos base.
- `stitch/`: capturas y HTML de referencia del diseño original.
- `.github/workflows/`: validación automática con lint y build.

## Desarrollo local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Variables de entorno

Usa como base:

```bash
cp web/.env.example web/.env.local
```

Configura en `web/.env.local`:

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

No subas `.env.local`, llaves privadas, `.vercel`, `.next` ni `node_modules`.

## Publicación para celulares

La ruta recomendada para este proyecto es:

1. Sube este repo a GitHub.
2. Importa el repo en Vercel.
3. En Vercel, configura el `Root Directory` como `web`.
4. Agrega las variables de entorno necesarias.
5. Despliega.

Con eso la app quedará disponible en una URL pública tipo:

```text
https://tu-proyecto.vercel.app
```

Cada `git push` a la rama principal generará un nuevo despliegue automáticamente si Vercel está conectado al repo.

## Instalarla como app en iPhone o Android

La app ya incluye `manifest`, `icon` y `apple icon`, asi que se puede instalar como PWA:

- iPhone: abrir en Safari > Compartir > `Agregar a pantalla de inicio`
- Android: abrir en Chrome > menú > `Instalar app` o `Agregar a pantalla principal`

## Comandos útiles

```bash
npm run lint
npm run build
npm run start
```
