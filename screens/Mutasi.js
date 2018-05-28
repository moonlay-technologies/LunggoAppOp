'use strict';

import React from 'react';
import ImageSlider from 'react-native-image-slider';
import MapView from 'react-native-maps';
import Button from 'react-native-button';
import { Slider } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import {
  Platform, StyleSheet, Text, View, Image, TextInput,
  ScrollView, Alert, InteractionManager
} from 'react-native';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common'
import * as Formatter from '../components/Formatter'
import DatePicker from 'react-native-datepicker'
import globalStyles from '../components/globalStyles';
import Moment from 'moment';
// import 'moment/locale/id';
import LoadingAnimation from '../components/LoadingAnimation';

export default class Mutasi extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'D MMM YYYY';
    this.locale = 'id';
    this.state = {
      startDate: Moment(new Date()).add(-1, 'month').startOf('day'),
      endDate: Moment(new Date()).startOf('day'),
      trx: [],
      isLoading: true
    };
  }

  static navigationOptions = {
    title: 'Pencairan Dana'
  };

  componentDidMount() {
    this._getTrx(this.state.startDate, this.state.endDate);
  }

  _verifyDate(startDate, endDate) {
    let startEndDiff = Moment(endDate).diff(Moment(startDate), 'days');
    if (startEndDiff > 31) {
      setTimeout(() =>  // because showing alert right after closing modal make iOS stuck
        Alert.alert('Perhatian', 'Maksimal rentang tanggal mutasi adalah 31 hari'), 750);
      return false;
    }
    if (startEndDiff < 0) {
      setTimeout(() => // because showing alert right after closing modal make iOS stuck
        Alert.alert('Perhatian', 'Tanggal akhir tidak boleh kurang dari tanggal awal'), 750);
      return false;
    }
    return true;
  }

  _getTrx(startDate, endDate) {
    let isDateValid = this._verifyDate(startDate, endDate);
    if (!isDateValid) {
      this.setState({ isDateInvalid: true });
      return;
    }

    this.setState({ isLoading: true });
    let endpoint = '/v1/operator/transactionstatement';
    endpoint += '?startdate=' + Moment(startDate).format('YYYY-MM-DD');
    endpoint += '&enddate=' + Moment(endDate).format('YYYY-MM-DD');
    fetchTravoramaApi({
      path: endpoint,
      method: 'GET',
      requiredAuthLevel: AUTH_LEVEL.User
    }).then(response => {
      if (response.status == 200)
        this.setState({ trx: response.transactionStatements, isLoading: false, isDateInvalid: false });
      else if (response.error == 'ERR_DATETIME_OUT_OF_RANGE')
        this.setState({ isDateInvalid: true, isLoading: false });
    })
  }

  _showTrxList = () => {
    if (this.state.isDateInvalid)
      return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text>Silakan ganti rentang tanggal terlebih dahulu.</Text>
        </View>);
    if (this.state.isLoading)
      return <LoadingAnimation />;
    else if (!this.state.trx.length)
      return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text>Tidak ada transaksi pada rentang tanggal ini.</Text>
        </View>);
    else
      return this.state.trx.map(t => (
        <View style={styles.container} key={t.trxNo}>
          <View style={styles.boxMutasi}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={{ flex: 2 }}>
                <Text style={styles.textKecil}>{t.remarks}</Text>
                <Text style={styles.kode}>{t.trxNo}</Text>
                <Text style={styles.textKecilabu}>{Moment(t.dateTime).format('D MMM YYYY HH:MM')}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.textKecil}>+ {Formatter.rupiah(t.amount)}</Text>
                {/* <Text style={styles.textKecilabu}>Rp 200.000</Text> */}
              </View>
            </View>
          </View>
        </View>
      ));
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <ScrollView>
          <View style={{ flex: 1, marginBottom: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dfdfdf', padding: 15 }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.textKecil1}>Tanggal awal</Text>
                <DatePicker
                  style={styles.containerTanggal}
                  date={Moment(this.state.startDate).format(this.format)}
                  showIcon={false}
                  mode="date"
                  placeholder="Start Date"
                  format={this.format}
                  minDate={Moment(new Date()).add(-1, 'year').format(this.format)}
                  maxDate={Moment(new Date()).format(this.format)}
                  confirmBtnText="OK"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {
                    let formattedDate = Moment(date, this.format, this.locale);
                    this.setState({ startDate: formattedDate });
                    this._getTrx(formattedDate, this.state.endDate);
                  }}
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
                      borderColor: '#00a89d',
                      backgroundColor: '#00bdb1',
                    },
                  }}
                />
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.textKecil1}>Tanggal akhir</Text>
                <DatePicker
                  style={styles.containerTanggal}
                  date={Moment(this.state.endDate).format(this.format)}
                  showIcon={false}
                  mode="date"
                  placeholder="End Date"
                  format={this.format}
                  minDate={Moment(this.state.startDate).format(this.format)}
                  maxDate={Moment(new Date()).format(this.format)}
                  confirmBtnText="OK"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {
                    let formattedDate = Moment(date, this.format, this.locale);
                    this.setState({ endDate: formattedDate });
                    this._getTrx(this.state.startDate, formattedDate);
                  }}
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
                      borderColor: '#00a89d',
                      backgroundColor: '#00bdb1',
                    },
                  }}
                />
              </View>
            </View>
            {/*<View style={{ flex: 1, alignItems: 'center', marginTop: 15 }}>
              <Button
                containerStyle={globalStyles.ctaButton8}
                style={{ fontSize: 14, color: '#fff' }}
              >
                Pilih
              </Button>
            </View>*/}
          </View>

          <View>
            {this._showTrxList()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfdfdf',
    marginTop: 10
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
  },
  boxMutasi: {
  },
  priceTitleBig: {
    fontSize: 14,
    color: '#676767',
    marginTop: 2,
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -8,
      },
      android: {

      },
    }),
  },
  categoryTitle: {
    fontFamily: 'HindBold',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -15,
      },
      android: {
      },
    }),
  },
  textKecil: {
    fontSize: 14,
    fontFamily: 'Hind',
    color: '#676767',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {
        marginBottom: -3,
      },
    }),
  },
  textKecil1: {
    fontSize: 14,
    fontFamily: 'HindSemiBold',
    color: '#676767',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {
        marginBottom: -3,
      },
    }),
  },
  kode: {
    fontSize: 14,
    fontFamily: 'HindBold',
    color: '#676767',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {
        marginBottom: -3,
      },
    }),
  },
  textKecilabu: {
    fontSize: 13,
    fontFamily: 'Hind',
    color: '#a5a5a5',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        marginBottom: -10,
      },
      android: {
        marginBottom: -3,
      },
    }),
  },
  containerTanggal: {
    flex: 1,
    width: '95%',
    marginTop: 10,
    borderRadius: 3,
    borderColor: '#00a89d',
    backgroundColor: '#00bdb1',

  },

});
