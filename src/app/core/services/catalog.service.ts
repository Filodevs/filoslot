import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { CATALOG_MOCK } from '../../models/__mocks__/catalog.mock';
import { IService } from '../../models/service';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  getServices(): Observable<IService[]> {
    return of(CATALOG_MOCK).pipe(delay(500));
  }
}
