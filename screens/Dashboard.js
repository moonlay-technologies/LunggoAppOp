'use strict';

import React from 'react';
import {
  Image, Platform, ScrollView, Text, TouchableOpacity, View,
  RefreshControl, StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { getProfile } from '../logic/ProfileController';
// import * as Formatter from '../components/Formatter';
import LoadingAnimation from '../components/LoadingAnimation';
import { checkUserLoggedIn } from '../api/Common';
import { NavigationActions } from 'react-navigation';
import {
  fetchAppointmentRequests, fetchAppointmentList,
  appointmentRequestItemStore, //_getAppointmentRequests,
  _refreshAppointmentRequest, fetchAppointmentListActive,
  appointmentListActiveItemStore, _refreshAppointmentListActive
} from './Appointments/AppointmentController';
import { //getActivityList,
  fetchActivityList } from './ActivityController';
import Avatar from './../components/Avatar';
import MenuButton from './../components/MenuButton';
import intervalController from './IntervalController';
import { observable, observer } from 'mobx-react';

const { getItemAsync } = Expo.SecureStore;
@observer
export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      name: '...',
      balance: 9999999,
      avatar: 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png',
      requests: null,
      // reservations:  [
      //   {
      //       "activity": {
      //           "activityId": 2,
      //           "name": "Tiket dufan",
      //           "date": "2018-03-30T00:00:00",
      //           "session": "10:00 - 13:00",
      //           "mediaSrc": "https://www.ancol.com/sites/default/files/styles/1400x710/public/arung-jeram-slider-2.jpg?itok=A7NbC0Wr"
      //       },
      //       "rsvNo": "36541081",
      //       "rsvTime": "2018-01-30T00:00:00",
      //       "contact": {
      //           "title": 0,
      //           "name": "Peter Morticelli",
      //           "countryCallCd": "62",
      //           "phone": "1234567890",
      //           "email": "petermort@wasasa.com"
      //       },
      //       "paxes": [],
      //       "paxCount": [
      //           {
      //               "type": "Adult",
      //               "count": 1,
      //               "totalPrice": 190000
      //           }
      //       ],
      //       "paymentSteps": [
      //           {
      //               "description": "DP Pertama",
      //               "amount": 10000,
      //               "date": "2018-03-23",
      //               "isCompleted": true
      //           },
      //           {
      //               "description": "DP Kedua",
      //               "amount": 8000,
      //               "date": "2018-04-20",
      //               "isCompleted": false
      //           }
      //       ],
      //     }
      //   ],
      activities: null,
      appointments: null,
      // reservations: null,
    };
  }

  static navigationOptions = {
    header: null,
  }

  componentDidMount() {
    const { isLoggedIn, withConnHandler } = this.props.screenProps;
    withConnHandler(getProfile ,{hasLoadingModal:false})
      .then(profile => this.setState(profile))
      .catch(console.warn);
    if (!isLoggedIn) {
      let { reset, navigate } = NavigationActions;
      const action = reset({
        index: 0,
        actions: [navigate({ routeName: 'LoginScreen' })],
      });
      this.props.navigation.dispatch(action);
    }
    this.props.navigation.addListener('didFocus', this._refreshData);
    this.props.navigation.addListener('didFocus', () => intervalController.register(fetchAppointmentRequests));
    this.props.navigation.addListener('didFocus', () => intervalController.register(fetchAppointmentListActive));
  }

  _refreshData = () => {
    this.setState({ refreshing: true });
    this.props.screenProps.withConnHandler( () => Promise.all([
      _refreshAppointmentListActive(),
      _refreshAppointmentRequest(),
      this._getActivityList(),
      // this._getReservationList()
    ]), {hasLoadingModal:false} ).finally(() => {
      this.setState({ refreshing: false });
    });
  }

  // _getAppointmentRequests = async () => {
  //   var appointmentRequestsJson = await getItemAsync("appointmentRequests");
  //   if (!appointmentRequests) {
  //     var response = this.props.screenProps.withConnHandler(fetchAppointmentRequests ,{hasLoadingModal:false});
  //   }
  //   else{
  //     var appointmentRequests = JSON.parse(appointmentRequestsJson);
  //     appointmentRequestItemStore.setAppointmentRequestItem(appointmentRequests);
  //   }
  // }

  // _getAppointmentList = () => {
  //   this.props.screenProps.withConnHandler(fetchAppointmentList ,{hasLoadingModal:false})
  //   .then(({ appointments }) =>
  //     // this.props.navigation.isFocused() &&
  //     this.setState({ appointments })
  //   ).catch(console.warn);
  // }

  _getActivityList = () => {
    fetchActivityList().then(({ activityList }) =>
      // this.props.navigation.isFocused() &&
      this.setState({ activities: activityList })
    ).catch(console.warn);
  }

  _goToAppointmentRequest = () => {
    let { requests = [] } = appointmentRequestItemStore.appointmentRequestItem;
    this.props.navigation.navigate('AppointmentRequest', { requests });
  }

  _goToAppointmentList = () =>
    this.props.navigation.navigate(
      'AppointmentList', { list: appointmentListActiveItemStore.appointmentListActiveItem || [] }
    );

  _goToActivityList = () => this.props.navigation.navigate('ActivityList');
  _goToFAppointmentList = () => this.props.navigation.navigate('F_AppointmentList');
  _goToDeniedOrders = () => this.props.navigation.navigate('DeniedOrders');
  _goToAccountScreen = () => this.props.navigation.navigate('AccountScreen');
  _goToMessageScreen = () => this.props.navigation.navigate('NotFound');
  _goToDealsScreen = () => this.props.navigation.navigate('NotFound');
  // _goToActivityDetails = () => this.props.navigation.navigate('NotFound');
  _goToReviewScreen = () => this.props.navigation.navigate('NotFound');
  _goToHelpScreen = () => this.props.navigation.navigate('HelpScreen');
  _goToAddActivityScreen = () => this.props.navigation.navigate('AddActivityScreen');

  // _goToReservations = () => this.props.navigation.navigate(
  //   'Reservations', {reservations:this.state.reservations}
  // )

  _goToProfile = () => { 'TODO'; console.warn('TODO: Dashboard.js _goToProfile') };

  _goToMutasi = () => this.props.navigation.navigate('Mutasi');
  _goToRefund = () => this.props.navigation.navigate('Refund');

  render() {
    // let nameInitial = item.contact.name.substr(0,1);
    return (
      <ScrollView
        style={{ backgroundColor: '#f7f8fb' }}
        refreshControl={<RefreshControl onRefresh={this._refreshData} refreshing={this.state.refreshing} />}
      >
        <View style={{ height: 310 }}>
          <Image style={{ height: 250, resizeMode: 'cover' }} source={require('../assets/images/bg1.jpg')} />
          <View style={styles.containerDashboard}>
            <View style={styles.containerBoxDashboard}>
              <View style={{ position: 'absolute', flexDirection: 'row', right: 15, top: 15, }}>
                {/*<TouchableOpacity>
                  <Icon
                    style={{ width: 45, alignItems: 'center', }}
                    name='ios-paper-plane'
                    type='ionicon'
                    size={26}
                    color='#454545' />
                  <View style={styles.notification}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>5</Text>
                  </View>
                </TouchableOpacity>*/}
              </View>

              <Avatar size={90} style={styles.avatarBig} name={this.state.name} source={{ uri: this.state.avatar }} />
              <View style={{ marginTop: 20 }}>
                <Text style={styles.namaProfile}>{this.state.name}</Text>
              </View>
              {/* <View style={{}}>
                <Text style={styles.saldo}>{Formatter.price(this.state.balance)}</Text>
              </View> */}
              <View style={{ flexDirection: 'row', marginTop: 25 }}>
                <TouchableOpacity onPress={this._goToActivityList} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.teks1}>Aktivitasku</Text>
                  {this.state.activities == null ? <LoadingAnimation height={40} width={40} /> :
                    <Text style={styles.teks2}>{this.state.activities.length}</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={this._goToAppointmentList} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.teks1}>Terjadwal</Text>
                  {appointmentListActiveItemStore.appointmentListActiveItem == null ? <LoadingAnimation height={40} width={40} /> :
                    <Text style={styles.teks2}>{appointmentListActiveItemStore.appointmentListActiveItem.length}</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={this._goToAppointmentRequest} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.teks1}>Pesanan Baru</Text>
                  {appointmentRequestItemStore.appointmentRequestItem == null ? <LoadingAnimation height={40} width={40} /> :
                    <Text style={styles.teks2}>{appointmentRequestItemStore.appointmentRequestItem.length}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.boxDetail}>

          <MenuButton
            label='Aktivitasku'
            icon={
              <Icon
                name='ios-bicycle'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToActivityList}
          />
          <MenuButton
            label='Pesanan Terjadwal'
            icon={
              <Icon
                name='md-clipboard'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToAppointmentList}
          />
          <MenuButton
            label='Pesanan Baru'
            icon={
              <Icon
                name='new-message'
                type='entypo'
                size={24}
                color='#00d3c5'
              />
            }
            onPress={this._goToAppointmentRequest}
          />
        </View>

        <View style={styles.boxSeparator}></View>

        <View style={styles.boxDetail}>

          <MenuButton
            label='Pencairan Dana'
            icon={
              <Icon
                name='md-trending-up'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToMutasi}
          />
          <MenuButton
            label='Pembatalan dan Pengembalian'
            icon={
              <Icon
                name='md-undo'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToRefund}
          />
          <MenuButton
            label='Penghasilan'
            icon={
              <Icon
                name='ios-cash'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToFAppointmentList}
          />
          <MenuButton
            label='Pesanan Ditolak'
            icon={
              <Icon
                name='md-close-circle'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToDeniedOrders}
          />

        </View>

        <View style={styles.boxSeparator}></View>

        <View style={styles.boxDetail}>

          <MenuButton
            label='Pengaturan Akun'
            icon={
              <Icon
                name='ios-contacts'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToAccountScreen}
          />
          <MenuButton
            label='Tambah Aktivitas'
            icon={
              <Icon
                name='md-add-circle'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToAddActivityScreen}
          />
          <MenuButton
            label='Bantuan'
            icon={
              <Icon
                name='md-help-circle'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToHelpScreen}
          />
        </View>


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerDashboard: {
    padding: 15,
    position: 'absolute',
    top: 30,
    width: '100%'
  },
  containerBoxDashboard: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#e8f0fe',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 0.9
      },
      android: {
        elevation: 2
      },
    }),
  },
  boxDetail: {
    backgroundColor: '#fff',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    flex: 1
  },
  boxSeparator: {
    height: 20
  },
  avatarBig: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 45,
  },
  namaProfile: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 22,
    color: '#454545',
    letterSpacing: -1,
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -18
      },
      android: {
        marginBottom: -5

      },
    }),
  },
  // saldo: {
  //   fontSize: 16,
  //   color: '#f57b76',
  //   marginTop: 2,
  //   fontFamily: 'Hind-SemiBold',
  //   ...Platform.select({
  //     ios: {
  //       // lineHeight:19*0.8,
  //       // paddingTop: 20 - (19 * 0.4),
  //       marginBottom: -5,
  //     },
  //     android: {

  //     },
  //   }),
  // },
  teks1: {
    fontSize: 14,
    color: '#989898',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -5,
      },
      android: {

      },
    }),
  },
  teks2: {
    fontSize: 20,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -5,
      },
      android: {

      },
    }),
  },
  // notification: {
  //   backgroundColor: '#00d3c5',
  //   alignItems: 'center',
  //   padding: 1,
  //   width: 15,
  //   height: 15,
  //   borderRadius: 20,
  //   position: 'absolute',

  //   ...Platform.select({
  //     ios: {
  //       right: 3,
  //       bottom: 14,
  //     },
  //     android: {
  //       right: 3,
  //       bottom: 11,
  //     },
  //   }),
  // },
});