import { AppointmentStatus } from '../../../../models/appointment';
import { IResource } from '../../../../models/resource';

export const RESOURCE_MOCK: IResource[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    role: 'Barbero',
    appointments: [
      {
        id: 'a1',
        clientName: 'Carlos Gómez',
        resourceId: '1',
        serviceId: 's1',
        startTime: new Date(),
        endTime: new Date(),
        duration: 30,
        status: AppointmentStatus.pending,
      },
      {
        id: 'a2',
        clientName: 'María López',
        resourceId: '1',
        serviceId: 's2',
        startTime: new Date(),
        endTime: new Date(),
        duration: 45,
        status: AppointmentStatus.completed,
      },
    ],
  },
];
