/**
 * Signal testing helpers
 * Utilities for testing Angular signals and computed values
 */

import {
  computed,
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Create a writable signal for testing
 * @example
 * const count = createTestSignal(0);
 */
export function createTestSignal<T>(initialValue: T): WritableSignal<T> {
  return signal(initialValue);
}

/**
 * Create a computed signal for testing
 * @example
 * const doubled = createTestComputed(() => count() * 2);
 */
export function createTestComputed<T>(computation: () => T): Signal<T> {
  return computed(computation);
}

/**
 * Expect signal to have specific value
 * @example
 * expectSignalValue(component.count, 5);
 */
export function expectSignalValue<T>(sig: Signal<T>, expectedValue: T): void {
  expect(sig()).toEqual(expectedValue);
}

/**
 * Expect computed signal to update when dependency changes
 * @example
 * expectComputedToUpdate(count, doubled, 5, 10);
 */
export function expectComputedToUpdate<T, U>(
  source: WritableSignal<T>,
  computed: Signal<U>,
  sourceValue: T,
  expectedComputedValue: U,
): void {
  source.set(sourceValue);
  expect(computed()).toEqual(expectedComputedValue);
}

/**
 * Test signal updates multiple times
 * @example
 * testSignalUpdates(component.count, [1, 2, 3]);
 */
export function testSignalUpdates<T>(
  sig: WritableSignal<T>,
  values: T[],
): void {
  values.forEach((value) => {
    sig.set(value);
    expect(sig()).toEqual(value);
  });
}

/**
 * Wait for signal effect to complete
 * @example
 * await waitForEffect(() => {
 *   effect(() => console.log(mySignal()));
 * });
 */
export async function waitForEffect(effectFn: () => void): Promise<void> {
  return new Promise((resolve) => {
    TestBed.runInInjectionContext(() => {
      effectFn();
      setTimeout(resolve, 0);
    });
  });
}

/**
 * Track signal value changes
 * @example
 * const tracker = trackSignalChanges(component.count);
 * component.count.set(5);
 * expect(tracker.changes).toEqual([0, 5]);
 */
export function trackSignalChanges<T>(sig: Signal<T>): {
  changes: T[];
  stop: () => void;
} {
  const changes: T[] = [sig()]; // Initial value
  let stopped = false;

  const effectRef = TestBed.runInInjectionContext(() => {
    return effect(() => {
      if (!stopped) {
        changes.push(sig());
      }
    });
  });

  return {
    changes,
    stop: () => {
      stopped = true;
      effectRef.destroy();
    },
  };
}

/**
 * Create a readonly signal mock
 * @example
 * const mockUser = createReadonlySignalMock(userMock);
 */
export function createReadonlySignalMock<T>(value: T): Signal<T> {
  return signal(value).asReadonly();
}

/**
 * Expect signal to be readonly
 * @example
 * expectSignalToBeReadonly(service.currentUser);
 */
export function expectSignalToBeReadonly<T>(sig: Signal<T>): void {
  // TypeScript will catch if signal is writable, this is a runtime check
  expect((sig as any).set).toBeUndefined();
  expect((sig as any).update).toBeUndefined();
}

/**
 * Test signal with update function
 * @example
 * testSignalUpdate(count, (prev) => prev + 1, 0, 1);
 */
export function testSignalUpdate<T>(
  sig: WritableSignal<T>,
  updateFn: (value: T) => T,
  initialValue: T,
  expectedValue: T,
): void {
  sig.set(initialValue);
  sig.update(updateFn);
  expect(sig()).toEqual(expectedValue);
}

/**
 * Create multiple test signals
 * @example
 * const [name, age, email] = createTestSignals(['John', 30, 'john@example.com']);
 */
export function createTestSignals<T extends any[]>(
  ...initialValues: T
): {
  [K in keyof T]: WritableSignal<T[K]>;
} {
  return initialValues.map((value) => signal(value)) as any;
}

/**
 * Expect computed to be derived correctly
 * @example
 * expectComputedToBeDerived(firstName, lastName, fullName, 'John', 'Doe', 'John Doe');
 */
export function expectComputedToBeDerived<T1, T2, R>(
  source1: WritableSignal<T1>,
  source2: WritableSignal<T2>,
  computed: Signal<R>,
  value1: T1,
  value2: T2,
  expectedResult: R,
): void {
  source1.set(value1);
  source2.set(value2);
  expect(computed()).toEqual(expectedResult);
}

/**
 * Reset signal to initial value
 * @example
 * const count = createTestSignal(0);
 * count.set(5);
 * resetSignal(count, 0);
 */
export function resetSignal<T>(sig: WritableSignal<T>, initialValue: T): void {
  sig.set(initialValue);
}
