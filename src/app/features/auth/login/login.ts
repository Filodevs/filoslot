import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AppButton } from '../../../shared/components/app-button/app-button';
import { AppInput } from '../../../shared/components/app-input/app-input';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AppInput, AppButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  showPass = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);

    const { email, password } = this.form.value;

    this.authService
      .login({ email: email!, password: password! })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err: Error) => {
          this.errorMsg.set(err.message);
          this.isLoading.set(false);
        },
      });
  }

  togglePassword(): void {
    this.showPass.update((v) => !v);
  }

  navigateToDirectory(): void {
    this.router.navigate(['/directory']);
  }
}
