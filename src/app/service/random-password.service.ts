import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomPasswordService {

  constructor() { }

  generate(): string {
    let passwordLength = 10;
    let addUpper = true;
    let addNumbers = true;
    let addSymbols = true;

    var lowerChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var upperChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var symbols = ['!', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

    var noOfLowerChars = 0, noOfUpperChars = 0, noOfNumbers = 0, noOfSymbols = 0;
    var noOfneededTypes = 3;
    var noOfLowerChars = this.getRandomInt(1, passwordLength - noOfneededTypes);
    var usedTypeCounter = 1;

    if (addUpper) {
      noOfUpperChars = this.getRandomInt(1, passwordLength - noOfneededTypes + usedTypeCounter - noOfLowerChars);
      usedTypeCounter++;
    }

    if (addNumbers) {
      noOfNumbers = this.getRandomInt(1, passwordLength - noOfneededTypes + usedTypeCounter - noOfLowerChars - noOfUpperChars);
      usedTypeCounter++;
    }

    if (addSymbols) {
      noOfSymbols = passwordLength - noOfLowerChars - noOfUpperChars - noOfNumbers;
    }

    var passwordArray = [];

    for (var i = 0; i < noOfLowerChars; i++) {
      passwordArray.push(lowerChars[this.getRandomInt(1, lowerChars.length - 1)]);
    }

    for (var i = 0; i < noOfUpperChars; i++) {
      passwordArray.push(upperChars[this.getRandomInt(1, upperChars.length - 1)]);
    }

    for (var i = 0; i < noOfNumbers; i++) {
      passwordArray.push(numbers[this.getRandomInt(1, numbers.length - 1)]);
    }

    for (var i = 0; i < noOfSymbols; i++) {
      passwordArray.push(symbols[this.getRandomInt(1, symbols.length - 1)]);
    }

    passwordArray = this.shuffleArray(passwordArray);

    return passwordArray.join("");
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(array: any[]): any[] {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

}
