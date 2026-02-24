import { Directive, HostBinding, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class BaseInput<T> {
  protected readonly DEFAULT_ERRORS: Record<string, string> = {
    required: 'Este campo es requerido',
    minlength: 'El valor es demasiado corto',
    maxlength: 'El valor es demasiado largo',
    pattern: 'El formato no es válido',
    email: 'Ingresa un correo electrónico válido',
    min: 'El valor es demasiado bajo',
    max: 'El valor es demasiado alto',
  };

  control = input<FormControl<T | null>>(new FormControl<T | null>(null));
  label = input<string>('');
  placeholder = input<string>('');
  errors = input<Record<string, string>>({});

  @HostBinding('class.invalid')
  get isInvalid(): boolean {
    return this.control().invalid && this.control().touched;
  }

  get activeError(): string {
    const ctrlErrors = this.control().errors;
    if (!ctrlErrors) return '';
    const merged = { ...this.DEFAULT_ERRORS, ...this.errors() };
    const key = Object.keys(ctrlErrors).find((k) => merged[k]);
    return key ? merged[key] : '';
  }
}
