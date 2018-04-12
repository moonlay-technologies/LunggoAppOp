'use strict';

import React from 'react';
import {
  Platform, StyleSheet, Text, View, Image,
  ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import OfflineNotificationBar from '../../commons/components/OfflineNotificationBar';
import ReactNativeDatepicker from 'react-native-datepicker';
import { dateFullShort } from '../../customer/components/Formatter';
import { fetchAppointmentList } from './Appointments/AppointmentController';
import LoadingAnimation from '../../customer/components/LoadingAnimation';
import {
  getTotalPaxCountsText,
  getPaymentSumInReservations as getPaymentInfo,
  getPaymentSumInAppointments as getPaymentSum,
} from '../../commons/otherCommonFunctions';
import Moment from 'moment';
import 'moment/locale/id';

export default class F_AppointmentList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      list: [],
      startDate: Moment().startOf('Month'),
      endDate: Moment(new Date()),
    };
  }

  static navigationOptions = {
    title: 'Penghasilan',
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this._getAppointmentList(this.state);
  }

  _getAppointmentList = ({ startDate, endDate }) => {
    let start = Moment(startDate).format('MM/DD/YYYY');
    let end = Moment(endDate).format('MM/DD/YYYY');
    // let start = Moment.utc(startDate).format('MM/DD/YYYY');
    // let end   = Moment.utc( endDate ).format('MM/DD/YYYY');
    let params = `type=order&startDate=${start}&endDate=${end}`;
    fetchAppointmentList(params)
      .then(res => this.setState({ list: res.appointments }))
      .catch(e => console.warn(e))
      .finally(() => this.setState({ isLoading: false }));
  }

  _keyExtractor = (item, index) => index
  _renderItem = ({ item, index }) =>
    <ListItem item={item} index={index} {...this.props} />

  _changeDate = (date, whichDate) => {
    date = Moment(date, 'dddd, D MMM YYYY');
    this._getAppointmentList({ ...this.state, [whichDate]: date });
    this.setState({ [whichDate]: date });
  }

  render() {
    let { startDate, endDate, list, isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.center}>
            <Text style={styles.nominalBesar1}>Total Pendapatan</Text>
            <Text style={styles.nominalBesar}>{getPaymentSum(list)}</Text>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={styles.activityDesc}>Sudah Dibayar
                <Text style={styles.nominalKecil}> {getPaymentSum(list, 'completed')}</Text>
              </Text>
              <View style={{ marginTop: 3 }}>
                <Text style={styles.activityDesc}>
                  Periode {dateFullShort(startDate)} ‒ {dateFullShort(endDate)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
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
          {isLoading ? <LoadingAnimation /> :
            list.length ?
              <FlatList
                style={{ paddingTop: 15 }}
                data={list}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
              />
              :
              <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <Text>Tidak ada transaksi pada rentang tanggal ini</Text>
              </View>
          }
        </ScrollView>
        <OfflineNotificationBar />
      </View>
    );
  }
}

class ListItem extends React.PureComponent {

  _goToFAppointmentDetail = () => this.props.navigation.navigate(
    'F_AppointmentDetail', { details: this.props.item }
  )

  render() {
    let { item } = this.props;
    return (
      <View>
        <TouchableOpacity style={styles.boxReservation} onPress={this._goToFAppointmentDetail}>
          <View style={{ marginRight: 10, width: '20%' }}>
            <Image style={{ height: 55, width: '100%', }} source={{ uri: item.mediaSrc }} />
          </View>
          <View style={{ width: '80%' }}>
            <View style={{marginBottom:10}}>
              <Text style={styles.activityTitle}>
                {item.name}
              </Text>
              <Text style={styles.activityTanggal}>
                {dateFullShort(item.date)}{item.session && ' pk. ' + item.session}
              </Text>
            </View>
            
            <View style={{ width:'95%', flexDirection: 'row' }} >
              <View style={{ flex: 1.5, }}>
                <Text style={styles.activityTanggal}>Peserta</Text>
                <Text style={styles.activityTanggal}>Sudah Dibayar</Text>
                <Text style={styles.activityTanggal}>Harga</Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.activityTanggal}>{getTotalPaxCountsText(item.reservations)}</Text>
                <Text style={styles.nominalKecil}> {getPaymentInfo(item.reservations, 'completed')}</Text>
                <Text style={styles.nominalKecil}> {getPaymentInfo(item.reservations)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
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
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateInput: {
          borderRadius: 3,
          borderColor: '#cdcdcd',
          height: 35,
        }
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
        lineHeight: 12,
        paddingTop: 9,
        marginBottom: -8,
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
        marginBottom: -8,
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
  // dateInput: {
  //   borderRadius: 3,
  //   borderColor: '#cdcdcd',
  //   height:35,
  // },
});
