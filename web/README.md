# AdmiAmigo360 Web

Frontend inmersivo de AdmiAmigo360 construido con Next.js.

## Enlaces

- App pública: https://admiamigo360app.vercel.app
- URL base de Vercel del proyecto: https://web-alpha-one-42.vercel.app

## Rama de Trabajo

- Rama principal de desarrollo del equipo visual: `visual-proposal-feb`
- Evitar enviar cambios a `main` hasta aprobación final.

## Desarrollo Local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Si está ocupado, Next usará otro puerto (por ejemplo `3001`).

## Deploy Manual (cuando se necesite)

Desde esta carpeta `web/`:

```bash
vercel --prod
```

## Estructura Clave

- `src/app/page.tsx`: entrada principal.
- `src/components/sections/CinematicHero.tsx`: hero con video sincronizado al scroll.
- `src/components/sections/ImmersiveSections.tsx`: secciones animadas del sitio.
- `public/media/`: videos y recursos multimedia.
