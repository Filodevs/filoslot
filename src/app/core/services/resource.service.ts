import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { RESOURCE_MOCK } from '../../models/__mocks__/resource.mock';
import { IResource } from '../../models/resource';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  getResources(): Observable<IResource[]> {
    return of(RESOURCE_MOCK).pipe(delay(500));
  }
}
