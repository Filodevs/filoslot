import { Component, input } from '@angular/core';

import { ButtonModule } from 'primeng/button';

export type ButtonSeverity = 'primary' | 'secondary' | 'danger' | 'info';
export type ButtonVariant = 'text' | 'outlined';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
  imports: [ButtonModule],
})
export class AppButton {
  label = input<string>('');
  type = input<'button' | 'submit'>('button');
  severity = input<ButtonSeverity>('primary');
  variant = input<ButtonVariant>();
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(true);
  loading = input<boolean>(false);
}
