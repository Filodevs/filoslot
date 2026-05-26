# Filoslot

Aplicación web Angular 21 para gestión de reservas y citas de negocios. Permite a clientes reservar turnos en línea y a administradores gestionar su agenda, servicios y recursos.

## Stack tecnológico

| Categoría    | Tecnología                                     |
| ------------ | ---------------------------------------------- |
| Framework    | Angular 21.1 (standalone components, signals)  |
| UI           | PrimeNG 21.1 + Tailwind CSS 4 (tema Aura)      |
| Estado       | Signals (`signal`, `computed`, `linkedSignal`) |
| HTTP / Async | HttpClient + RxJS Observable                   |
| Backend      | Supabase (auth + realtime + database)          |
| Formularios  | ReactiveFormsModule                            |
| Testing      | Vitest 4.0.18 + @angular/build:unit-test       |
| Package mgr  | pnpm                                           |
| PWA          | @angular/service-worker                        |

## Estructura del proyecto

```
src/app/
  core/
    guards/          # authGuard (protege rutas admin)
    interceptors/    # authInterceptor (agrega token JWT)
    layout/          # AdminLayout, PublicLayout
    services/        # auth, business, catalog, resource, appointment…
  features/
    admin/           # Dashboard, Setup (servicios/recursos/disponibilidad), Perfil
    auth/            # Login
    public/          # Directorio, Booking, BookingConfirmation, BusinessProfile
  models/            # Interfaces TypeScript + __mocks__/ para tests
  shared/
    components/      # AppButton, AppInput, AppSelect, Topbar, Footer…
    directives/      # BaseInput
    pipes/           # initials, avatarColor
```

## Comandos de desarrollo

```bash
pnpm start              # Servidor de desarrollo en http://localhost:4200
pnpm run build          # Build de producción → dist/
pnpm run lint           # ESLint
```

## Comandos de testing

```bash
pnpm test               # Tests en modo watch
pnpm run test:run       # Tests una sola vez (sin watch)
pnpm run test:coverage  # Tests + reporte de cobertura en coverage/
```

> Cobertura actual: ~60% statements. Objetivo: 70%+.

## Arquitectura de rutas

```
/                     → PublicLayout
  /directory          → Directorio de negocios
  /b/:slug            → Perfil público del negocio
  /booking/:slug      → Flujo de reserva
  /booking/confirm    → Confirmación de cita
/admin                → AdminLayout  (requiere authGuard)
  /admin/dashboard    → Panel principal
  /admin/setup        → Configuración (info, servicios, recursos, disponibilidad)
  /admin/profile      → Perfil del negocio
/auth/login           → Login (sin layout)
```

## Variables de entorno

Configura `src/environments/environment.ts` con:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://<project>.supabase.co',
  supabaseKey: '<anon-key>',
  apiUrl: 'https://...',
};
```
