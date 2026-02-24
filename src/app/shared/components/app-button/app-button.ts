import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  label = input<string>('');
  type = input<'button' | 'submit'>('button');
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(true);

  get classes(): string {
    const base =
      'py-3.5 rounded-lg font-bold text-sm transition-all duration-150 min-h-11 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed';

    const width = this.fullWidth() ? 'w-full' : '';

    const variants: Record<ButtonVariant, string> = {
      primary: 'text-white bg-indigo-500 hover:bg-indigo-400',
      secondary:
        'text-white/60 border border-white/10 hover:border-white/20 hover:text-white',
      ghost:
        'text-indigo-400 border border-dashed border-indigo-500/35 hover:border-indigo-500/60 hover:bg-indigo-500/5',
    };

    return [base, width, variants[this.variant()]].join(' ');
  }
}
