import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
// export const numberToFraction = function (amount) {
//   // This is a whole number and doesn't need modification.
//   if (parseFloat(amount) === parseInt(amount)) {
//     return amount;
//   }
//   // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
//   const gcd = function (a, b) {
//     if (b < 0.0000001) {
//       return a;
//     }
//     return gcd(b, Math.floor(a % b));
//   };
//   const len = amount.toString().length - 2;
//   let denominator = Math.pow(10, len);
//   let numerator = amount * denominator;
//   var divisor = gcd(numerator, denominator);
//   numerator /= divisor;
//   denominator /= divisor;
//   let base = 0;
//   // In a scenario like 3/2, convert to 1 1/2
//   // by pulling out the base number and reducing the numerator.
//   if (numerator > denominator) {
//     base = Math.floor(numerator / denominator);
//     numerator -= base * denominator;
//   }
//   amount = Math.floor(numerator) + '/' + Math.floor(denominator);
//   if (base) {
//     amount = base + ' ' + amount;
//   }
//   return amount;
// };

export default class Fractional {
  #floating;
  #floatingLength;
  #multiply;
  #gcd;
  #numerator;
  #denominator;
  #semplifyFraction;
  result;

  constructor(number) {
    this.number = number;
    this.result = this.#main(this.number);
    //`${this.result.#numerator}/${this.result.#denominator}`;
  }

  #main(number) {
    this.#isFloat(number)
      ? (this.#floating = number.toString().split('.')[1])
      : '';

    if (this.#floating) {
      this.#floatingLength = this.#floating.length;
      this.#multiply = 10 ** this.#floatingLength;
    } else return number;

    this.#gcd = this.#gcd_two_numbers(this.#multiply, number * this.#multiply);

    if (this.#gcd === 1) {
      this.#numerator = number * this.#multiply;
      this.#denominator = this.#multiply;
    } else {
      this.#numerator = (number * this.#multiply) / this.#gcd;
      this.#denominator = this.#multiply / this.#gcd;
    }

    return (this.#semplifyFraction = this.#semplifiedFraction(
      this.#numerator,
      this.#denominator
    ));
  }

  #semplifiedFraction(numerator, denominator) {
    const rest = numerator % denominator;
    if (rest === 0) return numerator / denominator;
    numerator = rest;
    return {
      numerator,
      denominator,
    };
  }

  #gcd_two_numbers(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  #isFloat(n) {
    const isFloat = Number(n) === n && n % 1 !== 0;
    return isFloat;
  }
}

Fractional.prototype.toString = function string() {
  const returnData =
    typeof this.result === 'object'
      ? `${this.result.numerator}/${this.result.denominator}`
      : `${this.result}`;
  return returnData;
};

const test = new Fractional(5.23);
console.log(test.toString());
