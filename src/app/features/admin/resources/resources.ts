import { Component, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

import { Notification } from '../../../core/services/ui/notification';

@Component({
  selector: 'app-resources',
  imports: [
    ButtonModule,
    InputMaskModule,
    InputNumberModule,
    ToggleSwitchModule,
    TooltipModule,
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.css',
})
export class Resources implements OnInit {
  private notificationService = inject(Notification);

  weekDays = signal([
    {
      name: 'Lunes',
      enabled: true,
      start: '09:00',
      end: '18:00',
      interval: 30,
    },
    {
      name: 'Martes',
      enabled: true,
      start: '09:00',
      end: '18:00',
      interval: 30,
    },
    {
      name: 'Miércoles',
      enabled: true,
      start: '09:00',
      end: '18:00',
      interval: 30,
    },
    {
      name: 'Jueves',
      enabled: true,
      start: '09:00',
      end: '18:00',
      interval: 30,
    },
    {
      name: 'Viernes',
      enabled: true,
      start: '09:00',
      end: '18:00',
      interval: 30,
    },
    {
      name: 'Sábado',
      enabled: false,
      start: '10:00',
      end: '14:00',
      interval: 60,
    },
    {
      name: 'Domingo',
      enabled: false,
      start: '00:00',
      end: '00:00',
      interval: 0,
    },
  ]);
  services = signal([
    { name: 'Servicio Estándar', price: 25, duration: 30 },
    { name: 'Servicio Premium', price: 50, duration: 60 },
  ]);
  loading = signal(false);

  ngOnInit(): void {
    // Aquí podrías cargar la configuración guardada del usuario desde un servicio
  }

  saveConfig(): void {
    console.log('Configuración guardada:', {
      weekDays: this.weekDays,
      services: this.services,
    });
  }
}
