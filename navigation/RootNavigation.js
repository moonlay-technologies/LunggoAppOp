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
} from '../screens/Screens';

import EditActivity from '../screens/EditActivity';
import EditDetailActivity from '../screens/EditDetailActivity';
import {
  ForgotPassword, OtpVerification, NewPassword,
  Registration, LoginScreen, BeforeLoginScreen
} from '../screens/Auth/screens/Screens';

import F_AppointmentDetail from '../screens/F_AppointmentDetail';
import F_AppointmentList from '../screens/F_AppointmentList';
import F_ReservationDetail from '../screens/F_ReservationDetail';
import Refund from '../screens/Refund';
import DeniedOrders from '../screens/DeniedOrderList';
import HelpScreen from '../screens/HelpScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import AccountScreen from '../screens/AccountScreen';

import NotFound from '../screens/NotFoundScreen';
import DetailScreen from './../screens/DetailScreen';
import MapScreen from './../screens/MapScreen';
import ChangeProfile from './../screens/ChangeProfile';

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
      Mutasi: { screen: Mutasi, },
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
      DeniedOrders: { screen: DeniedOrders },
      HelpScreen: { screen: HelpScreen },
      AddActivityScreen: { screen: AddActivityScreen },
      AccountScreen: { screen: AccountScreen },
      DetailScreen: { screen: DetailScreen },
      MapScreen: { screen: MapScreen },
      ChangeProfile: { screen: ChangeProfile },
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
