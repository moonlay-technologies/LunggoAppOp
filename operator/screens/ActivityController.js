'use strict';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export async function fetchActivityList() {
  const version = 'v1';
  const path = `/${version}/operator/myactivity`;
  let request = { path, requiredAuthLevel: AUTH_LEVEL.User }
  let list = await fetchTravoramaApi(request);
  await setItemAsync('activityList', JSON.stringify(list));
  return list;
}

export const getActivityList = async () => {
  let shouldRefresh = await getItemAsync('shouldRefresh.activityList');
  if (shouldRefresh) {
    deleteItemAsync('shouldRefresh.activityList');
    return fetchActivityList();
  }

  let listJson = await getItemAsync('activityList');
  if (!listJson) return fetchActivityList();

  let list = JSON.parse(listJson);
  return list;
}

export async function shouldRefreshActivityList() {
  setItemAsync('shouldRefresh.activityList', 'true');
}
