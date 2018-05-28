'use strict';
import { API_DOMAIN } from '../constants/env';
import { getAuthAccess } from '../screens/Auth/AuthController';
import { NavigationActions } from 'react-navigation';

export { AUTH_LEVEL } from '../constants/env';

const LOGGING = true;

export async function fetchTravoramaApi(request) {
  try {
    let { path, method, data, requiredAuthLevel } = request;
    method = method || 'GET';
    let url = API_DOMAIN + (path || request);
    LOGGING && console.log('fetching ' + method + ' from ' + url + ' ...')
    if (!requiredAuthLevel) {
      console.log(`error feching: please specify requiredAuthLevel when calling fetchTravoramaAPI: ${requiredAuthLevel}`)
      throw 'ERROR fetch: requiredAuthLevel needed!';
    }

    //// Get auth info and check if user authorized for the request
    let { accessToken, authLevel } = await getAuthAccess();

    //// check if client have sufficent authLevel for request
    authLevel = parseInt(authLevel);
    requiredAuthLevel = parseInt(requiredAuthLevel);
    if (authLevel < requiredAuthLevel) {
      LOGGING && console.log(`error feching: insufficent authLevel! expected:${requiredAuthLevel}; actual:`+ authLevel)
      return {
        status: 401, message: 'Not Authorized: Not enough auth level!',
        requiredAuthLevel,
      }
    }
    //// Execute request
    let response = await fetch(url, {
      method,
      headers: {
        "Authorization": 'Bearer ' + accessToken,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    }).catch(console.log);
    if (response == null || response == ' ') {
      console.log('response null, please check your connection!');
      return { message: 'response null, please check your connection!' }
    }
    if (response.status == 401) {
      await Expo.SecureStore.deleteItemAsync('expTime');
      return fetchTravoramaApi(request);
    } else if (response.error == "ERRGEN98") { //invalid JSON format
      // console.log(JSON.stringify(request.data));
      throw 'invalid JSON format :' + JSON.stringify(request.data);
    }
    response = await response.json();
    LOGGING && console.log('response from ' + url + ' :');
    LOGGING && console.log(response);
    if (response.status != 200) {
      console.log('status is not 200! \nresponse:');
      console.log(response);
      console.log('request.data:');
      console.log(request.data);
    }
    return response;
  } catch (err) {
    console.log('error while fetching this request :');
    console.log(request);
    console.log(err);
  }
}

export function backToMain(navigation) {
  let { reset, navigate } = NavigationActions;
  const action = reset({
    index: 0,
    actions: [navigate({ routeName: 'Main' })],
  });
  navigation.dispatch(action);
}
