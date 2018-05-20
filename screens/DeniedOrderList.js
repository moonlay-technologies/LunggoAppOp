'use strict';

import React from 'react';
import {
  Platform, StyleSheet, Text, View, Image, ScrollView,
  TouchableOpacity
} from 'react-native';
import OfflineNotificationBar from '../components/OfflineNotificationBar';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common';
import LoadingAnimation from '../components/LoadingAnimation';
import { timeFromNow, date, rupiah } from '../components/Formatter';
import { getPaxCountText } from '../logic/otherCommonFunctions';
import Moment from 'moment';
import { dateFullShort } from './../components/Formatter';
import ReactNativeDatepicker from 'react-native-datepicker';
import { fetchAppointmentList } from './Appointments/AppointmentController';
import Colors from '../constants/Colors';

export default class DeniedOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      list: [],
      startDate: Moment().startOf('Month'),
      endDate: Moment(new Date()),
    }
  }

  static navigationOptions = {
    title: 'Pesanan Ditolak',
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this._getDeniedList(this.state);
  }

  _getDeniedList = ({ startDate, endDate }) => {
    let start = Moment(startDate).format('MM/DD/YYYY');
    let end = Moment(endDate).format('MM/DD/YYYY');
    let params = `type=order&startDate=${start}&endDate=${end}`;
    fetchAppointmentList(params)
      .then(res => {
        console.log('res');
        console.log(res);
        let rsvList = res.appointments.reduce((list, app) => list.concat(app.reservations), []);
        // console.log('rsvList');
        // console.log(rsvList);
        let deniedList = rsvList.filter(rsv => rsv.rsvStatus == 'CAOP' || rsv.rsvStatus == 'DENY');
        // console.log('deniedList');
        // console.log(deniedList);
        this.setState({ list: deniedList });
      })
      .catch(e => console.warn(e))
      .finally(() => this.setState({ isLoading: false }));
  }

  _goToDetail = rsv => this.props.navigation.navigate('F_ReservationDetail', {
    rsv, activityDetail: {
      name: rsv.activityName, date: rsv.activityDate, session: rsv.session
    }
  });

  _changeDate = (date, whichDate) => {
    date = Moment(date, 'dddd, D MMM YYYY');
    this._getDeniedList({ ...this.state, [whichDate]: date });
    this.setState({ [whichDate]: date });
  };

  render() {
    let { list, isLoading, startDate, endDate } = this.state;
    let totalAmount = list.reduce((total, rsv) => { return total + rsv.paxCount.totalPrice; }, 0);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.center}>
            <Text style={styles.nominalBesar1}>Total Potensi yang Ditolak</Text>
            <Text style={styles.nominalBesar}>{rupiah(totalAmount)}</Text>
            {/* <View style={{ marginTop: 10, alignItems: 'center' }}>
              <View style={{ marginTop: 3 }}>
                <Text style={styles.activityDesc}>
                  Periode {dateFullShort(startDate)} ‒ {dateFullShort(endDate)}
                </Text>
              </View>
            </View> */}
          </View>
          <View style={styles.divider} />
          <View style={{ marginBottom: 3 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Periode
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <DatePicker
              mode="date"
              date={startDate.format('dddd, D MMM YYYY')}
              maxDate={Moment(new Date())}
              onDateChange={d => this._changeDate(d, 'startDate')}
            />
            <View style={{ justifyContent: 'center' }}>
              <Text>—</Text>
            </View>
            <DatePicker
              mode="date"
              date={endDate.format('dddd, D MMM YYYY')}
              minDate={startDate}
              maxDate={Moment(new Date())}
              onDateChange={d => this._changeDate(d, 'endDate')}
            />
          </View>
          <View style={styles.divider}></View>
          {list && list.map((item, i) =>
            <View key={i} >
              <TouchableOpacity style={styles.boxReservation} onPress={() => this._goToDetail(item)}>
                <View style={{ marginRight: 10, width: '20%' }}>
                  <Image style={{ height: 55, width: '100%', }} source={{ uri: item.mediaSrc }} />
                </View>
                <View style={{ width: '80%' }}>
                  <Text style={styles.activityTitle}>
                    {item.activityName}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    No. Pesanan: {item.rsvNo}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    Pemesan: {item.contact.name}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    Peserta: {getPaxCountText(item.paxCount)}
                  </Text>
                  <Text style={styles.activityTanggal}>Potensi tertolak:
                    <Text style={styles.nominalKecil}> {rupiah(item.paxCount.totalPrice)}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          )}
        </ScrollView>
        <OfflineNotificationBar />
      </View>
    );
  }
}

const DatePicker = props => (
  <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
    <ReactNativeDatepicker
      style={[styles.containerTanggal, { ...props.style }]}
      date={props.date}
      mode="date"
      placeholder="select date"
      format="ddd, D MMM YYYY"
      minDate={Moment().subtract(1, 'years').format('dddd, D MMM YYYY')}
      maxDate={Moment().add(1, 'years').format('dddd, D MMM YYYY')}
      showIcon={false}
      confirmBtnText="OK"
      cancelBtnText="Cancel"
      customStyles={{
        placeholderText: {
          fontSize: 20,
          color: '#fff'
        },
        dateText: {
          color: '#fff',
          fontWeight: 'bold'
        },
        dateInput: {
          borderRadius: 3,
          borderColor: '#cdcdcd',
          backgroundColor: Colors.bottomTabSelected,
          height: 35
        },
      }}
      onDateChange={props.onDateChange}
    />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
  boxReservation: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  nominalBesar: {
    fontFamily: 'Hind',
    fontSize: 35,
    color: '#00d3c5',
    ...Platform.select({
      ios: {
        height: 45
      },
      android: {
        lineHeight: 30,
        marginBottom: 5,
        paddingBottom: 8
      },
    }),
  },
  nominalBesar1: {
    fontFamily: 'Hind',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        height: 22
      },
      android: {
        lineHeight: 30,
        marginBottom: 5,
        paddingBottom: 8
      },
    }),
  },
  nominalKecil: {
    fontFamily: 'Hind',
    fontSize: 15,
    color: '#00d3c5',
    ...Platform.select({
      ios: {
        height: 45
      },
      android: {
        lineHeight: 20,
        marginBottom: 5,
      },
    }),
  },
  activityTitle: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 17,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 10,
        paddingTop: 10,
        marginBottom: -12,
      },
      android: {
        lineHeight: 24,

      },
    }),
  },
  activityDesc: {
    fontSize: 15,
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
  activityTanggal: {
    fontSize: 15,
    color: '#636363',
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
  status: {
    fontSize: 15,
    color: '#f57b76',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {

      },
    }),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e1e1e1',
    marginVertical: 15
  },
  containerTanggal: {
    width: '90%',
  },
});
