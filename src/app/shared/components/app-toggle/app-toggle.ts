import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-toggle',
  imports: [FormsModule, ToggleSwitchModule],
  templateUrl: './app-toggle.html',
  styleUrl: './app-toggle.css',
})
export class AppToggle {
  checked = input<boolean>(false);
  changed = output<boolean>();
}
