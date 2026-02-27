import { Component, input } from '@angular/core';

export interface IStats {
  total: number;
  completed: number;
  pending: number;
}

@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './app-stats-card.html',
})
export class AppStatsCard {
  stats = input.required<IStats>();
}
