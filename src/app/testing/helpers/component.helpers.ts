/**
 * Component testing helpers
 * Utilities for DOM queries, events, and component interaction
 */

import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Find element by test-id attribute
 * @example
 * const button = findByTestId(fixture, 'submit-button');
 */
export function findByTestId<T>(
  fixture: ComponentFixture<T>,
  testId: string,
): DebugElement | null {
  return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
}

/**
 * Find all elements by test-id attribute
 * @example
 * const buttons = findAllByTestId(fixture, 'list-item');
 */
export function findAllByTestId<T>(
  fixture: ComponentFixture<T>,
  testId: string,
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
}

/**
 * Find element by CSS selector
 * @example
 * const header = findByCss(fixture, '.header-title');
 */
export function findByCss<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement | null {
  return fixture.debugElement.query(By.css(selector));
}

/**
 * Find all elements by CSS selector
 * @example
 * const items = findAllByCss(fixture, '.list-item');
 */
export function findAllByCss<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

/**
 * Click an element (DebugElement or HTMLElement)
 * @example
 * const button = findByTestId(fixture, 'submit');
 * clickElement(button);
 */
export function clickElement(element: DebugElement | HTMLElement | null): void {
  if (!element) {
    throw new Error('Cannot click null element');
  }

  if (element instanceof DebugElement) {
    element.nativeElement.click();
  } else {
    element.click();
  }
}

/**
 * Set input value and trigger input event
 * @example
 * const input = findByTestId(fixture, 'email-input');
 * setInputValue(input, 'test@test.com');
 */
export function setInputValue(
  element: DebugElement | HTMLElement | null,
  value: string,
): void {
  if (!element) {
    throw new Error('Cannot set value on null element');
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  nativeElement.value = value;
  nativeElement.dispatchEvent(new Event('input'));
  nativeElement.dispatchEvent(new Event('change'));
}

/**
 * Get text content from element
 * @example
 * const title = getTextContent(findByTestId(fixture, 'title'));
 */
export function getTextContent(
  element: DebugElement | HTMLElement | null,
): string {
  if (!element) {
    return '';
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  return nativeElement.textContent?.trim() ?? '';
}

/**
 * Check if element has CSS class
 * @example
 * expect(hasClass(button, 'disabled')).toBe(true);
 */
export function hasClass(
  element: DebugElement | HTMLElement | null,
  className: string,
): boolean {
  if (!element) {
    return false;
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  return nativeElement.classList.contains(className);
}

/**
 * Get attribute value from element
 * @example
 * const ariaLabel = getAttribute(button, 'aria-label');
 */
export function getAttribute(
  element: DebugElement | HTMLElement | null,
  attributeName: string,
): string | null {
  if (!element) {
    return null;
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  return nativeElement.getAttribute(attributeName);
}

/**
 * Check if element is disabled
 * @example
 * expect(isDisabled(button)).toBe(true);
 */
export function isDisabled(
  element: DebugElement | HTMLElement | null,
): boolean {
  if (!element) {
    return false;
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  return (
    nativeElement.disabled === true || nativeElement.hasAttribute('disabled')
  );
}

/**
 * Trigger custom event on element
 * @example
 * triggerEvent(element, 'blur');
 */
export function triggerEvent(
  element: DebugElement | HTMLElement | null,
  eventName: string,
  eventData?: any,
): void {
  if (!element) {
    throw new Error('Cannot trigger event on null element');
  }

  const nativeElement =
    element instanceof DebugElement ? element.nativeElement : element;
  const event = new Event(eventName, { bubbles: true, cancelable: true });
  Object.assign(event, eventData);
  nativeElement.dispatchEvent(event);
}

/**
 * Wait for async operations and detect changes
 * @example
 * await flushAndDetectChanges(fixture);
 */
export async function flushAndDetectChanges<T>(
  fixture: ComponentFixture<T>,
): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

/**
 * Expect element to exist
 * @example
 * expectElementToExist(fixture, 'submit-button');
 */
export function expectElementToExist<T>(
  fixture: ComponentFixture<T>,
  testId: string,
): void {
  const element = findByTestId(fixture, testId);
  expect(element).not.toBeNull();
}

/**
 * Expect element to not exist
 * @example
 * expectElementToNotExist(fixture, 'error-message');
 */
export function expectElementToNotExist<T>(
  fixture: ComponentFixture<T>,
  testId: string,
): void {
  const element = findByTestId(fixture, testId);
  expect(element).toBeNull();
}
