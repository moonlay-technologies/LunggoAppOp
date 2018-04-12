'use strict';

import React from 'react';
import { WebView, TouchableOpacity } from 'react-native';
import { clientId, clientSecret } from '../../constants/env';
import { DOMAIN } from '../../constants/env';
import { Icon } from 'react-native-elements';

export default class PaymentScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.title
    }
  }

  render() {
    return (
      <WebView
        startInLoadingState={true}
        source={{
          uri: this.props.navigation.state.params.url,
          headers: {
            "X-Client-ID": clientId,
            "X-Client-Secret": clientSecret
          }
        }}
        onMessage={this._onMessage}
      />
    );
  }
}
