import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IService } from '../../../models/service';

@Component({
  selector: 'app-services-list',
  imports: [CommonModule],
  templateUrl: './services-list.html',
})
export class ServicesList {
  services = input.required<IService[]>();
}
