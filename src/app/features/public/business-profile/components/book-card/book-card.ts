import { Component, output } from '@angular/core';

import { AppButton } from '../../../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-book-card',
  imports: [AppButton],
  templateUrl: './book-card.html',
})
export class BookCard {
  goToBooking = output<void>();
}
