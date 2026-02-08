# Ejemplos React Native (Expo)

Repositorio con dos ejemplos prácticos de Expo + React Native. Cada carpeta es un proyecto independiente con su propio `package.json` y configuración.

**Estructura**

- `ejemploNotificacionesPush`: autenticación con Supabase + registro de token y envío de notificaciones push con Expo.
- `ejemploSupabaseStorage`: catálogo de productos con imágenes alojadas en Supabase Storage.

**Requisitos**

- Node.js y npm.
- Expo CLI a través de `npx` (no requiere instalación global).
- Una cuenta de Supabase para los ejemplos que lo usan.

**Ejemplo 1: Notificaciones push con Supabase**

Lo que hace el proyecto:

- Login/registro con Supabase Auth.
- Registro del token push del dispositivo en la tabla `push_tokens`.
- Envío de notificaciones a todos los tokens registrados usando el gateway de Expo.

Configuración rápida:

1. En Supabase, ejecuta el SQL de `ejemploNotificacionesPush/supabase/push_tokens.sql`.
2. Crea un archivo `.env` en `ejemploNotificacionesPush` con:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Inicia el proyecto:

```bash
cd ejemploNotificacionesPush
npm install
npx expo start
```

Notas importantes:

- Las notificaciones push requieren dispositivo físico. En simulador no funcionarán.
- Si usas Expo Go, algunas capacidades de notificaciones pueden estar limitadas. Un build de desarrollo suele ser la opción más estable.

**Ejemplo 2: Supabase Storage + catálogo de productos**

Lo que hace el proyecto:

- Lista de productos desde una tabla `products`.
- Detalle y edición de productos.
- Subida de imágenes a Supabase Storage y guardado de rutas en la tabla.

Configuración rápida:

1. En Supabase, ejecuta en orden los SQL de `ejemploSupabaseStorage/sql/`:
   - `01_create_products_table.sql`
   - `02_products_rls_policies.sql`
   - `03_products_seed.sql` (opcional)
2. Crea un bucket de Storage (por ejemplo `products`) y hazlo público, o ajusta el código para URLs firmadas.
3. Crea un archivo `.env` en `ejemploSupabaseStorage` con:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET`
4. Inicia el proyecto:

```bash
cd ejemploSupabaseStorage
npm install
npx expo start
```

Notas:

- La pantalla de edición permite subir múltiples imágenes usando `expo-image-picker`.
- Las imágenes que no sean URLs completas se resuelven como públicas en el bucket configurado.

**Dónde mirar el código**

- Supabase Auth y push: `ejemploNotificacionesPush/hooks/use-auth.ts`, `ejemploNotificacionesPush/hooks/use-push-notifications.ts`.
- UI y navegación push: `ejemploNotificacionesPush/app/login.tsx`, `ejemploNotificacionesPush/app/notifications.tsx`.
- Productos y Storage: `ejemploSupabaseStorage/src/services/products.ts`, `ejemploSupabaseStorage/src/services/storage.ts`.
- Rutas y pantallas: `ejemploSupabaseStorage/src/app`.

Si quieres, puedo añadir capturas, instrucciones para EAS builds o un apartado de troubleshooting.
