import { Component, input, output } from '@angular/core';

import { IBusiness } from '../../../../../models/business';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-business-card',
  imports: [InitialsPipe],
  templateUrl: './business-card.html',
})
export class BusinessCard {
  business = input.required<IBusiness>();

  cardSelect = output<IBusiness>();

  onSelect(): void {
    this.cardSelect.emit(this.business());
  }
}
