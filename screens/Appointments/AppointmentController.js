'use strict';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export async function fetchAppointmentRequests() {
  const version = 'v1';
  let request = {
    path: `/${version}/operator/appointments/request?perpage=1000`,
    requiredAuthLevel: AUTH_LEVEL.User,
  }
  try {
    return await fetchTravoramaApi(request);
  } catch (error) {
    console.error(error);
  }
}

export const getAppointmentList = async () => {
  let shouldRefresh = await getItemAsync('shouldRefresh.appointmentList');
  if (shouldRefresh) {
    deleteItemAsync('shouldRefresh.appointmentList');
    return fetchAppointmentList();
  } else {
    let listJson = await getItemAsync('appointmentList');
    if (!listJson || !listJson.includes("\"status\":200")) return fetchAppointmentList();

    let list = JSON.parse(listJson);
    return list;
  }
}

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

export async function shouldRefreshAppointmentList() {
  setItemAsync('shouldRefresh.appointmentList', 'true');
}


export const fetchVerifyTicket = async ({ticketNumber, rsvNo}) => {
  const version = 'v1';
  const path = `/${version}/operator/verifyticket`;
  const method = 'POST';
  const requiredAuthLevel = AUTH_LEVEL.User;
  const data = {ticketNumber, rsvNo};
  let request = { path, requiredAuthLevel, method, data }
  try {
    return await fetchTravoramaApi(request);
  } catch (error) {
    console.warn(error);
  }
}

