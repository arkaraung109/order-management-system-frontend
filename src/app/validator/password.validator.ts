import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    let controlValue = control.value;
    let returnObj = {
      notContainUpperCase: false,
      notContainLowerCase: false,
      notContainDigit: false,
      notContainSpecialChar: false
    };

    if (controlValue) {
      let containsUpperCase = /[A-Z]+/.test(controlValue);
      let containsLowerCase = /[a-z]+/.test(controlValue);
      let containsDigit = /[0-9]+/.test(controlValue);
      let containsSpecialChar = /[`~^?(){}\[\]\|;,.'":<>?\/!@#$%&*\-_+=]+/.test(controlValue);

      if (containsUpperCase && containsLowerCase && containsDigit && containsSpecialChar) {
        return null;
      }

      returnObj = {
        notContainUpperCase: !containsUpperCase,
        notContainLowerCase: !containsLowerCase,
        notContainDigit: !containsDigit,
        notContainSpecialChar: !containsSpecialChar
      };
    }

    return returnObj;
  }

}
