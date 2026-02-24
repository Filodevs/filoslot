import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { Availability } from './components/availability/availability';
import { BusinessInfo } from './components/business-info/business-info';
import { Resources } from './components/resources/resources';
import { Services } from './components/services/services';
import { SECTIONS } from './constants';
import { Section, SectionConfig } from './setup.d';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, BusinessInfo, Services, Resources, Availability],
  templateUrl: './setup.html',
  styleUrl: './setup.css',
})
export class Setup {
  readonly sections: SectionConfig[] = SECTIONS;

  activeSection = signal<Section | null>('info');
  completedSections = signal<Set<Section>>(new Set());

  allCompleted = computed(
    () => this.completedSections().size === this.sections.length,
  );

  setActive(key: Section): void {
    this.activeSection.set(this.activeSection() === key ? null : key);
  }

  isActive(key: Section): boolean {
    return this.activeSection() === key;
  }

  isCompleted(key: Section): boolean {
    return this.completedSections().has(key);
  }

  markCompleted(key: Section): void {
    this.completedSections.update((set) => new Set(set).add(key));
  }

  getStepClass(key: Section): string {
    if (this.isCompleted(key)) {
      return 'bg-indigo-500 border-indigo-500 text-white';
    }

    if (this.isActive(key)) {
      return 'bg-transparent border-indigo-500 text-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.2)]';
    }

    return 'bg-slate-900 border-white/10 text-white/45';
  }

  getLabelClass(key: Section): string {
    return this.isActive(key) ? 'text-indigo-400' : 'text-white/45';
  }

  getBadgeClass(key: Section): string {
    return this.isCompleted(key)
      ? 'bg-green-500/15 text-green-400'
      : 'bg-white/[0.06] text-white/45';
  }

  getCardClass(key: Section): string {
    return this.isActive(key)
      ? 'bg-slate-900/60 backdrop-blur-xl border-indigo-500/35'
      : 'bg-slate-900/60 backdrop-blur-xl border-white/7';
  }
}
