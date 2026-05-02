import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IResource } from '../../../models/resource';
import { AvatarColorPipe } from '../../pipes/avatar-color.pipe';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { AppSkeleton } from '../app-skeleton/app-skeleton';

@Component({
  selector: 'app-resources-list',
  imports: [CommonModule, InitialsPipe, AvatarColorPipe, AppSkeleton],
  templateUrl: './resources-list.html',
})
export class ResourcesList {
  resources = input.required<IResource[]>();
  loading = input<boolean>(false);
}
