'use strict';

import React from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView,
  TouchableOpacity
} from 'react-native';
import OfflineNotificationBar from '../../commons/components/OfflineNotificationBar';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';
import LoadingAnimation from '../../customer/components/LoadingAnimation';
import { timeFromNow, date, rupiah } from '../../customer/components/Formatter';
import { getPaxCountText } from '../../commons/otherCommonFunctions';
import Moment from 'moment';

export default class Refund extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refunds: [],
      isLoading: true,
    }
  }

  static navigationOptions = {
    title: 'Refund',
  }

  componentDidMount() {
    //// start with isLoading:true; in the constructor
    this._fetchRefund().then( ({refunds}) => this.setState({refunds}) )
      .catch( e => console.warn(e) )
      .finally( () => this.setState({isLoading:false}) );
  }

  _fetchRefund = async () => {
    const version = 'v1';
    const path = `/${version}/operator/pendingrefunds`;
    let request = { path, requiredAuthLevel: AUTH_LEVEL.User }
    try {
      return await fetchTravoramaApi(request);
    } catch (error) {
      console.warn(error);
    }
  }

  _goToDetail = rsv => this.props.navigation.navigate('F_ReservationDetail',{
    rsv, activityDetail: {
      name: rsv.activityName, date:rsv.activityDate, session:rsv.session
    }
  })

  render() {
    let { refunds, isLoading } = this.state;
    let totalAmount = refunds.reduce( (total,refund) => {
      return total + refund.refundAmount;
    },0 );
    let soonestRefund = refunds[0] || {refundAmount:0,dueDate:'0000-00-00'};
    let soonestDueDate = Moment(soonestRefund.dueDate).diff(Moment(), 'days');
    let soonestAmount = rupiah(soonestRefund.refundAmount);
    return (
      <View style={{flex:1}}>
      { isLoading ?
        <LoadingAnimation/>
      :
      (!refunds.length) ?
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text>Tidak ada pembatalan yang harus dibayarkan</Text>
        </View>
      :
        <ScrollView style={styles.container}>
          <View style={styles.center}>
            <Text style={styles.nominalBesar1}>Total Refund</Text>
            <Text style={styles.nominalBesar}>{rupiah(totalAmount)}</Text>
            <View style={{marginTop:4, alignItems:'center'}}>
              <Text style={styles.activityDesc}>
                bayarkan {soonestAmount} maksimal {soonestDueDate} hari lagi
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          { refunds.map( (item,i) =>
            <View key={i} >
              <TouchableOpacity style={styles.boxReservation} onPress={()=>this._goToDetail(item)}>
                <View style={{marginRight:10, width:'20%' }}>
                  <Image style={{ height: 55, width:'100%',}} source={{uri:item.mediaSrc}} />
                </View>
                <View style={{width:'80%'}}>
                  <Text style={styles.activityTitle}>
                    {item.activityName}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    Pemesan: {item.contact.name}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    Peserta: {getPaxCountText(item.paxCount)}
                  </Text>
                  <Text style={styles.activityTanggal}>
                    Batas akhir refund: {date(item.dueDate)}
                  </Text>
                  <Text style={styles.activityTanggal}>Yang harus direfund:
                    <Text style={styles.nominalKecil}> {rupiah(item.refundAmount)}</Text>
                  </Text>
                  
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          ) }
        </ScrollView>
      }
      <OfflineNotificationBar/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical:20,
    backgroundColor: '#fff',
    flex:1,
  },
  center:{
    alignItems:'center',
  },
  boxReservation:{
    paddingHorizontal:15,
    flexDirection:'row',
    flex:1,
    width:'100%',
  },
  nominalBesar:{
    fontFamily: 'Hind',
    fontSize: 35,
    color: '#00d3c5',
    ...Platform.select({
      ios: {
        height:45
      },
      android: {
        lineHeight: 30,
        marginBottom:5,
        paddingBottom:8
      },
    }),
  },
  nominalBesar1:{
    fontFamily: 'Hind',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        height:22
      },
      android: {
        lineHeight: 30,
        marginBottom:5,
        paddingBottom:8
      },
    }),
  },
  nominalKecil:{
    fontFamily: 'Hind',
    fontSize: 15,
    color: '#00d3c5',
    ...Platform.select({
      ios: {
        height:45
      },
      android: {
        lineHeight: 20,
        marginBottom:5,
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
    fontSize: 15  ,
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
    marginVertical:15
  },
  containerTanggal: {
    width: '90%',
  },
});
