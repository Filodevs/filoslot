import { Component, computed, input, output } from '@angular/core';

import { IResource } from '../../../../../models/resource';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-resource-card',
  imports: [InitialsPipe],
  templateUrl: './resource-card.html',
})
export class ResourceCard {
  private readonly COLORS = [
    'from-indigo-500 to-violet-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-pink-500',
    'from-emerald-500 to-cyan-500',
  ];

  resource = input.required<IResource>();
  selected = input<boolean>(false);

  avatarColor = computed(() => {
    const index = parseInt(this.resource().id.replace(/\D/g, '')) - 1;
    return this.COLORS[index % this.COLORS.length];
  });

  cardSelect = output<IResource>();

  onSelect(): void {
    this.cardSelect.emit(this.resource());
  }
}
