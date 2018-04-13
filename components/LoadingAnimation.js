'use strict';

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default class LoadingAnimation extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{
            height: this.props.height || 100,
            width: this.props.width || 100
          }}
          source={require('../assets/images/loader1.gif')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
