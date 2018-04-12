import { Permissions, Notifications } from 'expo';
import { fetchTravoramaApi, AUTH_LEVEL } from './Common';

// Example server, implemented in Rails: https://git.io/vKHKv
// const PUSH_ENDPOINT = 'https://expo-push-server.herokuapp.com/tokens';
// const PUSH_ENDPOINT = 'http://5acf2105.ngrok.io';
const PUSH_ENDPOINT = '/v1/notification/registration';

export default (async function registerForPushNotificationsAsync() {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') return;

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to our backend so we can use it to send pushes from there
  return fetchTravoramaApi({
    path: PUSH_ENDPOINT,
    method: 'PUT',
    data: { handle:token },
    requiredAuthLevel: AUTH_LEVEL.User,
  });
});
