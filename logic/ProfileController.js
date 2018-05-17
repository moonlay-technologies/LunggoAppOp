'use strict';
import { fetchTravoramaApi } from '../api/Common';
import { AUTH_LEVEL } from '../constants/env';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export async function fetchProfile() {
  const version = 'v1';
  let request = {
    path: `/${version}/profile`,
    requiredAuthLevel: AUTH_LEVEL.User,
  }
  let response = await fetchTravoramaApi(request);
  let { status } = response;
  if (status == 200) {
    let { name, email, countryCallCd, phone, isPhoneVerified, isEmailVerified } = response;
    let profile = { name, email, countryCallCd, phone, isPhoneVerified, isEmailVerified };
    await setItemAsync('profile', JSON.stringify(profile));
    return profile;
  }
  else return response;
}

export async function getProfile() {
  let shouldRefresh = await getItemAsync('shouldRefresh.profile');
  if (shouldRefresh) {
    deleteItemAsync('shouldRefresh.profile');
    return fetchProfile();
  }

  let profileJson = await getItemAsync('profile');
  if (!profileJson) return fetchProfile();

  let profile = JSON.parse(profileJson);
  return profile;
}

export async function shouldRefreshProfile() {
  setItemAsync('shouldRefresh.profile', 'true');
}

export async function purgeProfile() {
  deleteItemAsync('profile');
}