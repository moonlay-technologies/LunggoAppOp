'use strict';

import React, { Component } from 'react';
import { Icon } from 'react-native-elements'
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

export default class LoginScreen extends Component<{}> {
  constructor(props, context) {
    super(props, context);
  }

  static navigationOptions = {
    header: null,
  }

  _handlePress = () => {
    this.props.navigation.navigate('MainTabNavigator')
  }
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <View style={{marginBottom:20}}>
            <TextInput style={styles.searchInput} underlineColorAndroid='transparent' placeholder='Jogjakarta|'/>
            <View style={{position:'absolute', right:18, top:11}}>
              <Icon
              name='magnifying-glass'
              type='entypo'
              size={22}
              color='#acacac'/>
            </View>
          </View>
          <View style={{flexDirection:'row', marginVertical:20}}>
            <View>
              <Icon
              name='gps-not-fixed'
              type='materialicons'
              size={22}
              color='#454545'/>
            </View>
            <View style={{marginLeft:10, marginTop:2}}>
              <Text style={styles.activityTitle}>Detect My Location</Text>
            </View>
          </View>
          <View style={{height:1, backgroundColor:'#cdcdcd'}}></View>
          <View style={{flexDirection:'row', marginVertical:20}}>
            <View>
              <Icon
              name='filter-hdr'
              type='materialicons'
              size={22}
              color='#454545'/>
            </View>
            <View style={{marginLeft:10, marginTop:2}}>
              <Text style={styles.activityTitle}>All Experience in Jakarta</Text>
            </View>
          </View>
          <View style={{marginTop:50}}>
            <View>
              <Text style={{fontWeight:'bold', fontSize:14, color:'#999999', marginBottom:10}}>Your Current Search</Text>
            </View>
            <View style={{flexDirection:'row', marginVertical:20}}>
              <View>
                <Icon
                name='location-on'
                type='materialicons'
                size={22}
                color='#454545'/>
              </View>
              <View style={{marginLeft:10, marginTop:2}}>
                <Text style={styles.activityTitle}>Osaka, Tokyo</Text>
              </View>
            </View>
            <View style={{height:1, backgroundColor:'#cdcdcd'}}></View>
            <View style={{flexDirection:'row', marginVertical:20}}>
              <View>
                <Icon
                name='location-on'
                type='materialicons'
                size={22}
                color='#454545'/>
              </View>
              <View style={{marginLeft:10, marginTop:2}}>
                <Text style={styles.activityTitle}>Ubud, Bali</Text>
              </View>
            </View>
            <View style={{height:1, backgroundColor:'#cdcdcd'}}></View>
            <View style={{flexDirection:'row', marginVertical:20}}>
              <View>
                <Icon
                name='location-on'
                type='materialicons'
                size={22}
                color='#454545'/>
              </View>
              <View style={{marginLeft:10, marginTop:2}}>
                <Text style={styles.activityTitle}>Bangkok, Thailand</Text>
              </View>
            </View>
            <View style={{height:1, backgroundColor:'#cdcdcd'}}></View>

          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    paddingTop:60,
    backgroundColor: '#fff',
  },
  categoryTitle :{
    fontWeight:'bold',
    fontSize:26,
    color:'#454545'
  },
   activityTitle: {
    fontWeight:'bold',
    fontSize:15,
    color:'#454545',
  },
  searchInput: {
    height: 45,
    paddingLeft:15,
    paddingTop:10,
    paddingBottom:10,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor:'#f5f5f5',
  },
});
