'use strict';

import { Notifications } from 'expo';
import React from 'react';
import { View, Image, Text, StyleSheet, Platform, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync
  from '../api/NotificationController';
import { APP_TYPE } from '../constants/env';

import {
  SearchActivity, MyBooking, BookedPageDetail, DetailScreen, Review,
  PaymentScreen, PaxChoice, BookingDetail, AddPax, CalendarPicker,
  AdvanceSearch, RincianHarga,
} from '../customer/screens/Screens';

import {
  Dashboard, AppointmentList, AppointmentDetail, AppointmentRequest,
  ActivityList, Mutasi,
} from '../operator/screens/Screens';

import EditActivity from '../operator/screens/EditActivity';
import EditDetailActivity from '../operator/screens/EditDetailActivity';
import Cart from '../customer/screens/Cart/CartScreen'
import MapScreen from '../customer/screens/MapScreen';
import AccountPage from '../customer/screens/AccountPage';
import SubmitReview from '../customer/screens/SubmitReviewScreen';
import SubmitRating from '../customer/screens/SubmitRatingScreen';
import AddBookingContact from '../customer/screens/AddBookingContact';
import {
  ForgotPassword, OtpVerification, NewPassword,
  Registration, LoginScreen, BeforeLoginScreen
} from '../commons/Auth/screens/Screens';

import CancelationPolicy from '../customer/screens/Terms/CancelationPolicy';
import WebViewScreen from '../customer/screens/WebViewScreen';
import Referral from '../customer/screens/ReferralPage';
import ReferralHistory from '../customer/screens/RiwayatReferral';
import ChangeProfile from '../customer/screens/ChangeProfile';
import F_AppointmentDetail from '../operator/screens/F_AppointmentDetail';
import F_AppointmentList from '../operator/screens/F_AppointmentList';
import F_ReservationDetail from '../operator/screens/F_ReservationDetail';
// import ReservationDetail from '../operator/screens/ReservationDetail';
import Refund from '../operator/screens/Refund';

import IntroScreen from '../customer/screens/IntroScreen';
// import Filter from '../screens/Filter';
import NotFound from '../commons/NotFoundScreen';

export default class RootNavigator extends React.Component {

  rootStackNavigator = StackNavigator(
    {
      Main: __DEV__ ? {
        // screen: MainTabNavigator
        //screen:Referral
        // screen:F_ReservationDetail
        // screen:Dashboard
        screen: (APP_TYPE=='CUSTOMER') ? MainTabNavigator : Dashboard
      } : {
        screen: (APP_TYPE=='CUSTOMER') ? MainTabNavigator : Dashboard
      },
      SearchActivity: { screen: SearchActivity },
      DetailScreen: { screen: DetailScreen },
      CalendarPicker: { screen: CalendarPicker },
      PaymentScreen: { screen: PaymentScreen },
      PaxChoice: { screen: PaxChoice },
      AddPax: { screen: AddPax },
      BookingDetail: { screen: BookingDetail },
      Registration: { screen: Registration },
      BookedPageDetail: { screen: BookedPageDetail },
      LoginScreen: { screen: LoginScreen },
      AppointmentList: { screen: AppointmentList },
      AppointmentDetail: { screen: AppointmentDetail },
      AppointmentRequest: { screen: AppointmentRequest },
      ActivityList: { screen: ActivityList },
      Review: { screen: Review },
      Mutasi: { screen: Mutasi,  },
      RincianHarga: { screen: RincianHarga },
      ForgotPassword: { screen: ForgotPassword },
      MapScreen: { screen: MapScreen },
      Cart: { screen: Cart },
      AddBookingContact: { screen: AddBookingContact },
      EditActivity: { screen: EditActivity },
      EditDetailActivity: { screen: EditDetailActivity },
      OtpVerification: { screen: OtpVerification },
      NewPassword: { screen: NewPassword },
      SubmitRating: { screen: SubmitRating },
      SubmitReview: { screen: SubmitReview },
      CancelationPolicy: { screen: CancelationPolicy },
      NotFound: { screen: NotFound },
      IntroScreen: { screen: IntroScreen },
      BeforeLoginScreen: { screen: BeforeLoginScreen },
      WebViewScreen: { screen: WebViewScreen },
      Referral: { screen: Referral },
      F_AppointmentList: { screen: F_AppointmentList },
      F_AppointmentDetail: { screen: F_AppointmentDetail },
      F_ReservationDetail: { screen: F_ReservationDetail },
      // ReservationDetail: { screen: ReservationDetail },
      Refund: { screen: Refund },
      ReferralHistory: { screen: ReferralHistory },
      ChangeProfile: { screen: ChangeProfile },
    },
    {
      initialRouteParams: { appType: APP_TYPE },
      initialRouteName: (APP_TYPE == 'CUSTOMER') ?
        (this.props.skipIntro) ? 'Main' : 'IntroScreen' :
        (this.props.isLoggedIn) ? 'Main' : 'LoginScreen',
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
