import { IBusinessCard } from '../businessCard';

export const BUSINESS_MOCK: IBusinessCard[] = [
  {
    id: '1',
    slug: 'filoslot-barber',
    name: 'FiloSlot Barber',
    address: '123 Razor Street, Downtown',
    phone: '',
    services: ['Corte Premium', 'Barba & Ritual', 'Combo FiloSlot'],
  },
  {
    id: '2',
    slug: 'estudio-corte-fino',
    name: 'Estudio Corte Fino',
    address: 'Av. Principal 45, Centro',
    phone: '',
    services: ['Corte Clásico', 'Degradado', 'Afeitado'],
  },
  {
    id: '3',
    slug: 'barber-kings',
    name: 'Barber Kings',
    address: 'Calle 80 #12-34, Norte',
    phone: '',
    services: ['Corte + Barba', 'Diseño de cejas'],
  },
];
