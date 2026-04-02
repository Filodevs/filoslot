import { Component, input, output } from '@angular/core';

import { IResource } from '../../../../../models/resource';
import { IService } from '../../../../../models/service';
import { AvatarColorPipe } from '../../../../../shared/pipes/avatar-color.pipe';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-resource-card',
  imports: [InitialsPipe, AvatarColorPipe],
  templateUrl: './resource-card.html',
  styleUrl: './resource-card.css',
})
export class ResourceCard {
  resource = input.required<IResource>();
  services = input.required<IService[]>();

  editResourceEvent = output<IResource>();
  deleteResourceEvent = output<string>();
}
