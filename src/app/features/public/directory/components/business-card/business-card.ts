import { Component, input, output } from '@angular/core';

import { IBusinessCard } from '../../../../../models/businessCard';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-business-card',
  imports: [InitialsPipe],
  templateUrl: './business-card.html',
})
export class BusinessCard {
  business = input.required<IBusinessCard>();

  cardSelect = output<IBusinessCard>();

  onSelect(): void {
    this.cardSelect.emit(this.business());
  }
}
