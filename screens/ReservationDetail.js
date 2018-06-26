'use strict';

import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Timeline from 'react-native-timeline-listview';
import { getPaxCountText, getPaymentSumInSteps } from '../logic/otherCommonFunctions';
import { date as formatDate, rupiah } from '../components/Formatter';
import Moment from 'moment';
import { reversePhoneWithoutCountryCode_Indonesia } from './../components/Formatter';

export default class ReservationDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Detail Peserta',
  }

  _callOperator = (contact) => Linking.openURL('tel:+' + contact.countryCallCd + contact.phone);
  _smsOperator = (contact) => Linking.openURL('sms:+' + contact.countryCallCd + contact.phone);

  render() {
    let { rsv, activityDetail: { name, date, session } } =
      this.props.navigation.state.params;
    let activityTime = formatDate(date);
    if (!!session) activityTime += ', ' + session;
    let paxCount = getPaxCountText(rsv.paxCount);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.boxDetail}>
          <Icon
            style={{ marginRight: 15 }}
            name='ios-bicycle'
            type='ionicon'
            size={26}
            color='#00d3c5'
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.labelHeader}>Detail Aktivitas</Text>
            <View style={{ marginTop: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.labelDesc]}>Nama Aktivitas</Text>
                <Text style={[styles.activityDesc, { flex: 1 }, { marginLeft: 40 }]} numberOfLines={1}>{name}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.labelDesc}>Waktu</Text>
                <Text style={styles.activityDesc}>{activityTime}</Text>
              </View>
              {/*<View style={{flexDirection:'row', justifyContent:'space-between' }}>
                <Text style={styles.labelDesc}>*Nama Paket:</Text>
                <Text style={styles.activityDesc}>*Paket Keluarga besar*</Text>
              </View>*/}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.labelDesc}>Peserta</Text>
                <Text style={styles.activityDesc}>{paxCount}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.boxDetail}>
          <Icon
            style={{ marginRight: 15 }}
            name='ios-paper-outline'
            type='ionicon'
            size={26}
            color='#00d3c5'
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.labelHeader}>Detail Pesanan</Text>
            <View style={{ marginTop: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.labelDesc}>Nomor Pesanan</Text>
                <Text style={styles.activityDesc}>{rsv.rsvNo}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.labelDesc}>Nama Pemesan</Text>
                <Text style={styles.activityDesc}>
                  {rsv.contact.name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.labelDesc}>Tanggal Pesan</Text>
                <Text style={styles.activityDesc}>{formatDate(rsv.rsvTime)}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelHeader}>Kontak Peserta</Text>
          <View style={{ marginTop: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.labelDesc}>Nama</Text>
              <Text style={styles.activityDesc}>{rsv.contact.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.labelDesc}>Telepon</Text>
              <Text style={styles.activityDesc}>{reversePhoneWithoutCountryCode_Indonesia(rsv.contact.phone)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.labelDesc}>Email</Text>
              <Text style={styles.activityDesc}>{rsv.contact.email}</Text>
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
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f0f0',
    flex: 1,
  },
  boxDetail: {
    backgroundColor: '#fff',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 2,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
    flex: 1
  },
  nominalKecil: {
    fontFamily: 'Hind',
    fontSize: 14,
    color: '#00d3c5',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -10,
      },
      android: {
        lineHeight: 20,
      },
    }),
  },
  danger: {
    fontFamily: 'Hind',
    fontSize: 14,
    color: '#f57b76',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -10,
      },
      android: {
        lineHeight: 20,
        marginBottom: 5,
      },
    }),
  },
  labelHeader: {
    fontFamily: 'Hind',
    fontSize: 18,
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
  activityTitle: {
    fontFamily: 'Hind',
    fontSize: 15,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 10,
        paddingTop: 10,
        marginBottom: -18,
      },
      android: {
        lineHeight: 20,

      },
    }),
  },
  activityDesc: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  labelDesc: {
    fontSize: 14,
    color: '#2f2f2f',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -10,
      },
      android: {

      },
    }),
  },
  activityDescTimeline: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -10,
      },
      android: {
        marginTop: 5,
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
