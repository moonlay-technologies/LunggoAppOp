'use strict';

import { Notifications } from 'expo';
import React from 'react';
import { View, Image, Text, StyleSheet, Platform, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';

import registerForPushNotificationsAsync
  from '../api/NotificationController';

import {
  Dashboard, AppointmentList, AppointmentDetail, AppointmentRequest,
  ActivityList, Mutasi,
} from '../operator/screens/Screens';

import EditActivity from '../operator/screens/EditActivity';
import EditDetailActivity from '../operator/screens/EditDetailActivity';
import {
  ForgotPassword, OtpVerification, NewPassword,
  Registration, LoginScreen, BeforeLoginScreen
} from '../commons/Auth/screens/Screens';

import F_AppointmentDetail from '../operator/screens/F_AppointmentDetail';
import F_AppointmentList from '../operator/screens/F_AppointmentList';
import F_ReservationDetail from '../operator/screens/F_ReservationDetail';
import Refund from '../operator/screens/Refund';
import HelpScreen from '../operator/screens/HelpScreen';
import AddActivityScreen from '../operator/screens/AddActivityScreen';

import NotFound from '../commons/NotFoundScreen';
import DetailScreen from './../operator/screens/DetailScreen';
import MapScreen from './../operator/screens/MapScreen';

export default class RootNavigator extends React.Component {

  rootStackNavigator = StackNavigator(
    {
      Main: __DEV__ ? {
        // screen: MainTabNavigator
        //screen:Referral
        // screen:F_ReservationDetail
        // screen:Dashboard
        screen: Dashboard
      } : {
        screen: Dashboard
      },
      Registration: { screen: Registration },
      LoginScreen: { screen: LoginScreen },
      AppointmentList: { screen: AppointmentList },
      AppointmentDetail: { screen: AppointmentDetail },
      AppointmentRequest: { screen: AppointmentRequest },
      ActivityList: { screen: ActivityList },
      Mutasi: { screen: Mutasi,  },
      ForgotPassword: { screen: ForgotPassword },
      EditActivity: { screen: EditActivity },
      EditDetailActivity: { screen: EditDetailActivity },
      OtpVerification: { screen: OtpVerification },
      NewPassword: { screen: NewPassword },
      NotFound: { screen: NotFound },
      BeforeLoginScreen: { screen: BeforeLoginScreen },
      F_AppointmentList: { screen: F_AppointmentList },
      F_AppointmentDetail: { screen: F_AppointmentDetail },
      F_ReservationDetail: { screen: F_ReservationDetail },
      Refund: { screen: Refund },
      HelpScreen: { screen: HelpScreen },
      AddActivityScreen: { screen: AddActivityScreen },
      DetailScreen: {screen: DetailScreen},
      MapScreen: {screen: MapScreen},
    },
    {
      initialRouteName: (this.props.isLoggedIn) ? 'Main' : 'LoginScreen',
      navigationOptions: () => ({
        headerTitleStyle: {
          fontWeight: 'normal',
          fontFamily: 'Hind',
          marginBottom: -5
        },
        headerStyle: {
          ...Platform.select({
            ios: {
            },
            android: {
              elevation: 2,
              marginTop: -20

            },
          }),
        }
      }),
      onTransitionStart: () => Keyboard.dismiss()
    }
  );

  componentDidMount() {
    // this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <this.rootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}
