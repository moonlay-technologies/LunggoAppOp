'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class LoginScreen extends Component<{}> {
  constructor(props, context) {
    super(props, context);
  }
  _handlePress() {
    console.log('Pressed!');
  }
  render() {
    return (
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor:'#ffffff'}}>
        <Button
          containerStyle={{ marginRight:10, height:40, width:120, paddingTop:10, paddingBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#437ef7'}}
          style={{fontSize: 14, color: '#ffffff'}}
          onPress={() => this._handlePress()}>
          Mulai Diskusi
        </Button>
        <Button
          containerStyle={{ height:40, width:120, paddingTop:10, paddingBottom:10, overflow:'hidden', borderRadius:4, borderWidth: 1,
          borderColor: '#cdcdcd',backgroundColor: '#ffffff'}}
          style={{fontSize: 14, color: '#353535'}}
          onPress={() => this._handlePress()}>
          Lihat Faq
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    backgroundColor: '#fff',
  },
});
