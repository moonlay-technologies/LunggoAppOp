'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView,
} from 'react-native';
import globalStyles from '../../commons/globalStyles';
import Modal from './Modal';
import { NavigationActions } from 'react-navigation';
import LoadingAnimation from './../../customer/components/LoadingAnimation';

export default class LoadingModal extends React.Component {

  render() {
    return (
      <Modal
        onBackdropPress={ () => {} }
        onBackButtonPress={ () => {} }
        {...this.props}
      >
        <View style={{ marginHorizontal: 50, paddingHorizontal: 30, paddingVertical: 30, backgroundColor: '#fff', flexDirection: 'row', }}>
          <View style={{ height: 50, }}>
            <LoadingAnimation width={70} height={70} />
          </View>
          <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Text>Mohon tunggu...</Text>
          </View>
        </View>
      </Modal>
    )
  }
}