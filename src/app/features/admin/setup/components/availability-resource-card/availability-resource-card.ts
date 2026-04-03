import { Component, input, output } from '@angular/core';

import { IResource } from '../../../../../models/resource';

@Component({
  selector: 'app-availability-resource-card',
  imports: [],
  templateUrl: './availability-resource-card.html',
  styleUrl: './availability-resource-card.css',
})
export class AvailabilityResourceCard {
  resource = input.required<IResource>();
  isSaved = input.required<boolean>();

  resourceSelectedEvent = output<IResource>();
}
