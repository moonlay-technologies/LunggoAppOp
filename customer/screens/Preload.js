'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';

export default class LoginScreen extends Component<{}> {
  
  static navigationOptions = {
    title: 'Review',
  };

  render() {
    return (
      <ScrollView>

        <View style={styles.containerInfoReview}>
          <Text style={styles.txtBesar}>Review Score</Text>
          <Text style={styles.reviewDate}>based on 1500 reviews</Text>
          <View style={{flexDirection:'row', marginTop:10}}>
            <Text style={styles.nilaiBesar}>4.5</Text>
            <View style={{marginLeft:5}}>
              <Text style={styles.nilaiKecil}>/ 5</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>

        <View style={styles.containerReview}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
            <View style={{flexDirection:'column', justifyContent:'center'}}>
              <Text style={styles.reviewTitle}>Jane Doe {"\n"}</Text>
              <Text style={styles.reviewDate}>3 maret 2017</Text>
            </View>
          </View>
          <View style={{marginTop:10}}>
            <Text style={styles.isireview}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et
            </Text>
          </View>
        </View>

        <View style={styles.containerReview}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
            <View style={{flexDirection:'column', justifyContent:'center'}}>
              <Text style={styles.reviewTitle}>Jane Doe {"\n"}</Text>
              <Text style={styles.reviewDate}>3 maret 2017</Text>
            </View>
          </View>
          <View style={{marginTop:10}}>
            <Text style={styles.isireview}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et
            </Text>
          </View>
        </View>

        <View style={styles.containerReview}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
            <View style={{flexDirection:'column', justifyContent:'center'}}>
              <Text style={styles.reviewTitle}>Jane Doe {"\n"}</Text>
              <Text style={styles.reviewDate}>3 maret 2017</Text>
            </View>
          </View>
          <View style={{marginTop:10}}>
            <Text style={styles.isireview}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et
            </Text>
          </View>
        </View>

        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    backgroundColor: '#fff',
  },
  reviewTitle: {
    fontSize:20,
    color:'#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        lineHeight:6,
        paddingTop: 20,
        marginBottom:-30,
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),
      },
    }),
  },
  containerReview: {
    borderBottomColor:'#ececec',
    borderBottomWidth:1,
    paddingBottom:20,
    marginBottom:20
  },

  reviewreply: {
    marginLeft:20,
    marginTop:25,
  },
   thumbprofile: {
    height: 50,
    width:50,
    borderRadius: 25,
    marginRight: 15,
  },
  hyperlink: {
    fontSize:11,
    marginTop:5,
    color:'#437ef7',
  },
  isireview: {
    fontSize:15,
    color:'#454545',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight:15*0.8,
        paddingTop: 10,
        marginBottom:-10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  reviewDate: {
    fontSize:12,
    color:'#9a9a9a'
  },
  containerInfoReview: {
    backgroundColor:'#f7f7f7',
    paddingVertical:30,
    paddingHorizontal:20,
  },
  reviewDate1: {
    fontSize:12,
    color:'#adadad',

  },
  txtBesar:{
    fontSize:30,
    color:'#000',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight:6,
        paddingTop: 33,
        height:20,
      },
      android: {
        lineHeight:22.5,
        paddingBottom:5
      },
    }),
  },
  nilaiBesar: {
    fontSize:60,
    color:'#ff5f5f',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight:10,
        paddingTop: 60,
        height:40,
      },
      android: {
        lineHeight:45,
      },
    }),
  },
  nilaiKecil: {
    fontSize:13,
    color:'#adadad'
  },
});
