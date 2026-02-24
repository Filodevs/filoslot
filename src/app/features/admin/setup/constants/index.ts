import { SectionConfig } from '../setup.d';

export const SECTIONS: SectionConfig[] = [
  {
    key: 'info',
    label: 'Información del negocio',
    shortLabel: 'Info',
    icon: '🏪',
    iconBg: 'bg-indigo-500/15',
    subtitle: 'Nombre, dirección y contacto',
  },
  {
    key: 'services',
    label: 'Servicios',
    shortLabel: 'Servicios',
    icon: '✂️',
    iconBg: 'bg-cyan-400/10',
    subtitle: 'Catálogo y precios',
  },
  {
    key: 'resources',
    label: 'Recursos / Personal',
    shortLabel: 'Recursos',
    icon: '👤',
    iconBg: 'bg-violet-500/15',
    subtitle: 'Tu equipo de trabajo',
  },
  {
    key: 'availability',
    label: 'Semana Maestra',
    shortLabel: 'Horarios',
    icon: '📅',
    iconBg: 'bg-indigo-500/15',
    subtitle: 'Horarios por recurso',
  },
];
