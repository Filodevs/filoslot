import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

import { EnvironmentService } from './environment.service';

interface VapidKeyResponse {
  data: { vapidPublicKey: string };
}

interface PushSubscriptionPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(
    [...rawData].map((c) => c.charCodeAt(0)),
  ) as Uint8Array<ArrayBuffer>;
}

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  init(): Observable<void> {
    if (!this._isSupported()) return of(void 0);

    return this._fetchVapidKey().pipe(
      switchMap((vapidKey) => from(this._requestAndSubscribe(vapidKey))),
      switchMap((subscription) => this._registerSubscription(subscription)),
      map(() => void 0),
      catchError(() => of(void 0)),
    );
  }

  unsubscribe(token: string | null): Observable<void> {
    if (!this._isSupported()) return of(void 0);

    return from(navigator.serviceWorker.ready).pipe(
      switchMap((registration) =>
        from(registration.pushManager.getSubscription()),
      ),
      switchMap((subscription) => {
        if (!subscription) return of(void 0);

        const url = this.env.buildApiUrl(
          this.env.config().api.pushSubscriptions.unsubscribe,
        );
        const headers = token
          ? new HttpHeaders({ Authorization: `Bearer ${token}` })
          : undefined;

        return this.http
          .delete<void>(url, {
            body: { endpoint: subscription.endpoint },
            headers,
          })
          .pipe(
            switchMap(() => from(subscription.unsubscribe())),
            map(() => void 0),
            catchError(() =>
              from(subscription.unsubscribe()).pipe(map(() => void 0)),
            ),
          );
      }),
      catchError(() => of(void 0)),
    );
  }

  private _fetchVapidKey(): Observable<string> {
    const url = this.env.buildApiUrl(
      this.env.config().api.pushSubscriptions.vapidPublicKey,
    );
    return this.http
      .get<VapidKeyResponse>(url)
      .pipe(map((res) => res.data.vapidPublicKey));
  }

  private async _requestAndSubscribe(
    vapidKey: string,
  ): Promise<PushSubscription> {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  private _registerSubscription(
    subscription: PushSubscription,
  ): Observable<void> {
    const sub = subscription.toJSON();
    const url = this.env.buildApiUrl(
      this.env.config().api.pushSubscriptions.subscribe,
    );

    const payload: PushSubscriptionPayload = {
      endpoint: sub.endpoint ?? '',
      p256dh: sub.keys?.['p256dh'] ?? '',
      auth: sub.keys?.['auth'] ?? '',
    };

    return this.http.post<void>(url, payload);
  }

  private _isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }
}
