import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

import { BaseInput } from '../../directives/base-input';

@Component({
  selector: 'app-input',
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './app-input.html',
  styleUrl: './app-input.css',
})
export class AppInput extends BaseInput<string> {
  type = input<string>('text');
}
