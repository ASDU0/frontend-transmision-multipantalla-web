# Frontend Transmisión Multipantalla

App Next.js (App Router + Tailwind v4) para ver categorías y transmitir pantalla.

## Configuración
1. Node 18+
2. `cp .env.local.example .env.local` (o crea `.env.local`)
3. `NEXT_PUBLIC_BACKEND_URL` debe apuntar al backend (local o Render)
4. Opcional: `NEXT_PUBLIC_ICE_SERVERS` para configurar STUN/TURN (JSON). Ver `.env.local.example`.

## Desarrollo
- `npm install`
- `npm run dev` y abre http://localhost:3000

## Producción
- `npm run build` y `npm start`

## Rutas
- `/` inicio con enlaces a categorías y temporizador
- `/categoria/[id]` viewer WebRTC (recibe múltiples streams)
-- `/transmitir?cat=1` broadcaster WebRTC (comparte pantalla a la categoría)

## Notas de conectividad (WebRTC)
- Por defecto usa STUN público de Google.
- En redes restrictivas necesitarás TURN. Define `NEXT_PUBLIC_ICE_SERVERS` con tus servidores.
- Ejemplo: `[{"urls":["stun:stun.l.google.com:19302"]},{"urls":"turn:turn.example.com:3478","username":"user","credential":"pass"}]`

## Primeros Pasos

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar editando la página modificando `app/page.tsx`. La página se actualiza automáticamente mientras editas el archivo.

Este proyecto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para optimizar y cargar automáticamente [Geist](https://vercel.com/font), una nueva familia de fuentes para Vercel.

## Despliegue
- Vercel: crea proyecto nuevo, importa este repo, añade `NEXT_PUBLIC_BACKEND_URL` y opcional `NEXT_PUBLIC_ICE_SERVERS`.

