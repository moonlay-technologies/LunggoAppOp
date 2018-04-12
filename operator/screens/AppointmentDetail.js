'use strict';

import React from 'react';
import { Icon } from 'react-native-elements'
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity, NetInfo,
  TextInput, ScrollView, TouchableHighlight, KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo';
import { dateFullShort } from '../../customer/components/Formatter';
import { getPaxCountText } from '../../commons/otherCommonFunctions';
import { fetchVerifyTicket } from './Appointments/AppointmentController';

export default class AppointmentDetail extends React.Component {

  constructor(props) {
    super(props);
    let {reservations} = props.navigation.state.params.details;
    this.state = {
      reservations,
      verificationCode: '',
      showInputWarning: false,
    };
  }

  static navigationOptions = {
    title: 'Detail Appointment',
  }

  _verify = () => {
    let {verificationCode:code, reservations} = this.state;
    this.setState({verificationCode: ''});
    let {verifiedRsv,markedRsvs} = this._verifyOffline(code);
    if (!verifiedRsv) this.setState({showInputWarning: true});
    else {
      this._verifyOnline(code, verifiedRsv.rsvNo, reservations);
      this.setState({reservations: markedRsvs});
    }
  }

  _verifyOffline = code => {
    let parsedCd = parseInt(code.slice(0,-2), 36);
    let verifiedRsv = null;
    let markedRsvs = this.state.reservations.map( rsv => {
      if (rsv.rsvNo == parsedCd) {
        rsv.isVerified = true;
        verifiedRsv = rsv;
      }
      return rsv;
    });
    return {verifiedRsv, markedRsvs};
  }

  _verifyOnline = async (ticketNumber, rsvNo, previousRsvs) => {
    let isConnected = await NetInfo.isConnected.fetch();
    if (!isConnected) return false;
    let res = await fetchVerifyTicket({ticketNumber, rsvNo});
    if(res.status!=200) this.setState({reservations: previousRsvs});
    return true;
  }

  _onVerificationCodeChanged = verificationCode => {
    this.setState({verificationCode, showInputWarning:false});
  }

  render() {
    let { details } = this.props.navigation.state.params;
    let {showInputWarning, verificationCode} = this.state;
    // let {paxGroups} = details;
    return (
      <ScrollView style={{flex:1,backgroundColor: '#f1f0f0' }}>
        <KeyboardAvoidingView behavior="padding">
        <View style={{flex:1,backgroundColor: '#f1f0f0',}}>

          <View style={styles.containerListAppointmentHeader}>
            <Text style={styles.activityTitle2}>
              {details.name}
            </Text>

            <View style={{flexDirection:'row', marginTop:20}}>

              <View style={{alignItems:'center',flex:1, borderWidth:1, borderColor:'#00d3c5', borderRadius:3, paddingBottom:10, marginRight:10}}>
                {/*<Text style={styles.infoTitle}>Tanggal</Text>*/}
                <View style={{marginBottom:-5, marginTop:5}}>
                  <Icon
                    name='ios-calendar'
                    type='ionicon'
                    size={30}
                    color='#00d3c5' />
                </View>
                <View>
                  <Text style={styles.activityDesc}>
                    {dateFullShort(details.date)}
                  </Text>
                </View>
                <View >
                  <Text style={styles.activityDesc}>
                    {details.session}
                  </Text>
                </View>
              </View>

              <View style={{alignItems:'center',flex:1, borderWidth:1, borderColor:'#00d3c5', borderRadius:3, paddingBottom:10}}>
                {/*<Text style={styles.infoTitle}>Total Pax</Text>*/}
                <Icon
                  style={{marginBottom:-5, marginTop:5}}
                  name='ios-people'
                  type='ionicon'
                  size={30}
                  color='#00d3c5' />
                <Text style={styles.activityDesc}>
                  {details.totalPax} peserta
                </Text>
              </View>

            </View>

          </View>

          <Text style={styles.activityTitle1}>
            Detail Peserta
          </Text>

          { this.state.reservations.map( (rsv, index) =>

          <View key={rsv.rsvNo} style={styles.containerListAppointment}>
            <TouchableHighlight
              onPress={this._onPress}
              underlayColor='#ddd'
            >
              <View style={{flexDirection: 'row',}}>
                <View style={{flex:1}}>
                  <View>
                    <Text style={[styles.namaPeserta,{color:rsv.isVerified ? '#00d3c5' : '#454545'}]}>
                      {rsv.contact.name}
                    </Text>
                    <Text style={styles.activityDesc}>{getPaxCountText(rsv.paxCount)}</Text>
                  </View>
                  <Text style={styles.activityDesc}>{rsv.contact.countryCallCd+rsv.contact.phone}</Text>
                  <Text style={styles.activityDesc}>{rsv.contact.email}</Text>
                </View>
                <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                  <Icon
                    style={{marginTop:10}}
                    name='chevron-thin-right'
                    type='entypo'
                    size={20}
                    color='#707070'
                  />
                </View>
              </View>
            </TouchableHighlight> 
          </View>

          )}

{/*paxGroups.map(pg =>
              <View style={{flexDirection:'row', marginTop:40,}}>

                <View style={{flex:1}}>
                  <View>
                    <Text style={styles.activityTitle}>pg.contact.name</Text>
                  </View>
                  <View>
                    <Text style={{color:'#00d3ca', fontSize:13, fontStyle:'italic'}}>Verified</Text>
                    <Text style={{color:'#9a9a9a', fontSize:13, fontStyle:'italic'}}>Waiting for verification</Text>
                  </View>
                </View>

                <View style={{flex:1}}>
                  <View style={{marginTop:10, alignItems:'flex-end'}}>
                    <Icon
                      name='chevron-thin-right'
                      type='entypo'
                      size={24}
                      color='#707070'
                    />
                  </View>
                </View> 

              </View>
              )}

              {/*<View style={{marginTop:25,}}>
                <View style={{flexDirection:'row',}}>
                  <View style={{alignItems:'flex-start',}}>
                    <Icon
                      name='check'
                      type='entypo'
                      color='#517fa4'
                      size={15}
                    />
                  </View>
                  <View style={{marginLeft:8}}>
                    <Text>Penguin North Verified 09182309</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row', marginTop:12}}>
                  <View style={{alignItems:'flex-start',}}>
                    <Icon
                      name='check'
                      type='entypo'
                      color='#517fa4'
                      size={15}
                    />
                  </View>
                  <View style={{marginLeft:8}}>
                    <Text>Penguin North Verified 09182309</Text>
                  </View>
                </View>
              </View>*/}


          <View style={styles.containerListAppointmentVerifikasi}>
            <View>
              <Text style={styles.label}>Masukkan Kode Verifikasi</Text>
              <TextInput
                underlineColorAndroid= 'transparent'
                style={[styles.txtInput,{ borderColor: showInputWarning ? 'red' : '#e5e5e5'}]}
                onChangeText={this._onVerificationCodeChanged}
                value={verificationCode}
                placeholder="Kode verifikasi"
              />
            </View>

            <TouchableOpacity
              style={{alignItems:'center', width:'100%', justifyContent:'center', marginTop:15}}
              onPress={this._verify}
            >
              <LinearGradient
                colors={['#00d3c5', '#35eac6', '#6affc6']}
                start={[0, 0]}
                end={[1, 0]}
                style={{ height: 35, paddingTop: 8, alignItems: 'center', borderRadius: 5, width: '50%' }}>
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

{/*              <View style={{marginTop:40, alignItems:'center'}}>
                <Button
                    containerStyle={{
                      height: 50,
                      width:50,
                      paddingTop: 10,
                      paddingBottom :10,
                      overflow: 'hidden',
                      borderRadius: 50,
                      backgroundColor: '#437ef7',
                    }}
                    style={{fontSize: 14, color: '#ffffff'}}
                  >
                  </Button>
                  <View style={{marginTop:8}}>
                    <Text>Scan Barcode</Text>
                  </View>
              </View>*/}

          
          
        </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointmentHeader: {
    padding:15,
    flex:1,
    backgroundColor:'#fff',
    marginBottom:20,
    alignItems:'center'
  },
  containerListAppointment: {
    padding:15,
    flex:1,
    backgroundColor:'#fff',
    marginBottom:10
  },
  containerListAppointmentVerifikasi: {
    padding:15,
    flex:1,
    backgroundColor:'#fff',
    marginTop:30,
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
        paddingTop:-1,
        paddingBottom:0
        //paddingTop: 23 - (23* 1),

      },
    }),
  },

  status: {
    color:'green',
    fontSize:12,
  },
  icon: {
    width:15,
    height:15,
    marginRight:3,
  },
  activityTitle1: {
    paddingLeft: 15,
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    backgroundColor:'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop:15 ,
      },
      android: {
        lineHeight: 30,
        marginBottom:5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityTitle2:{
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    backgroundColor:'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop:15,
        marginBottom: -15,

      },
      android: {
        lineHeight: 30,
        marginBottom:5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  namaPeserta:{
    fontFamily: 'Hind-SemiBold',
    fontSize: 16,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop:5 ,
        marginBottom: -10,
      },
      android: {
        lineHeight: 30,
        marginBottom:5,
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
    backgroundColor:'transparent',
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
    marginBottom:10,
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
  
});
