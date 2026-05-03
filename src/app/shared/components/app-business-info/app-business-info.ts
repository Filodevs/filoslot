import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IBusiness } from '../../../models/business';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { AppSkeleton } from '../app-skeleton/app-skeleton';

@Component({
  selector: 'app-business-info',
  imports: [CommonModule, AppSkeleton, InitialsPipe],
  templateUrl: './app-business-info.html',
})
export class AppBusinessInfo {
  business = input.required<IBusiness | null>();
  bookingUrl = input.required<string>();
  loading = input<boolean>(false);
}
