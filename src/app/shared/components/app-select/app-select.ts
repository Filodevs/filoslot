import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';

export interface SelectOption<T = string> {
  id: T;
  name: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, SelectModule, ReactiveFormsModule],
  templateUrl: './app-select.html',
})
export class AppSelect<T = string> {
  options = input<SelectOption<T>[]>([]);
  placeholder = input('Seleccionar...');
  control = input<FormControl<T | null>>(new FormControl<T | null>(null));
  label = input<string>('');

  selectionChange = output<T>();

  onSelectionChange(value: T): void {
    this.selectionChange.emit(value);
  }
}
