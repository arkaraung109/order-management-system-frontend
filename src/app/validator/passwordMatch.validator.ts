import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(firstControlName: any, secondControlName: any): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    let firstControl = control.get(firstControlName)!;
    let secondControl = control.get(secondControlName)!;

    if (!secondControl.value) {
      secondControl.setErrors({ required: true, passwordNotMatch: false });
      return null;
    }

    if (firstControl.value != secondControl.value) {
      secondControl.setErrors({ passwordNotMatch: true });
    } else {
      secondControl.setErrors(null);
    }

    return null;
  }

}
