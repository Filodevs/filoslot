import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { IResource } from '../../../../../models/resource';
import { RESOURCE_MOCK } from '../../__mocks__/resource';

@Injectable({ providedIn: 'root' })
export class Resource {
  getResources(): Observable<IResource[]> {
    return of(RESOURCE_MOCK).pipe(delay(500));
  }
}
