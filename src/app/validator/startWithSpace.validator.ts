import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const startWithSpaceValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const regexp = /^[^\s].*$/;
    if (control.value == '') {
      return null;
    }

    if (regexp.test(control.value)) {
      return null;
    } else {
      return { startWithSpace: true };
    }
  };
};
