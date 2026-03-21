# Environment Configuration

Esta carpeta contiene la configuración de entorno para la aplicación Filoslot.

## Archivos

- **`environment.interface.ts`** - Define la interfaz TypeScript para la configuración de entorno
- **`environment.ts`** - Configuración de desarrollo (usado con `npm start`)
- **`environment.prod.ts`** - Configuración de producción (usado con `npm run build`)

## Estructura

La configuración está organizada en las siguientes secciones:

```typescript
{
  production: boolean;           // Flag de producción
  api: {
    baseUrl: string;             // URL base de la API
    timeout: number;             // Timeout de las peticiones HTTP (ms)
    auth: { ... };               // Endpoints de autenticación
    business: { ... };           // Endpoints de negocios
    appointments: { ... };       // Endpoints de citas
    services: { ... };           // Endpoints de servicios
    resources: { ... };          // Endpoints de recursos
    slots: { ... };              // Endpoints de disponibilidad
    directory: { ... };          // Endpoints del directorio
  };
  features: {
    enableMocking: boolean;      // Habilitar datos simulados
    enableAnalytics: boolean;    // Habilitar analytics
    enableServiceWorker: boolean; // Habilitar service worker
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'; // Nivel de logging
    enableConsole: boolean;      // Mostrar logs en consola
  };
}
```

## Uso

### Acceso directo a variables

```typescript
import { environment } from '@/environments/environment';

// Usar la configuración
const apiUrl = environment.api.baseUrl;
```

### Usando el servicio (recomendado)

```typescript
import { EnvironmentService } from '@/core/services/environment.service';

export class MyComponent {
  private readonly env = inject(EnvironmentService);

  ngOnInit() {
    // Obtener configuración completa
    const config = this.env.config();

    // Obtener URL de la API
    const baseUrl = this.env.getApiBaseUrl();

    // Construir URLs con parámetros
    const url = this.env.buildApiUrl('/business/:id', { id: '123' });

    // Verificar flags
    if (this.env.isMockingEnabled()) {
      // Usar datos simulados
    }
  }
}
```

## Diferencias entre entornos

### Desarrollo (`environment.ts`)

- **API Base**: `http://localhost:3000/api/v1`
- **Mocking**: Habilitado (para desarrollo local)
- **Analytics**: Deshabilitado
- **Service Worker**: Deshabilitado
- **Logging**: Nivel `debug` con consola habilitada

### Producción (`environment.prod.ts`)

- **API Base**: `https://api.filoslot.com/v1`
- **Mocking**: Deshabilitado (usa API real)
- **Analytics**: Habilitado
- **Service Worker**: Habilitado
- **Logging**: Nivel `error` con consola deshabilitada

## Configuración en angular.json

El archivo `angular.json` está configurado para reemplazar automáticamente `environment.ts` por `environment.prod.ts` cuando se compila en modo producción:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

## Comandos

```bash
# Desarrollo (usa environment.ts)
npm start

# Producción (usa environment.prod.ts)
npm run build
```

## Variables de entorno en tiempo de compilación

Para configuraciones sensibles (como claves de API reales), considera usar variables de entorno del sistema en el build:

```bash
# Example
API_BASE_URL=https://api.production.com npm run build
```

Luego en `environment.prod.ts`:

```typescript
baseUrl: process.env['API_BASE_URL'] || 'https://api.filoslot.com/v1';
```

## Mejores prácticas

1. ✅ **Usa el `EnvironmentService`** para acceder a variables de entorno en lugar de importar directamente
2. ✅ **Type-safe**: La interfaz `IEnvironment` asegura que todas las variables estén tipadas
3. ✅ **Consistencia**: Mantén la misma estructura en ambos archivos (`environment.ts` y `environment.prod.ts`)
4. ✅ **Documentación**: Actualiza el README cuando agregues nuevas variables
5. ❌ **No commits de datos sensibles**: Usa variables de entorno del sistema para claves reales

## Cómo agregar nuevas variables

1. Actualiza `environment.interface.ts` con la nueva propiedad
2. Agrega el valor en `environment.ts` (desarrollo)
3. Agrega el valor en `environment.prod.ts` (producción)
4. Usa `EnvironmentService` para acceder a la nueva variable

Ejemplo:

```typescript
// environment.interface.ts
export interface IEnvironment {
  api: {
    baseUrl: string;
    // ... más líneas
    newService: {
      endpoint: string;
    };
  };
}

// environment.ts
api: {
  // ...
  newService: {
    endpoint: '/new-service';
  }
}

// environment.prod.ts
api: {
  // ...
  newService: {
    endpoint: '/new-service';
  }
}
```
