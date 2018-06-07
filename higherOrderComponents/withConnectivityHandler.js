'use strict';

import React from 'react';
import { View, NetInfo } from 'react-native';
import OfflineNotificationBar
  from '../components/OfflineNotificationBar';
import ConnectionModals, { checkConnection }
  from '../components/ConnectionModals';

const hasBeenHandledMessage =
  `Terdapat gangguan pada koneksi internet!`;

export default function withConnectivityHandler(WrappedComponent) {
  class withConnectivityHandler extends React.Component {
    constructor() {
      super();
      this.state = {
        connectionStatus: '',
      };
    }
    
    static navigationOptions = WrappedComponent.navigationOptions;

    defaultAlertOptions = {
      hasOfflineNotificationBar: true,
      // withModal: true,
      shouldThrowOnConnectionError: false,
    };
    alertOptions = {
      ...this.defaultAlertOptions,
      ...WrappedComponent.alertOptions,
    };

    withConnHandler = async (fn, options={}) => {
      const {
        shouldThrowOnConnectionError = false,
        withModal = true,
      } = options;
      //// await 0 sec to make sure NetInfo.isConnected.fetch() works
      //// bug from isConnected.fetch(), dunno why
      await new Promise( resolve => setImmediate(resolve) );
      if (!await NetInfo.isConnected.fetch()) {
        if (shouldThrowOnConnectionError)
          throw 'CONNECTION_OFFLINE';
        withModal && this.showOfflineModal();
        throw hasBeenHandledMessage;
      }
      withModal && this.showLoadingModal();
      const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 10000, 'REQUEST_TIMED_OUT');
      });
      return Promise
        .race([ timeout, fn() ])
        .then( res => { withModal && this.hideModal(); return res} )
        .catch(err => {
          withModal && this.hideModal();
          if (err === 'REQUEST_TIMED_OUT') {
            if (shouldThrowOnConnectionError) throw err;
            withModal && this.showTimeoutModal();
            throw hasBeenHandledMessage;
          } else if ( err == 'ERRGEN99' ) {
            //
            throw err;
          }
          else throw err;
        });
    }

    showLoadingModal = () => this.setState({connectionStatus: 'loading'})
    showOfflineModal = () => this.setState({connectionStatus: 'offline'})
    showTimeoutModal = () => this.setState({connectionStatus: 'timeout'})
    hideModal = () => this.setState({connectionStatus: ''})

    render() {
      return (
        <View style={{ flex:1 }}>
          <ConnectionModals
            connectionStatus={this.state.connectionStatus}
            isVisible={true}
            {...this.props}
          />
          {
            this.alertOptions.hasOfflineNotificationBar &&
            <OfflineNotificationBar />
          }
          <WrappedComponent
            withConnHandler={this.withConnHandler}
            {...this.props}
          />
        </View>
      );
    }
  }

  withConnectivityHandler.displayName = 
    `withConnectivityHandler(${getDisplayName(WrappedComponent)})`;

  return withConnectivityHandler;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component';
}