import Moment from 'moment';
import 'moment/locale/id';

export var dateFullShort = date =>
  Moment(date).format('ddd, D MMM YYYY');

export var dateFullLong = date =>
  Moment(date).format('dddd, D MMM YYYY');

export var date = date =>
  Moment(date).format('D MMM YYYY');

export var dateLong = date =>
  Moment(date).format('D MMMM YYYY');

export var timeFromNow = timeLimit => Moment(timeLimit).fromNow();

//// Format number to "1.000.000"
export var number = int => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

//// Format price to "Rp 1.000.000"
export var rupiah = int => {
  const numStr = number(int);
  if (numStr.substr(0,1)=='-') return '–Rp ' + numStr.substr(1);
  else return 'Rp ' + numStr;
}

export var price = rupiah; //// use rupiah as default price

// export var dollar = int => '$' + int;

//// format no handphone without prefix    0 | +
export var phoneWithoutPrefix = phone => {
  // TODO: validate if phone input is a valid phone number
  return (phone + '').replace(/^(0|[+])/, '');
}

//// format no handphone without Indonesia code   0 | +62
export var phoneWithoutCountryCode_Indonesia = phone => {
  // TODO: validate if phone input is a valid phone number
  return (phone + '').replace(/^(0|[+]?62)/, '');
}

//// format no handphone to have 0
export var reversePhoneWithoutCountryCode_Indonesia = phone => {
  // TODO: validate if phone input is a valid phone number
  return phone && !phone.startsWith('0') ? '0' + phone : phone;
}




//// format no handphone separator '0812-3456-789'
// export var phoneWithSeparator = (phone, separator='-') => {
//   // TODO: validate if phone input is a valid phone number
//   let regex = /\B(?<=^(0|[+]?62))(?=(\d{3})+(?!\d))/
//   return (phone + '').replace(regex,separator);
// }

//// 24h-time formatter
export var time24h = (time, separator = ':', showSecond = false) => {
  let seconds = showSecond ? separator + time.getSeconds() : '';
  return time.getHours() + separator + time.getMinutes() + seconds;
}

const kosaKataAngka = ['nol', 'satu', 'dua', 'tiga', 'empat',
  'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
const kosaKataUkuran = ['', 'puluh', 'ratus', 'ribu', 'juta',
  'miliar', 'triliun'];

//// format 'terbilang' (uang)
//// format 1.570.000 or 1570000, to 'sejuta lima ratus tujuh puluh ribu'
export var terbilang = int => {
  let result = '';
  let thousandSeparatedInts = number(int).split('.');
  if (thousandSeparatedInts[0].length == 1) thousandSeparatedInts[0] = '00' + thousandSeparatedInts[0];
  if (thousandSeparatedInts[0].length == 2) thousandSeparatedInts[0] = '0' + thousandSeparatedInts[0];
  for (let i = 0; i < thousandSeparatedInts.length; i++) {
    if (parseInt(thousandSeparatedInts[i]) == 0) continue; //// skip kalo groupOf3 isinya 000
    //// positionValue = where are we? thousands? millions? billions?
    //// switch (thousandSeparatedInts.length) case 2: ribu, case 3: juta, case 4: miliar
    let indexKosaKataUkuran = thousandSeparatedInts.length + 1 - i;
    let positionValue = kosaKataUkuran[indexKosaKataUkuran];
    let groupOf3 = thousandSeparatedInts[i].split('');
    //// groupOf3 berisi 3 angka (cth: 320, 410, 200, 001, 1)
    for (let j = 0; j < 3; j++) {
      if (!groupOf3[j] || groupOf3[j] == '0') { } //// skip 0 & undefined, do nothing
      else if (groupOf3[j] == '1') {
        if (j == 2) {
          //// angka 1 di satuan: kalo angka pertama: seribu, sejuta; else: 'satu';
          if (groupOf3[j - 1] > 0 || groupOf3[j - 2] > 0) result += 'satu ';
          else result += 'se';
        }
        else if (j == 1) {
          //// angka 1 di puluhan: sepuluh, sebelas, ~belas;
          if (groupOf3[2] == 0) result += 'sepuluh ';
          else if (groupOf3[2] == 1) result += 'sebelas ';
          else result += kosaKataAngka[groupOf3[2]] + ' belas ';
          j++;
        } else result += 'seratus '; //// angka 1 di ratusan: seratus;
      }
      else {
        result += kosaKataAngka[groupOf3[j]] + ' ';
        if (j < 2) result += kosaKataUkuran[2 - j] + ' ';
      }
    }
    if (indexKosaKataUkuran > 2) result += positionValue + ' ';
  }
  return result;
}
