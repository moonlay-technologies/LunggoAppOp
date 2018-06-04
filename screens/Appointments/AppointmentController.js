'use strict';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';
import { observable, action } from 'mobx';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export async function fetchAppointmentRequests() {

  var lastUpdateFromStore = await getItemAsync('appointmentRequestLastUpdate');
  console.log(lastUpdateFromStore);
  var lastUpdate = lastUpdateFromStore ? lastUpdateFromStore : "";

  const version = 'v1';
  let request = {
    path: `/${version}/operator/appointments/request?lastupdate=${lastUpdate}`,
    requiredAuthLevel: AUTH_LEVEL.User,
  }
  try {

    var response = await fetchTravoramaApi(request);
    if (response.mustUpdate) {
      let appointmentRequestJson = await JSON.stringify(response.appointmentRequests);
      console.log("last update json");
      await setItemAsync('appointmentRequests', appointmentRequestJson);
      await setItemAsync('appointmentRequestLastUpdate', response.lastUpdate);
      appointmentRequestItemStore.setAppointmentRequestItem(response.appointmentRequests);
    }
    else {
      var appointmentRequestsJson = await getItemAsync("appointmentRequests");
      if (!appointmentRequestsJson) {
        await deleteItemAsync('appointmentRequestLastUpdate');
        var response = await fetchAppointmentRequests();
      }
      else {
        var appointmentRequests = JSON.parse(appointmentRequestsJson);
        appointmentRequestItemStore.setAppointmentRequestItem(appointmentRequests);
      }
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const _refreshAppointmentRequest = async () => {
  await deleteItemAsync('appointmentRequestLastUpdate');
  await fetchAppointmentRequests();
}

export const _refreshAppointmentListActive = async () => {
  await deleteItemAsync('appointmentListActiveLastUpdate');
  await fetchAppointmentListActive();
}

// export const _getAppointmentRequests = async () => {
//   var appointmentRequestsJson = await getItemAsync("appointmentRequests");
//   if (!appointmentRequestsJson) {
//     await deleteItemAsync('appointmentRequestLastUpdate')
//     var response = await fetchAppointmentRequests();
//   }
//   else {
//     var appointmentRequests = JSON.parse(appointmentRequestsJson);
//     appointmentRequestItemStore.setAppointmentRequestItem(appointmentRequests);
//   }
// }

// export const getAppointmentList = async () => {
//   let shouldRefresh = await getItemAsync('shouldRefresh.appointmentList');
//   if (shouldRefresh) {
//     deleteItemAsync('shouldRefresh.appointmentList');
//     return fetchAppointmentList();
//   } else {
//     let listJson = await getItemAsync('appointmentList');
//     if (!listJson || !listJson.includes("\"status\":200")) return fetchAppointmentList();

//     let list = JSON.parse(listJson);
//     return list;
//   }
// }

export const fetchAppointmentList = async (params = '') => {
  const version = 'v1';
  const appointmentListPath = `/${version}/operator/appointments?perpage=1000`
  const path = params ? appointmentListPath + "&" + params : appointmentListPath;
  let request = { path, requiredAuthLevel: AUTH_LEVEL.User }
  try {
    let list = await fetchTravoramaApi(request);
    setItemAsync('appointmentList', JSON.stringify(list));
    return list;
  } catch (error) {
    console.warn(error);
  }
}

export const fetchAppointmentListActive = async () => {

  var lastUpdateFromStore = await getItemAsync('appointmentListActiveLastUpdate');
  console.log("last udpate appointment list active dari secure store");
  console.log(lastUpdateFromStore);
  var lastUpdate = lastUpdateFromStore ? lastUpdateFromStore : "";

  const version = 'v1';
  const path = `/${version}/operator/appointments/active?lastupdate=${lastUpdate}`
  let request = { path, requiredAuthLevel: AUTH_LEVEL.User }

  try {
    var response = await fetchTravoramaApi(request);
    if (response.mustUpdate) {
      let appointmentRequestJson = await JSON.stringify(response.appointments);
      console.log("last update json");
      await setItemAsync('appointmentListActive', appointmentRequestJson);
      await setItemAsync('appointmentListActiveLastUpdate', response.lastUpdate);
      appointmentListActiveItemStore.setAppointmentListActiveItem(response.appointments);
    }
    else {
      var appointmentListActiveJson = await getItemAsync("appointmentListActive");
      if (!appointmentListActiveJson) {
        await deleteItemAsync('appointmentListActive');
        var response = await fetchAppointmentListActive();
      }
      else {
        var appointmentListActive = JSON.parse(appointmentListActiveJson);
        appointmentListActiveItemStore.setAppointmentListActiveItem(appointmentListActive);
      }
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function shouldRefreshAppointmentList() {
  setItemAsync('shouldRefresh.appointmentList', 'true');
}


export const fetchVerifyTicket = async ({ ticketNumber, rsvNo }) => {
  const version = 'v1';
  const path = `/${version}/operator/verifyticket`;
  const method = 'POST';
  const requiredAuthLevel = AUTH_LEVEL.User;
  const data = { ticketNumber, rsvNo };
  let request = { path, requiredAuthLevel, method, data }
  try {
    return await fetchTravoramaApi(request);
  } catch (error) {
    console.warn(error);
  }
}

class AppointmentRequestStorageMobx {
  @observable appointmentRequestItem;
  @action setAppointmentRequestItem = item => {
    console.log("set appointment request ke mobx")
    this.appointmentRequestItem = item;
  }

  @action removeAppointmentRequestItem = () => {
    this.appointmentRequestItem = undefined;
  }
}

class AppointmentListActiveStorageMobx {
  @observable appointmentListActiveItem;
  @action setAppointmentListActiveItem = item => {
    console.log("set appointment list active ke mobx")
    this.appointmentListActiveItem = item;
  }

  @action removeAppointmentListActiveItem = () => {
    this.appointmentListActiveItem = undefined;
  }
}

export const appointmentRequestItemStore = new AppointmentRequestStorageMobx;
export const appointmentListActiveItemStore = new AppointmentListActiveStorageMobx;
