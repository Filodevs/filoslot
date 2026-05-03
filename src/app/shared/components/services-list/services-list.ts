import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IService } from '../../../models/service';
import { AppSkeleton } from '../app-skeleton/app-skeleton';

@Component({
  selector: 'app-services-list',
  imports: [CommonModule, AppSkeleton],
  templateUrl: './services-list.html',
})
export class ServicesList {
  services = input.required<IService[]>();
  loading = input<boolean>(false);
}
