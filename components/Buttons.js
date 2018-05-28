'use strict';

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';


export const WideCTAButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={[{ alignItems: 'center', width: '100%', marginTop: 20 },{...props.style}]}
    activeOpacity={0.6}
    disabled={props.disabled || false}
    styleDisabled={{ opacity: .7 }}
  >
    <LinearGradient
      colors={['#00d3c5', '#35eac6', '#6affc6']}
      start={[0, 0]}
      end={[1, 0]}
      style={{ height: 45, paddingTop: 11, alignItems: 'center', borderRadius: 25, width: '100%' }}>
      <Text style={[{
        backgroundColor: 'transparent',
        fontFamily: 'HindSemiBold',
        fontSize: 18,
        color: '#fff',
      },{...props.textStyle}]}>
        {props.text}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
)
