'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView,
} from 'react-native';
import globalStyles from '../components/globalStyles';
import Modal from './Modal';
import { logout } from '../screens/Auth/AuthController';
import { backToMain } from '../api/Common';
import { NavigationActions } from 'react-navigation';
import { purgeProfile } from '../logic/ProfileController';
import { deletePushNotificationAsync } from '../api/NotificationController';

export default class LogoutConfirmationModal extends React.Component {

  _logout = () => {
    logout().then(() => {
      purgeProfile();
      deletePushNotificationAsync();
      backToMain(this.props.navigation);
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
    fontFamily: 'HindLight',
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