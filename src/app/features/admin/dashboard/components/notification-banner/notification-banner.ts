import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, finalize, from, of } from 'rxjs';

import { PushNotificationService } from '../../../../../core/services/push-notification.service';
import { AppButton } from '../../../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-notification-banner',
  imports: [AppButton],
  templateUrl: './notification-banner.html',
})
export class NotificationBanner {
  private readonly pushNotification = inject(PushNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly permission = signal<NotificationPermission>(this._readPermission());
  readonly activating = signal(false);

  activate(): void {
    this.activating.set(true);

    from(Notification.requestPermission())
      .pipe(
        catchError(() => of(this._readPermission())),
        finalize(() => this.activating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((permission) => {
        this.permission.set(permission);
        if (permission === 'granted') {
          this.pushNotification.init().subscribe();
        }
      });
  }

  private _readPermission(): NotificationPermission {
    if (typeof Notification === 'undefined') return 'granted';
    return Notification.permission;
  }
}
