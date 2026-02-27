import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { BUSINESS_MOCK } from '../../models/__mocks__/business.mock';
import { IBusinessCard } from '../../models/businessCard';

@Injectable({ providedIn: 'root' })
export class DirectoryService {
  getBusinesses(): Observable<IBusinessCard[]> {
    return of(BUSINESS_MOCK).pipe(delay(600));
  }
}
