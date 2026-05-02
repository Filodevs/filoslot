import { Component, input } from '@angular/core';

import { IResource } from '../../../models/resource';
import { AvatarColorPipe } from '../../pipes/avatar-color.pipe';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-resources-list',
  imports: [InitialsPipe, AvatarColorPipe],
  templateUrl: './resources-list.html',
})
export class ResourcesList {
  resources = input.required<IResource[]>();
}
