/**
 * Observable testing helpers
 * Utilities for creating mock observables and testing async operations
 */

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Create a mock observable that emits success value
 * @example
 * const mockLogin = mockSuccess({ user: mockUser, token: 'abc' });
 */
export function mockSuccess<T>(data: T, delayMs = 0): Observable<T> {
  return delayMs > 0 ? of(data).pipe(delay(delayMs)) : of(data);
}

/**
 * Create a mock observable that emits error
 * @example
 * const mockLogin = mockError(new Error('Login failed'));
 */
export function mockError<T>(error: any, delayMs = 0): Observable<T> {
  const errorObs = throwError(() => error);
  return delayMs > 0 ? errorObs.pipe(delay(delayMs)) : errorObs;
}

/**
 * Create a mock observable that emits multiple values
 * @example
 * const mock$ = mockSequence([1, 2, 3], 100);
 */
export function mockSequence<T>(values: T[], delayMs = 0): Observable<T> {
  return new Observable((subscriber) => {
    let index = 0;

    const emitNext = () => {
      if (index < values.length) {
        subscriber.next(values[index]);
        index++;
        if (delayMs > 0) {
          setTimeout(emitNext, delayMs);
        } else {
          emitNext();
        }
      } else {
        subscriber.complete();
      }
    };

    emitNext();
  });
}

/**
 * Wait for observable to complete and return all emitted values
 * @example
 * const values = await observableToArray(myObservable$);
 */
export function observableToArray<T>(obs$: Observable<T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const values: T[] = [];
    obs$.subscribe({
      next: (value) => values.push(value),
      error: (err) => reject(err),
      complete: () => resolve(values),
    });
  });
}

/**
 * Wait for observable to emit first value
 * @example
 * const firstValue = await firstValueFrom(myObservable$);
 */
export function firstValueFrom<T>(obs$: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = obs$.subscribe({
      next: (value) => {
        resolve(value);
        subscription.unsubscribe();
      },
      error: (err) => reject(err),
    });
  });
}

/**
 * Expect observable to emit specific value
 * @example
 * await expectObservableToEmit(service.getData(), expectedData);
 */
export async function expectObservableToEmit<T>(
  obs$: Observable<T>,
  expectedValue: T,
): Promise<void> {
  const value = await firstValueFrom(obs$);
  expect(value).toEqual(expectedValue);
}

/**
 * Expect observable to throw error
 * @example
 * await expectObservableToThrow(service.getData(), 'Network error');
 */
export async function expectObservableToThrow(
  obs$: Observable<any>,
  expectedError?: string | RegExp,
): Promise<void> {
  try {
    await firstValueFrom(obs$);
    throw new Error(
      'Expected observable to throw, but it completed successfully',
    );
  } catch (error: any) {
    if (expectedError) {
      if (typeof expectedError === 'string') {
        expect(error.message).toContain(expectedError);
      } else {
        expect(error.message).toMatch(expectedError);
      }
    }
  }
}

/**
 * Expect observable to complete without errors
 * @example
 * await expectObservableToComplete(service.updateData());
 */
export async function expectObservableToComplete<T>(
  obs$: Observable<T>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    obs$.subscribe({
      error: (err) => reject(err),
      complete: () => resolve(),
    });
  });
}

/**
 * Create a spy that returns an observable
 * @example
 * const spy = spyWithObservable(mockData);
 * service.getData = spy;
 */
export function spyWithObservable<T>(value: T, delayMs = 0): any {
  return vi.fn().mockReturnValue(mockSuccess(value, delayMs));
}

/**
 * Create a spy that returns an error observable
 * @example
 * const spy = spyWithError(new Error('Failed'));
 * service.getData = spy;
 */
export function spyWithError(error: any, delayMs = 0): any {
  return vi.fn().mockReturnValue(mockError(error, delayMs));
}
