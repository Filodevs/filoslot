import { Component, input } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton',
  imports: [SkeletonModule],
  templateUrl: './app-skeleton.html',
  styleUrl: './app-skeleton.css',
})
export class AppSkeleton {
  width = input<string>('100%');
  height = input<string>('1rem');
  shape = input<'rectangle' | 'circle'>('rectangle');
  radius = input<string>('12px');
  customClass = input<string>('');
}
