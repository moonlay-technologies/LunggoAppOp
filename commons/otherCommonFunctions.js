'use strict';

import {rupiah} from '../customer/components/Formatter';


//// display how many pax (e.g. 2 Adults, 3 Children)
export const getPaxCountText = paxCount => paxCount.filter(p => p.count != 0)
  .map(p => p.count + ' ' + p.type).join(', ')

export const getTotalPaxCounts = arrayOfData => {
  let totalPaxCounts = {};
  arrayOfData.map( ({paxCount}) =>
  	paxCount.filter(p => p.count != 0)
    .map( ({type, count}) => totalPaxCounts[type] = (totalPaxCounts[type] + count) || count )
  );
  return totalPaxCounts;
}

export const getTotalPaxCountsText = arrayOfData => {
  let totalPaxCounts = getTotalPaxCounts(arrayOfData);
  return Object.keys( totalPaxCounts )
    .map( e => totalPaxCounts[e] + " " + e)
    .join(', ')
}

/*export var convertPaxCountObjToArr = totalPaxCounts => {
  let ret = [];
  for (let paxType in totalPaxCounts) {
   ret.push({ type:paxType, count:totalPaxCounts[paxType] });
  }
  return ret;
}

export var getTotalPaxCountsText = arrayOfData => getPaxCountText(
  convertPaxCountObjToArr( getTotalPaxCounts(arrayOfData) )
)*/

/*
let totalPax = item.paxCount.reduce( (total2,paxType) => {
  return total2 + paxType.count;
}, 0);
*/


export const getPaymentSumInSteps = (paymentSteps, isCompleted = false, formatted = true) => {
  let arr = isCompleted ?
    paymentSteps.filter( step => step.isCompleted == true ) :
    paymentSteps;
  let result = arr.reduce( (total, step) => total + step.amount, 0 );
  return formatted ? rupiah(result) : result;
}

export const getPaymentSumInReservations = (reservations, isCompleted = false, formatted = true) => {
  let result = reservations.reduce( (total, rsv) =>
    total + getPaymentSumInSteps(rsv.paymentSteps,isCompleted,false)
  ,0 );
  return formatted ? rupiah(result) : result;
}

export const getPaymentSumInAppointments = (appointments, isCompleted = false, formatted = true) => {
  let result = appointments.reduce( (total, {reservations}) =>
    total + getPaymentSumInReservations(reservations,isCompleted,false)
  ,0 );
  return formatted ? rupiah(result) : result;
}
