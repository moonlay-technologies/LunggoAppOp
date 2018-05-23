'use strict';

import React from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

export default class LoginScreen extends React.Component {

  constructor(props){
    super(props)
    this.data = [
      {time: '09:00', title: 'DP 1', description: 'Jumlah: Rp 300.000\nPada tanggal: 1 Jan 2018'},
      {time: '10:45', title: 'DP 2', description: 'Jumlah: Rp 700.000\nPada tanggal: 5 Jan 2018'},
      {time: '12:00', title: 'Lunas', description: 'Jumlah: Rp 1.000.000\nPada tanggal: 5 Jan 2018'},
    ]
  }

  static navigationOptions = {
    title: 'Reservation Detail',
  }

  render() {
    return (
      <ScrollView style={styles.container}>

        <View style={styles.boxDetail}>
          <View style={{marginRight:15}}>
            <Icon
              name='ios-contact-outline'
              type='ionicon'
              size={26}
              color='#00d3c5' 
            />
          </View>
          <View style={{flex:1}}>
            <Text style={styles.labelHeader}>Detail Pemesan</Text>
            <View style={{marginTop:3}}>
              <View style={{flexDirection:'row', justifyContent:'space-between' }}>
                <Text style={styles.labelDesc}>Nama:</Text>
                <Text style={styles.activityDesc}>Ali Zainal Abidin*</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between' }}>
                <Text style={styles.labelDesc}>No. Telp:</Text>
                <Text style={styles.activityDesc}>081380315665*</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.boxDetail}>
          <View style={{marginRight:15}}>
            <Icon
              name='ios-alert-outline'
              type='ionicon'
              size={26}
              color='#00d3c5' 
            />
          </View>
          <View style={{flex:1}}>
            <Text style={styles.labelHeader}>Permintaan Khusus</Text>
            <View style={{marginTop:3}}>
              <View style={{flexDirection:'row',}}>
                <View style={{marginRight:5}}>
                  <Text style={styles.labelDesc}>1.</Text>
                </View>
                <Text style={styles.activityDesc}>Permintaan Khusus #1</Text>
              </View>
              <View style={{flexDirection:'row',}}>
                <View style={{marginRight:5}}>
                  <Text style={styles.labelDesc}>2.</Text>
                </View>
                <Text style={styles.activityDesc}>Permintaan Khusus #2</Text>
              </View>
              <View style={{flexDirection:'row',}}>
                <View style={{marginRight:5}}>
                  <Text style={styles.labelDesc}>3.</Text>
                </View>
                <Text style={styles.activityDesc}>Permintaan Khusus #3</Text>
              </View>
              <View style={{flexDirection:'row',}}>
                <View style={{marginRight:5}}>
                  <Text style={styles.labelDesc}>4.</Text>
                </View>
                <Text style={styles.activityDesc}>Permintaan Khusus #4</Text>
              </View>
            </View>
          </View>
        </View>

        
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f0f0',
    flex:1,
  },
  center:{
    alignItems:'center',
  },
  boxDetail:{
    backgroundColor:'#fff',
    borderBottomColor:'#e1e1e1',
    borderBottomWidth: 2,
    padding:15,
    flexDirection:'row',
    marginBottom:20,
    flex:1
  },
  nominalKecil:{
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
  danger:{
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
        marginBottom:5,
      },
    }),
  },
  labelHeader:{
    fontFamily: 'Hind',
    fontSize: 18,
    color: '#000',
    marginTop:2,
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
        marginBottom: -15,
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
