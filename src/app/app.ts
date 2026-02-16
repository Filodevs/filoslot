import { Component, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { BookingContainer } from './features/booking/booking-container';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, BookingContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('filoslot');
}
