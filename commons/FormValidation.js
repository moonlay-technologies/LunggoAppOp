import Regex from '../constants/Regex';

export function validateUserName(userNameString) {
  let errorEmail = validateEmail(userNameString);
  let errorPhone = validatePhone(userNameString);
  // if (errorEmail != null) return errorEmail;
  // if (errorPhone != null) return errorPhone;
  // return null;

  if (errorEmail == 'Wajib diisi' && errorPhone == 'Wajib diisi') return 'Wajib diisi';
  if (!errorEmail || !errorPhone) return null;
  return 'Email atau nomor telepon belum benar';

}

export function validateEmail(emailString) {
  if (!emailString) return 'Wajib diisi';
  if (!Regex.email.test(emailString)) return 'Email belum benar';
  return null;
}

export function validatePassword(passwordString) {
  if (!passwordString) return 'Wajib diisi'
  if (passwordString.length < 6) return 'Password minimal 6 karakter';
  return null;
}

export function validateRequiredField(inputString) {
  if (!inputString) return 'Wajib diisi'
  return null;
}

export function validatePhone(phoneNumber) {
  if (!phoneNumber) return 'Wajib diisi';
  if (isNaN(phoneNumber) || !phoneNumber || (phoneNumber + '').length <= 8) return 'Nomor telepon belum benar';
  return null;
}

// //// phone number validation with 10 or more digits
// export var validatePhone = testInput => /^\d{9,}$/.test(testInput);

//// phone number validation starts with 0 | +62 followed by another 9 or more numbers
export var validatePhone_Indonesia = testInput => /^(0|[+]?62)\d{9,}$/.test(testInput);

//// validasi no KTP: length == 16
export var validateKTP = testInput => /^\d{16}$/.test(testInput);

//// passport no consist of 6 to 9 alphanumeric and/or underscore
export var validatePassportNo = testInput => /^\w{6,9}$/.test(testInput);

//// validate no NPWP
export var validateNpwp = testInput => /^\d{15}$/.test(testInput);

//// postal code consist of 5 digit of numbers
export var validatePostalCode = testInput => /^\d{5}$/.test(testInput);

//// Credit Card Number format
export var validateCreditCardFormat = testInput => /^\d{13,19}$/.test(testInput);

//// CVV number consist of 3 to 4 digit of numbers
export var validateCvvFormat = testInput => /^\d{3,4}$/.test(testInput);

//// validate credit card's expiry date
export var validateExpiryDate = (month, year) => {
  if (month < 1 || month > 12 || !year || isNaN(month) || isNaN(year)) {
    return { error: 'INVALID_INPUT' };
  }
  let now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1; //// by default, 0=January, so we change this with +1
  year += 2000;
  if (year < currentYear || (year == currentYear && month < currentMonth)) {
    return { error: 'CARD_EXPIRED' };
  }
  return true;
}
