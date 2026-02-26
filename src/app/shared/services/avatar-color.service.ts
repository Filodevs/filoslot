import { Injectable } from '@angular/core';

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-pink-500',
  'from-emerald-500 to-cyan-500',
  'from-orange-500 to-pink-500',
];

@Injectable({ providedIn: 'root' })
export class AvatarColorService {
  private readonly colorMap = new Map<string, string>();

  getColor(id: string): string {
    if (!this.colorMap.has(id)) {
      const color =
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      this.colorMap.set(id, color);
    }
    return this.colorMap.get(id)!;
  }

  removeColor(id: string): void {
    this.colorMap.delete(id);
  }
}
