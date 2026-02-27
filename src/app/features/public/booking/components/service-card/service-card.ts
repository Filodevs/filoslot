import { Component, input, output } from '@angular/core';

import { IService } from '../../../../../models/service';

@Component({
  selector: 'app-service-card',
  imports: [],
  templateUrl: './service-card.html',
})
export class ServiceCard {
  service = input.required<IService>();
  selected = input<boolean>(false);

  cardSelect = output<IService>();

  onSelect(): void {
    this.cardSelect.emit(this.service());
  }
}
