import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { IBusinessData } from '../../models/businessData';

@Injectable({ providedIn: 'root' })
export class Business {
  getBusinessData(): Observable<IBusinessData> {
    return of({
      name: 'FiloSlot Barber',
      address: '123 Razor Street, Downtown',
      rating: 4.9,
      reviews: 120,
      services: [
        { name: 'Corte Premium', price: 25 },
        { name: 'Barba & Ritual', price: 15 },
        { name: 'Combo FiloSlot', price: 35 },
      ],
    }).pipe(delay(500));
  }
}
