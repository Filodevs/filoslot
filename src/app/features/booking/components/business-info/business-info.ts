import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IBusinessData } from '../../../../models/businessData';

@Component({
  selector: 'app-business-info',
  imports: [CommonModule],
  templateUrl: './business-info.html',
})
export class BusinessInfo {
  businessData = input.required<IBusinessData>();
}
