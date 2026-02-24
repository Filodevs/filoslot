export type Section = 'info' | 'services' | 'resources' | 'availability';

export interface SectionConfig {
  key: Section;
  label: string;
  shortLabel: string;
  icon: string;
  iconBg: string;
  subtitle: string;
}
