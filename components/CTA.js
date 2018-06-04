'use strict';

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';


export default class CTA extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button
          containerStyle={styles.ctaPrimary}
          style={styles.ctaTextPrimary}
          // onPress={this._onCtaButtonClick}
          // disabled={!_isDateAvailable}
          styleDisabled={{ color: '#aaa' }}
        >
          Masuk
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ctaPrimary:{
    backgroundColor:Colors.primary,
    height:45,
    borderRadius:5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2
      },
      android: {
      },
    }),
  },
  ctaTextPrimary:{
    fontSize: 16, 
    color: '#fff', 
    fontWeight: 'bold', 
    marginTop: 12 
  },
})