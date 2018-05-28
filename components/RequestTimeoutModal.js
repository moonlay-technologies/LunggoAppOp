'use strict';

import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Button from 'react-native-button';
import Modal from './Modal';
import globalStyles from './globalStyles';

export default function RequestTimeoutModal (props) {
  let modal = {};
  // const openModal = () => modal.openModal();
  const closeModal = () => modal.closeModal();
  return (
    <Modal ref={ e => modal = e } {...props} style={{...props.style}}>
      <View style={{ paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }}>
          <Text style={styles.h6}>
            Terdapat gangguan pada koneksi internet!
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Button
              containerStyle={globalStyles.ctaButton2}
              style={{ fontSize: 14, color: '#fff', fontFamily: 'Hind', }}
              onPress={closeModal}>
              OK
            </Button>
          </View>
          {/*<View>
            <Button
              containerStyle={globalStyles.ctaButton3}
              style={{ fontSize: 14, color: '#ff5f5f', fontFamily: 'Hind', }}
              onPress={tryAgain}>
              Coba lagi
            </Button>
          </View>*/}
        </View>
    </Modal>
  );
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