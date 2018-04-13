import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import Expo, { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import Colors from './constants/Colors';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isLoggedIn: false,
    };
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onFinish={this._handleFinishLoading}
          onError={this._handleLoadingError}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          <RootNavigation
            isLoggedIn={this.state.isLoggedIn}
          />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      getItemAsync('isLoggedIn').then(isLoggedIn => this.setState({ isLoggedIn })),
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync([
        // This is the font that we are using for our tab bar
        Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        // { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        // { 'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf') },
        // { 'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf') },
        // { 'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf') },
        // { 'OpenSans-BoldItalic': require('./assets/fonts/OpenSans-BoldItalic.ttf') },
        // { 'OpenSans-CondLight': require('./assets/fonts/OpenSans-CondLight.ttf') },
        // { 'OpenSans-ExtraBold': require('./assets/fonts/OpenSans-ExtraBold.ttf') },
        // { 'OpenSans-ExtraBoldItalic': require('./assets/fonts/OpenSans-ExtraBoldItalic.ttf') },
        // { 'OpenSans-Italic': require('./assets/fonts/OpenSans-Italic.ttf') },
        // { 'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf') },
        // { 'OpenSans-LightItalic': require('./assets/fonts/OpenSans-LightItalic.ttf') },
        // { 'OpenSans-Semibold': require('./assets/fonts/OpenSans-Semibold.ttf') },
        // { 'OpenSans-SemiboldItalic': require('./assets/fonts/OpenSans-SemiboldItalic.ttf') },
        { 'Hurme-Bold': require('./assets/fonts/HurmeGeometricSans4-Bold.otf') },
        { 'Hurme-SemiBold': require('./assets/fonts/HurmeGeometricSans4-SemiBold.otf') },
        { 'Hurme': require('./assets/fonts/HurmeGeometricSans4.otf') },
        { 'Hurme-Light': require('./assets/fonts/HurmeGeometricSans4-Light.otf') },

        { 'Hind': require('./assets/fonts/hind-regular.ttf') },
        { 'Hind-Bold': require('./assets/fonts/hind-bold.ttf') },
        { 'Hind-SemiBold': require('./assets/fonts/hind-semibold.ttf') },
        { 'Hind-Light': require('./assets/fonts/hind-light.ttf') },

      ]),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: Expo.Constants.statusBarHeight,
    backgroundColor: Colors.statusBar,
  },
});
