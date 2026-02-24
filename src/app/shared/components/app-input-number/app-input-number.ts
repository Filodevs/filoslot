import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { InputNumberModule } from 'primeng/inputnumber';

import { BaseInput } from '../../directives/base-input';

@Component({
  selector: 'app-input-number',
  imports: [InputNumberModule, ReactiveFormsModule],
  templateUrl: './app-input-number.html',
  styleUrl: './app-input-number.css',
})
export class AppInputNumber extends BaseInput<number> {
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number>(1);
}
