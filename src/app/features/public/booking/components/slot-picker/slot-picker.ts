import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { IResource } from '../../../../../models/resource';
import { ISlot, SlotStatus } from '../../../../../models/slot';
import { AppSkeleton } from '../../../../../shared/components/app-skeleton/app-skeleton';

@Component({
  selector: 'app-slot-picker',
  imports: [CommonModule, AppSkeleton],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker {
  readonly SLOT_STATUS = SlotStatus;

  slots = input.required<ISlot[]>();
  resources = input.required<IResource[]>();
  loading = input<boolean>(false);

  changeSlot = output<ISlot>();

  selectSlot(slot: ISlot): void {
    if (slot.status !== this.SLOT_STATUS.available) return;

    this.changeSlot.emit(slot);
  }
}
