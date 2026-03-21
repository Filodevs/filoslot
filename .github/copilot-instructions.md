# Filoslot: Angular Copilot Instructions

## Project Overview

**Filoslot** is a modern Angular 21 web application for business booking and appointment management. It features:

- **Role-based layouts**: PublicLayout (unauthenticated) and AdminLayout (protected by `authGuard`)
- **Three main features**: Public booking/directory, Admin dashboard/setup, Authentication
- **Standalone components** with lazy-loaded feature routes
- **Signal-based reactive state** using Angular 21's modern APIs
- **PrimeNG 21.1.1 UI** with Tailwind CSS 4 styling
- **Vitest** for unit testing

## Architecture Patterns

### Component Structure (Signals + Modern Inputs)

All components are **standalone** and use signal-based APIs:

```typescript
// Use input() for typed, reactive props (not @Input)
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  label = input<string>('');
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  disabled = input<boolean>(false);
  // Compute derived state with computed()
}
```

### Service & State Management

Services use **signals for state** and **Observables for async operations**:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<IUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = () => this._currentUser() !== null;

  // External async work returns Observable
  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    // ...
  }

  setSession(response: ILoginResponse): void {
    this._currentUser.set(response.user);
  }
}
```

### Form Pattern

Use **ReactiveFormsModule** with FormBuilder:

```typescript
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    this.authService
      .login(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          /* ... */
        },
      });
  }
}
```

### Routing & Guards

Functional route guards, lazy-loaded feature routes:

```typescript
// routes: guard is a function, routes are lazy-loaded
export const routes: Routes = [
  { path: 'admin', component: AdminLayout, canActivate: [authGuard], children: [...] },
];

// guard is a function, uses inject() for dependencies
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || router.navigate(['/auth/login']);
};
```

### Dialog Pattern

Custom `Dialog` service wraps PrimeNG, returns **Observable**:

```typescript
// In component:
this.dialog
  .open(MyDialogComponent, {
    data: {
      /* ... */
    },
  })
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((result) => {
    /* handle result */
  });
```

## Code Style & Conventions

| Rule                   | Example                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| **Component selector** | `app-button` (kebab-case with `app` prefix)                              |
| **Directive selector** | `appHighlight` (camelCase with `app` prefix)                             |
| **DI pattern**         | `private readonly svc = inject(MyService)` (never constructor injection) |
| **Import order**       | Angular → third-party → app code → styles (enforced by ESLint)           |
| **Line width**         | 100 characters (Prettier)                                                |
| **String quotes**      | Single quotes (Prettier)                                                 |

## Feature Structure

Each feature in `src/app/features/{feature}/` follows this pattern:

```
feature/
  feature.routes.ts       # Route configuration (exported as FEATURE_ROUTES)
  feature.ts              # Main component wrapping routes
  folder1/
    component.ts          # Standalone components with imports: [...]
    component.html        # Template
    component.css         # Scoped styles (Tailwind classes)
  folder2/
    ...
```

Key data flows:

1. **Public routes** → `PublicLayout` (header, footer)
2. **Admin routes** → `AdminLayout` (navbar, sidebar) + protected by `authGuard`
3. **Auth routes** → standalone (no layout)

## Development Workflows

```bash
npm start       # Dev server on localhost:4200
npm test        # Run Vitest tests (watch mode)
npm run build   # Production build to dist/
npm run lint    # ESLint check
ng generate component feature/comp-name  # Scaffold component
```

## Key Files & Patterns to Know

| File                                    | Purpose                                          |
| --------------------------------------- | ------------------------------------------------ |
| `src/app/app.routes.ts`                 | Root route config with layout nesting            |
| `src/app/core/services/auth.service.ts` | Auth state (signal-based) + login/logout         |
| `src/app/core/guards/auth.guard.ts`     | Route protection for admin area                  |
| `src/app/core/services/ui/dialog.ts`    | Generic dialog wrapper (Observable-based)        |
| `src/app/shared/components/`            | Reusable UI components (button, input, etc.)     |
| `src/app/models/`                       | TypeScript interfaces + `__mocks__/` for testing |

## Critical Practices

1. **Use `signal()` for component state** — not property mutations or subjects
2. **Use `input()` for component props** — not @Input decorator
3. **Use `inject()` for DI** — not constructor parameters
4. **Always call `.asReadonly()`** on private signals to expose public read-only versions
5. **Use `takeUntilDestroyed()`** with `destroyRef` to clean up subscriptions
6. **Lazy-load feature routes** — import routes dynamically in parent route
7. **Wrap PrimeNG components** in custom components for consistency (see `AppButton`, `Dialog`)
8. **Export routes as `{FEATURE}_ROUTES`** constant from each feature's `{feature}.routes.ts`

## Technology Stack

- **Angular**: 21.1.0 (standalone components, signals, inject())
- **TypeScript**: 5.9.2 (strict mode + strict templates)
- **Testing**: Vitest 4.x (not Jasmine)
- **Styling**: Tailwind CSS 4 + PrimeNG 21.1 + PrimeUI Aura theme
- **Forms**: @angular/forms (ReactiveFormsModule)
- **HTTP**: Plain fetch (no HttpClient) or RxJS Observable patterns
- **PWA**: Service Worker enabled (@angular/service-worker)

## Linting & Formatting

- **ESLint** enforces `simple-import-sort` for import grouping
- **Prettier** formats code (100 char width, single quotes)
- Run `npm run lint` to check compliance

---

**Ask for clarification on routing, signals, or async patterns if needed!**
