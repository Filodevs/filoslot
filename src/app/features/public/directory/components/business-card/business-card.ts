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

  getRatingStars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  isStarFilled(index: number): boolean {
    return index < Math.round(this.business().rating);
  }

  onSelect(): void {
    this.cardSelect.emit(this.business());
  }
}
