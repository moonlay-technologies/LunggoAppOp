'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView,
} from 'react-native';
import globalStyles from '../../commons/globalStyles';
import Modal from './Modal';
import { logout } from '../../commons/Auth/AuthController';
import { backToMain } from '../../api/Common';
import { APP_TYPE } from '../../constants/env';
import { NavigationActions } from 'react-navigation';
import { purgeMyBookingList } from '../../customer/screens/MyBooking/MyBookingController';
import { purgeProfile } from '../ProfileController';

export default class LogoutConfirmationModal extends React.Component {

  _logout = () => {
    logout().then(() => {
      purgeMyBookingList();
      purgeProfile();
      if (APP_TYPE != 'OPERATOR') {
        backToMain(this.props.navigation);
      }
      else {
        let { reset, navigate } = NavigationActions;
        const action = reset({
          index: 0,
          actions: [navigate({ routeName: 'LoginScreen', params: { appType: 'OPERATOR' } })],
        });
        this.props.navigation.dispatch(action);
      }
    });
  }

  openModal = () => this.refs.modal.openModal()
  closeModal = () => this.refs.modal.closeModal()

  render() {
    return (
      <Modal ref='modal'>
        <View style={{ paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }}>
          <Text style={styles.h6}>
            Apakah kamu yakin mau log out?
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Button
              containerStyle={globalStyles.ctaButton2}
              style={{ fontSize: 14, color: '#fff', fontFamily: 'Hind', }}
              onPress={this.closeModal}>
              Tidak
            </Button>
          </View>
          <View>
            <Button
              containerStyle={globalStyles.ctaButton3}
              style={{ fontSize: 14, color: '#ff5f5f', fontFamily: 'Hind', }}
              onPress={this._logout}>
              Ya
            </Button>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  h6: {
    fontFamily: 'Hind-Light',
    color: '#454545',
    fontSize: 14,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 4,
        marginBottom: -5,
        marginTop: 8
      },
      android: {
        marginTop: 5

      },
    }),
  },
});