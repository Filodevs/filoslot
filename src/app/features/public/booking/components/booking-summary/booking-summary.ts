import { Component, input } from '@angular/core';

import { IResource } from '../../../../../models/resource';
import { IService } from '../../../../../models/service';
import { ISlot } from '../../../../../models/slot';

@Component({
  selector: 'app-booking-summary',
  imports: [],
  templateUrl: './booking-summary.html',
})
export class BookingSummary {
  service = input.required<IService>();
  resource = input.required<IResource>();
  slot = input.required<ISlot>();

  // formatTime(date: Date): string {
  //   return date.toLocaleTimeString('es', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: false,
  //   });
  // }
}
