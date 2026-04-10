import { inject, Injectable } from '@angular/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly env = inject(EnvironmentService);

  private readonly _client: SupabaseClient;

  constructor() {
    const { url, anonKey } = this.env.config().supabase;
    this._client = createClient(url, anonKey);
  }

  listenToBroadcast<T extends Record<string, unknown>>(
    channelName: string,
    event: string,
  ): Observable<T> {
    return new Observable<T>((subscriber) => {
      const channel = this._client
        .channel(channelName)
        .on<T>('broadcast', { event }, (payload) => {
          subscriber.next(payload.payload);
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    });
  }
}
