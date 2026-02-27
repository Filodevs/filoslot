import { IBusinessCard } from '../businessCard';

export const BUSINESS_MOCK: IBusinessCard[] = [
  {
    id: '1',
    slug: 'filoslot-barber',
    name: 'FiloSlot Barber',
    address: '123 Razor Street, Downtown',
    rating: 4.9,
    reviewCount: 120,
    photo: '',
    featuredServices: ['Corte Premium', 'Barba & Ritual', 'Combo FiloSlot'],
  },
  {
    id: '2',
    slug: 'estudio-corte-fino',
    name: 'Estudio Corte Fino',
    address: 'Av. Principal 45, Centro',
    rating: 4.7,
    reviewCount: 85,
    photo: '',
    featuredServices: ['Corte Clásico', 'Degradado', 'Afeitado'],
  },
  {
    id: '3',
    slug: 'barber-kings',
    name: 'Barber Kings',
    address: 'Calle 80 #12-34, Norte',
    rating: 4.5,
    reviewCount: 60,
    photo: '',
    featuredServices: ['Corte + Barba', 'Diseño de cejas'],
  },
];
