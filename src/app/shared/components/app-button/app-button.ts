import { Component, input } from '@angular/core';

import { ButtonModule } from 'primeng/button';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
  imports: [ButtonModule],
})
export class AppButton {
  label = input<string>('');
  type = input<'button' | 'submit'>('button');
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(true);
  loading = input<boolean>(false);
}
