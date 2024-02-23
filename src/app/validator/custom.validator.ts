import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function customValidator(error: string): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      control.setErrors(null);
    } else {
      control.setErrors({ required: true, [error]: false });
    }

    return null;
  }

}
