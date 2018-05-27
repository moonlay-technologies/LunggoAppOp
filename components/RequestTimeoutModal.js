'use strict';

import React from 'react';
import { Text } from 'react-native';
import Modal from './Modal';

export default function RequestTimeoutModal (props) {
  return (
    <Modal {...props} style={{
      alignItems:'center',
      paddingVertical: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      width:'80%',
      ...props.style
    }}>
      <Text>Terdapat masalah pada jaringan internet!</Text>
    </Modal>
  );
}