'use strict';

import React from 'react';
import { Text, View } from 'react-native';
import Modal from './Modal';
import LoadingAnimation from './../components/LoadingAnimation';

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