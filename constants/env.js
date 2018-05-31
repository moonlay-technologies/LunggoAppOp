import { Platform } from 'react-native';

const channel = Expo.Constants.manifest.releaseChannel;

export const deviceId = Expo.Constants.deviceId;
export const AUTH_LEVEL = { Guest: '1', User: '2' };
export const WEB_DOMAIN = (() => {
    switch (channel) {
        case "production":
            return 'https://www.travorama.com';
        case "qa":
            return 'https://travorama-qa-cw.azurewebsites.net';
        default:
            return 'https://travorama-local-cw.azurewebsites.net';
    }
})();
export const API_DOMAIN = (() => {
    switch (channel) {
        case "production":
            return 'https://api.travorama.com';
        case "qa":
            return 'https://travorama-qa-api.azurewebsites.net';
        default:
            return 'https://travorama-local-api.azurewebsites.net';
    }
})();

const appVersion = Expo.Constants.manifest.version;
const appType = Expo.Constants.appOwnership;
const platform = Platform.OS;
const clientGuide = "Please set a new client ID and secret for every new version. Set it in env.js on app and in Client table on server database.\n\nTo create client ID, create string in this format \"{platformCode}:{version}:{random string}\" (without quote) then encode it in base64 3 (three) times. Set platformCode as \"rnandroidop\" for android and \"rniosop\" for ios. Set the resulting client ID in env.js on app according to version and in Client table on server database.\n\nTo create Client Secret, create a random string and set it in env.js on app according to version code, then hash it with SHA512 and set it in Client table on server database."

// You're free to clean up old client ID and secret as we can retrieve it back from old commits.

export const clientId = (() => {
    // DEV
    if (appType != "standalone" && channel != "production" && channel != "qa")
    return appType === "ios" ? "WTIwMWNHSXpUblpqUkc5M1RHcEJkVTFFY0doalIwWjNaRmMwUFE9PQ==" : "WTIwMWFHSnRVbmxpTW14cllqTkJOazFETkhkTWFrRTJXVmhDYUdOSVZuVT0=";

    // Production
    let app = appType + "|" + appVersion;
    switch (app) {
        case "android|0.1.2": console.error(clientGuide);
        case "ios|0.1.2": console.error(clientGuide);

        default: console.error(clientGuide);
    }
})();

export const clientSecret = (() => {
    // DEV
    if (appType != "standalone" && channel != "production" && channel != "qa")
        return appType === "ios" ? "StandariOS" : "StandarAndroid";

    // Production
    let app = appType + "|" + appVersion;
    switch (app) {
        case "android|0.1.2": console.error(clientGuide);
        case "ios|0.1.2": console.error(clientGuide);

        default: console.error(clientGuide);
    }
})();