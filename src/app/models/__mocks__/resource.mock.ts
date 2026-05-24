import { AppointmentStatus } from '../appointment';
import { IResource } from '../resource';

export const RESOURCE_MOCK: IResource[] = [
  {
    id: 'r1',
    name: 'Jorge Beltrán',
    role: 'Barbero Senior',
    appointments: [
      {
        id: 'a1',
        clientName: 'Juan Pérez',
        clientPhone: '',
        date: '2024-06-01',
        startTime: '10:00',
        endTime: '10:30',
        duration: 30,
        resourceId: 'r1',
        serviceId: 's1',
        status: AppointmentStatus.pending,
      },
      {
        id: 'a2',
        clientName: 'María Gómez',
        clientPhone: '',
        date: '2024-06-01',
        startTime: '11:00',
        endTime: '11:45',
        duration: 45,
        resourceId: 'r1',
        serviceId: 's2',
        status: AppointmentStatus.completed,
      },
    ],
  },
  { id: 'r2', name: 'Carlos M.', role: 'Estilista', appointments: [] },
  {
    id: 'r3',
    name: 'Andrés P.',
    role: 'Barbero Junior',
    appointments: [
      {
        id: 'a3',
        clientName: 'Lucía Fernández',
        clientPhone: '',
        date: '2024-06-01',
        startTime: '12:00',
        endTime: '13:00',
        duration: 60,
        resourceId: 'r3',
        serviceId: 's3',
        status: AppointmentStatus.canceled,
      },
      {
        id: 'a4',
        clientName: 'Miguel Torres',
        clientPhone: '',
        date: '2024-06-01',
        startTime: '14:00',
        endTime: '14:30',
        duration: 30,
        resourceId: 'r3',
        serviceId: 's1',
        status: AppointmentStatus.pending,
      },
    ],
  },
];
