import { inject, Injectable, Type } from '@angular/core';

import {
  DialogService as PrimeDialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

export interface AppDialogConfig<D = unknown> extends DynamicDialogConfig {
  data?: D;
}

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  private readonly dialog = inject(PrimeDialogService);

  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config?: AppDialogConfig<D>,
  ): Observable<R | undefined> {
    const styleClass = ['app-dialog', config?.styleClass].filter(Boolean).join(' ');

    const ref: DynamicDialogRef<T> | null = this.dialog.open(component, {
      ...config,
      closable: true,
      dismissableMask: true,
      width: config?.width ?? '320px',
      styleClass,
    });

    return ref?.onClose as Observable<R | undefined>;
  }
}
