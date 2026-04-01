import { inject, Injectable } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialog {
  private confirmationService = inject(ConfirmationService);

  confirm(message: string, header = 'Confirmar'): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        icon: 'pi pi-info-circle',
        header,
        message,
        rejectButtonProps: {
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          severity: 'danger',
        },
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
}
