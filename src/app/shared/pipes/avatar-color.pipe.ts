import { inject, Pipe, PipeTransform } from '@angular/core';

import { AvatarColorService } from '../services/avatar-color.service';

@Pipe({ name: 'avatarColor' })
export class AvatarColorPipe implements PipeTransform {
  private readonly avatarColorService = inject(AvatarColorService);

  transform(id: string): string {
    return this.avatarColorService.getColor(id);
  }
}
