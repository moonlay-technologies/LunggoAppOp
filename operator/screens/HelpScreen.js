'use strict';

import React, { Component } from 'react';
import { WebView, TouchableOpacity } from 'react-native';
import { clientId, clientSecret } from '../../constants/env';
import { NavigationActions } from 'react-navigation';
import { DOMAIN } from '../../constants/env';
import { Icon } from 'react-native-elements';

export default class EditDetailActivity extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Bantuan',
  })

  render() {
    let text = 'Butuh bantuan';
    return (
      <WebView
        startInLoadingState={true}
        source={{
          uri: DOMAIN + '/id/webview/redirectcontact?text=' + text,
          // uri: DOMAIN + '/id/payment/cartcheckout',
          // '/id/payment/payment?rsvno=' + rsvNo +
          // '&regid=' + encodeURIComponent(Base64.stringify( SHA1(rsvNo) )),
          headers: {
            "X-Client-ID": clientId,
            "X-Client-Secret": clientSecret
          }
        }}
      />
    );
  }
}
