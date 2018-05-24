
'use strict';

import React from 'react';
import { Icon } from 'react-native-elements'
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity, NetInfo, Dimensions, Linking,
  TextInput, ScrollView, TouchableHighlight, KeyboardAvoidingView, Keyboard, Alert
} from 'react-native';
import { LinearGradient } from 'expo';
import { dateFullShort, reversePhoneWithoutCountryCode_Indonesia } from '../components/Formatter';
import { getPaxCountText } from '../logic/otherCommonFunctions';
import { fetchVerifyTicket, fetchAppointmentListActive } from './Appointments/AppointmentController';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTotalPaxCountsText } from './../logic/otherCommonFunctions';
import { Header } from 'react-navigation';
import PlatformTouchable from 'react-native-platform-touchable';

export default class AppointmentDetail extends React.Component {

  constructor(props) {
    super(props);
    let { reservations } = props.navigation.state.params.details;
    this.state = {
      reservations,
      verificationCode: '',
      showInputWarning: false,
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey',
    };
  }

  static navigationOptions = {
    title: 'Daftar Pesanan',
  }

  componentDidMount() {
    this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', this.keyboardHideListener);
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }

  keyboardHideListener = () => {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    });
  }

  _verify = () => {
    Keyboard.dismiss();
    let { verificationCode: code, reservations } = this.state;
    this.setState({ verificationCode: '' });
    let { verifiedRsv, markedRsvs } = this._verifyOffline(code);
    if (!verifiedRsv)
      this.setState({ showInputWarning: true });
    else {
      this._verifyOnline(code, verifiedRsv.rsvNo, reservations);
      Alert.alert(
        'Pesanan Terverifikasi',
        'No. Pesanan ' + verifiedRsv.rsvNo + '\na.n. ' + verifiedRsv.contact.name + '\n' + getPaxCountText(verifiedRsv.paxCount));
      this.setState({ reservations: markedRsvs });
    }
  }

  _verifyOffline = code => {
    let parsedCd = parseInt(code.slice(0, -2), 36);
    let verifiedRsv = null;
    let markedRsvs = this.state.reservations.map(rsv => {
      if (rsv.rsvNo == parsedCd) {
        rsv.isVerified = true;
        verifiedRsv = rsv;
      }
      return rsv;
    });
    return { verifiedRsv, markedRsvs };
  }

  _verifyOnline = async (ticketNumber, rsvNo, previousRsvs) => {
    let isConnected = await NetInfo.isConnected.fetch();
    if (!isConnected) return false;
    let res = await fetchVerifyTicket({ ticketNumber, rsvNo });
    if (res.status != 200) this.setState({ reservations: previousRsvs });
    await fetchAppointmentListActive();
    return true;
  }

  _onVerificationCodeChanged = verificationCode => {
    this.setState({ verificationCode, showInputWarning: false });
  }

  _callOperator = (contact) => Linking.openURL('tel:' + contact.countryCallCd + contact.phone);
  _smsOperator = (contact) => Linking.openURL('sms:' + contact.countryCallCd + contact.phone);


  render() {
    let { details } = this.props.navigation.state.params;
    let { showInputWarning, verificationCode } = this.state;
    // let {paxGroups} = details;
    return (
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior='height' keyboardVerticalOffset={70} key={this.state.keyboardAvoidingViewKey} enabled>
        <View style={{ flex: -1, backgroundColor: '#f1f0f0' }}>
          <ScrollView>
            <View style={styles.containerListAppointmentHeader}>
              <Text style={styles.activityTitle2}>
                {details.name}
              </Text>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>

                <View style={{ alignItems: 'center', flex: 1, borderWidth: 1, borderColor: '#00d3c5', borderRadius: 3, paddingBottom: 10, marginRight: 10 }}>
                  <View style={{ marginTop: 5 }}>
                    <Icon
                      name='ios-calendar'
                      type='ionicon'
                      size={30}
                      color='#00d3c5' />
                  </View>
                  <Text style={styles.activityDesc}>
                    {dateFullShort(details.date)}
                  </Text>
                  <Text style={styles.activityDesc}>
                    {details.session}
                  </Text>
                </View>

                <View style={{ alignItems: 'center', flex: 1, borderWidth: 1, borderColor: '#00d3c5', borderRadius: 3, paddingBottom: 10 }}>
                  {/*<Text style={styles.infoTitle}>Total Pax</Text>*/}
                  <Icon
                    style={{ marginTop: 5 }}
                    name='ios-people'
                    type='ionicon'
                    size={30}
                    color='#00d3c5' />
                  <Text style={styles.activityDesc}>
                    {details.reservations.length} Pesanan
                    </Text>
                  <Text style={styles.activityDesc}>
                    {getTotalPaxCountsText(details.reservations)}
                  </Text>
                </View>

              </View>

            </View>

            <Text style={styles.activityTitle1}>
              Detail Peserta
          </Text>

            {this.state.reservations.map((rsv, index) =>

              <View key={rsv.rsvNo} style={styles.containerListAppointment}>
                <View>
                  <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                    <Text style={[styles.namaPeserta, { flex: 1, color: '#454545' }]}>
                      a.n. {rsv.contact.name}
                    </Text>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={[styles.activityDesc, { alignItems: 'flex-end' }]}>
                        No. Pesanan {rsv.rsvNo}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>

                      <Text style={styles.activityDesc}>{getPaxCountText(rsv.paxCount)}</Text>
                      <Text style={styles.activityDesc}>{reversePhoneWithoutCountryCode_Indonesia(rsv.contact.phone)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <TouchableOpacity onPress={() => this._callOperator(rsv.contact)} style={[styles.iconKontak, { marginRight: 15 }]}>
                        <Icon
                          name='ios-call'
                          type='ionicon'
                          size={23}
                          color='#00d3c5' />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._smsOperator(rsv.contact)} style={styles.iconKontak}>
                        <Icon
                          name='ios-mail'
                          type='ionicon'
                          size={23}
                          color='#00d3c5' />
                      </TouchableOpacity>
                    </View>

                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.activityDesc}>{rsv.contact.email}</Text>
                    {rsv.isVerified &&
                      <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Icon
                          style={{ marginRight: 10 }}
                          name='md-checkmark-circle-outline'
                          type='ionicon'
                          size={18}
                          color='#00d3c5'
                        />
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={{ color: '#00d3c5' }}>Terverifikasi</Text>
                        </View>

                      </View>}
                  </View>
                </View>
              </View>

            )}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={{ height: 80 }}>

          <View style={styles.containerListAppointmentVerifikasi}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Masukkan Kode Verifikasi</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={[styles.txtInput, { borderColor: showInputWarning ? 'red' : '#e5e5e5' }]}
                  onChangeText={this._onVerificationCodeChanged}
                  value={verificationCode}
                  placeholder="Kode verifikasi"
                />
                <TouchableOpacity
                  style={{ width: '35%' }}
                  onPress={this._verify}
                >
                  <LinearGradient
                    colors={['#00d3c5', '#35eac6', '#6affc6']}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 5, flex: 1, paddingTop: 8 }}>
                    <Text style={{
                      backgroundColor: 'transparent',
                      fontSize: 15, color: '#ffffff',
                      fontFamily: 'Hind-Bold',
                    }}>
                      Verifikasi
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {showInputWarning && (
                <Text style={{ color: 'red' }}> Kode verifikasi salah </Text>
              )
              }
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointmentHeader: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignItems: 'center'
  },
  containerListAppointment: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  containerListAppointmentVerifikasi: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#fff',
  },
  txtInput: {
    height: 35,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 9,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 5,
    color: '#565656',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Hind',
    ...Platform.select({
      android: {
        paddingTop: -1,
        paddingBottom: 0
        //paddingTop: 23 - (23* 1),

      },
    }),
  },

  status: {
    color: 'green',
    fontSize: 12,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 3,
  },
  activityTitle1: {
    paddingLeft: 15,
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop: 15,
      },
      android: {
        lineHeight: 30,
        marginBottom: 5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityTitle2: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop: 15,
        marginBottom: -15,

      },
      android: {
        lineHeight: 30,
        marginBottom: 5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  namaPeserta: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 16,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop: 5,
        marginBottom: -10,
      },
      android: {
        lineHeight: 30,
        // marginBottom: 5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  // infoTitle:{
  //   fontFamily: 'Hind-SemiBold',
  //   fontSize: 15,
  //   color: '#454545',
  //   backgroundColor:'transparent',
  //   ...Platform.select({
  //     ios: {
  //       lineHeight: 19,
  //       paddingTop:12,
  //       marginBottom: -15,
  //       paddingBottom:5,
  //     },
  //     android: {
  //       lineHeight: 30,
  //       marginBottom:5,
  //       //paddingTop: 23 - (23* 1),

  //     },
  //   }),
  // },
  activityDesc: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind-Light',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  label: {
    marginBottom: 10,
    fontSize: 15,
    color: '#000',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  iconKontak: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#00d3c5',
    justifyContent: 'center'
  },
});
