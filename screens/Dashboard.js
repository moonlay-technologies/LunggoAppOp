'use strict';

import React from 'react';
import {
  Image, Platform, ScrollView, Text, TouchableOpacity, View, RefreshControl,
  TextInput, ActivityIndicator, TouchableNativeFeedback, StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Button from 'react-native-button';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common';
import { getProfile } from '../logic/ProfileController';
import * as Formatter from '../components/Formatter';
import Modal from '../components/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import { checkUserLoggedIn } from '../api/Common';
import { NavigationActions } from 'react-navigation';
import {
  fetchAppointmentRequests, getAppointmentList, fetchAppointmentList
} from './Appointments/AppointmentController';
import { getActivityList, fetchActivityList } from './ActivityController';
import Avatar from './../components/Avatar';
import MenuButton from './../components/MenuButton';

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
    getProfile().then(profile => this.setState(profile)).catch(e => console.warn(e));
    checkUserLoggedIn().then(isLoggedIn => {
      if (!isLoggedIn) {
        let { reset, navigate } = NavigationActions;
        const action = reset({
          index: 0,
          actions: [navigate({ routeName: 'LoginScreen' })],
        });
        this.props.navigation.dispatch(action);
      }
    });
    this.props.navigation.addListener('didFocus', this._refreshData);
  }

  _refreshData = () => {
    this.setState({ isLoading: true });
    Promise.all([
      this._getAppointmentList(),
      this._getAppointmentRequests(),
      this._getActivityList(),
      // this._getReservationList()
    ]).then(() => {
      this.setState({ isLoading: false });
    });
  }

  _getAppointmentRequests = () => {
    fetchAppointmentRequests().then(res =>
      // this.props.navigation.isFocused() &&
      this.setState({ requests: res.appointmentRequests })
    ).catch(e => console.warn(e));;
  }

  _getAppointmentList = () => {
    fetchAppointmentList().then(({ appointments }) =>
      // this.props.navigation.isFocused() &&
      this.setState({ appointments })
    ).catch(e => console.warn(e));
  }

  _getActivityList = () => {
    fetchActivityList().then(({ activityList }) =>
      // this.props.navigation.isFocused() &&
      this.setState({ activities: activityList })
    ).catch(e => console.warn(e));;
  }

  _goToAppointmentRequest = () => {
    let { requests = [] } = this.state;
    this.props.navigation.navigate('AppointmentRequest', { requests });
  }

  _goToAppointmentList = () =>
    this.props.navigation.navigate(
      'AppointmentList', { list: this.state.appointments || [] }
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

  _openLogoutModal = () => this.refs.logoutModal.openModal();
  _askLogout = () => this._openLogoutModal();

  render() {
    // let nameInitial = item.contact.name.substr(0,1);
    return (
      <ScrollView
        style={{ backgroundColor: '#f7f8fb' }}
        refreshControl={<RefreshControl onRefresh={this._refreshData} refreshing={this.state.isLoading} />}
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

              <LogoutConfirmationModal ref='logoutModal' {...this.props} />

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
                  {this.state.appointments == null ? <LoadingAnimation height={40} width={40} /> :
                    <Text style={styles.teks2}>{this.state.appointments.length}</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={this._goToAppointmentRequest} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.teks1}>Pesanan Baru</Text>
                  {this.state.requests == null ? <LoadingAnimation height={40} width={40} /> :
                    <Text style={styles.teks2}>{this.state.requests.length}</Text>
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
                name='ios-contacts-outline'
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
          <MenuButton
            label='Keluar Akun'
            icon={
              <Icon
                name='ios-log-out'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._askLogout}
          />
        </View>


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modalMenu: {
    backgroundColor: '#fff',
    width: 180,
    padding: 10,
    position: 'absolute',
    right: 10,
    top: 80,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 4,
        shadowOpacity: 0.2
      },
      android: {
        elevation: 2
      },
    }),
  },
  separatorOption: {
    paddingVertical: 10
  },
  containerDashboard: {
    padding: 15,
    position: 'absolute',
    top: 30,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,

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
  labelHeader: {
    flex: 1,
    fontFamily: 'Hind',
    fontSize: 16,
    color: '#000',
    marginTop: 2,
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 10,
        marginBottom: -12,
      },
      android: {
        lineHeight: 24,

      },
    }),
  },
  imgRecentActivity: {
    height: 125,
    width: '100%',
    resizeMode: 'cover',
    overflow: 'hidden'
  },
  saldo: {
    fontSize: 16,
    color: '#f57b76',
    marginTop: 2,
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
  teks3: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind',
    textAlign: 'right',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  teks3a: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'Hind',
    textAlign: 'left',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  teks4: {
    fontSize: 14,
    color: '#23d3c3',
    fontFamily: 'Hind-SemiBold',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  teks5: {
    fontSize: 14,
    color: '#f57b76',
    fontFamily: 'Hind-SemiBold',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  ctaButton1: {
    width: '100%',
    paddingVertical: 6,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: '#00d3c5',
  },
  ctaButton2: {
    width: '100%',
    paddingVertical: 6,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: '#f57b76',
  },
  ctaButton3: {
    width: '100%',
    paddingVertical: 6,
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#ff5f5f',
    borderWidth: 1
  },
  categoryTitle: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 19,
    color: '#454545',
  },
  activityReviewButton: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
  },
  credit: {
    fontSize: 15,
    marginTop: 3,
    marginLeft: 5,
    fontFamily: 'Hind',
    color: '#454545',
  },
  notification: {
    backgroundColor: '#00d3c5',
    alignItems: 'center',
    padding: 1,
    width: 15,
    height: 15,
    borderRadius: 20,
    position: 'absolute',

    ...Platform.select({
      ios: {
        right: 3,
        bottom: 14,
      },
      android: {
        right: 3,
        bottom: 11,
      },
    }),
  },
  textKecil: {
    fontSize: 12,
    fontFamily: 'Hind',
    color: '#676767',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -8,
      },
      android: {
        marginBottom: -2,
      },
    }),
  },
  boldRating: {
    fontSize: 45,
    fontFamily: 'Hind-Bold',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -30,
      },
      android: {
        marginBottom: -14,
      },
    }),
  },
  point: {
    fontFamily: 'Hind-Bold',
    fontSize: 30,
    color: '#01d4cb',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -20,
      },
      android: {
        marginBottom: -2,
      },
    }),
  },
  activityTitle: {
    fontSize: 16,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    textAlign: 'right',
    ...Platform.select({
      ios: {
        lineHeight: 10,
        paddingTop: 10,
        marginBottom: -12,
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 20,
        //paddingTop: 23 - (23* 1),
      },
    }),
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fb',
  },
});