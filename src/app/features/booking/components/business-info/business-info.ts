import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IBusinessData } from '../../../../models/businessData';
import { AppSkeleton } from '../../../../shared/components/app-skeleton/app-skeleton';

@Component({
  selector: 'app-business-info',
  imports: [CommonModule, AppSkeleton],
  templateUrl: './business-info.html',
})
export class BusinessInfo {
  businessData = input<IBusinessData | null>(null);
  loading = input<boolean>(false);
}
