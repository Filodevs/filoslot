/**
 * Form testing helpers
 * Utilities for reactive forms validation and interaction
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

/**
 * Fill form with values
 * @example
 * fillForm(component.form, { email: 'test@test.com', password: '123456' });
 */
export function fillForm(form: FormGroup, values: Record<string, any>): void {
  Object.keys(values).forEach((key) => {
    const control = form.get(key);
    if (control) {
      control.setValue(values[key]);
      control.markAsTouched();
      control.markAsDirty();
    }
  });
}

/**
 * Expect form to be valid
 * @example
 * expectFormValid(component.form);
 */
export function expectFormValid(form: FormGroup | AbstractControl): void {
  expect(form.valid).toBe(true);
  expect(form.invalid).toBe(false);
}

/**
 * Expect form to be invalid
 * @example
 * expectFormInvalid(component.form);
 */
export function expectFormInvalid(form: FormGroup | AbstractControl): void {
  expect(form.invalid).toBe(true);
  expect(form.valid).toBe(false);
}

/**
 * Get validation errors for a form control
 * @example
 * const errors = getFormErrors(component.form, 'email');
 * expect(errors).toHaveProperty('required');
 */
export function getFormErrors(
  form: FormGroup,
  controlName: string,
): Record<string, any> | null {
  const control = form.get(controlName);
  return control ? control.errors : null;
}

/**
 * Expect control to have specific error
 * @example
 * expectControlToHaveError(component.form, 'email', 'required');
 */
export function expectControlToHaveError(
  form: FormGroup,
  controlName: string,
  errorKey: string,
): void {
  const control = form.get(controlName);
  expect(control).toBeTruthy();
  expect(control?.hasError(errorKey)).toBe(true);
}

/**
 * Expect control to be valid
 * @example
 * expectControlToBeValid(component.form, 'email');
 */
export function expectControlToBeValid(
  form: FormGroup,
  controlName: string,
): void {
  const control = form.get(controlName);
  expect(control).toBeTruthy();
  expect(control?.valid).toBe(true);
}

/**
 * Expect control to be invalid
 * @example
 * expectControlToBeInvalid(component.form, 'email');
 */
export function expectControlToBeInvalid(
  form: FormGroup,
  controlName: string,
): void {
  const control = form.get(controlName);
  expect(control).toBeTruthy();
  expect(control?.invalid).toBe(true);
}

/**
 * Mark all controls as touched (to trigger validation display)
 * @example
 * markAllAsTouched(component.form);
 */
export function markAllAsTouched(form: FormGroup): void {
  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    control?.markAsTouched();
    control?.markAsDirty();
  });
}

/**
 * Reset form to pristine state
 * @example
 * resetForm(component.form);
 */
export function resetForm(form: FormGroup, value?: any): void {
  form.reset(value);
  form.markAsUntouched();
  form.markAsPristine();
}

/**
 * Set control value and validate
 * @example
 * setControlValue(component.form, 'email', 'test@test.com');
 */
export function setControlValue(
  form: FormGroup,
  controlName: string,
  value: any,
): void {
  const control = form.get(controlName);
  if (control) {
    control.setValue(value);
    control.markAsTouched();
    control.updateValueAndValidity();
  }
}

/**
 * Get all form errors (including nested controls)
 * @example
 * const allErrors = getAllFormErrors(component.form);
 */
export function getAllFormErrors(form: FormGroup): Record<string, any> {
  const errors: Record<string, any> = {};

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    if (control instanceof FormGroup) {
      const nestedErrors = getAllFormErrors(control);
      if (Object.keys(nestedErrors).length > 0) {
        errors[key] = nestedErrors;
      }
    } else if (control?.errors) {
      errors[key] = control.errors;
    }
  });

  return errors;
}

/**
 * Expect form to have specific values
 * @example
 * expectFormValues(component.form, { email: 'test@test.com', password: '123456' });
 */
export function expectFormValues(
  form: FormGroup,
  expectedValues: Record<string, any>,
): void {
  Object.keys(expectedValues).forEach((key) => {
    const control = form.get(key);
    expect(control?.value).toEqual(expectedValues[key]);
  });
}

/**
 * Create a mock FormControl
 * @example
 * const mockControl = createMockFormControl('initial value', true);
 */
export function createMockFormControl(
  value: any = '',
  valid = true,
): FormControl {
  const control = new FormControl(value);
  if (!valid) {
    control.setErrors({ invalid: true });
  }
  return control;
}
