import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function quantityValidator(limit: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    let controlValue = control.value;
    let isControlValueNumber = /^\d+$/.test(controlValue) && !isNaN(Number(controlValue));

    if (controlValue == '') {
      return null;
    }

    if (!isControlValueNumber) {
      return { quantityError: true };
    }

    if ((Number(controlValue) >= 1 && Number(controlValue) <= limit)) {
      return null;
    } else {
      return { quantityError: true };
    }
  }

}
