'use strict';

import React from 'react';
import { View, NetInfo } from 'react-native';
import OfflineNotificationBar
  from '../commons/components/OfflineNotificationBar';
import ConnectionModals, { checkConnection }
  from '../commons/components/ConnectionModals';

const hasBeenHandledMessage =
  `Connection error, has been handled by withConnectivityHandler()`;

export default function withConnectivityHandler(WrappedComponent, customModifiers={}) {
  class withConnectivityHandler extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        connectionStatus: '',
      };
      const defaultModifiers = {
        hasOfflineNotificationBar: true,
      }
      this.modifiers = { ...defaultModifiers, ...customModifiers };
    }
    
    static navigationOptions = WrappedComponent.navigationOptions

    withConnectivityHandler = async (fn, shouldThrowOnConnectionError) => {
      if (!await NetInfo.isConnected.fetch()) {
        if (shouldThrowOnConnectionError) throw 'CONNECTION_OFFLINE';
        this.showOfflineModal();
        throw hasBeenHandledMessage;
      }
      this.showLoadingModal();
      const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 10000, 'REQUEST_TIMED_OUT');
      });
      return Promise
        .race([ timeout, fn() ])
        .then( res => { this.hideModal(); return res} )
        .catch(err => {
          this.hideModal()
          if (err === 'REQUEST_TIMED_OUT') {
            if (shouldThrowOnConnectionError) throw err;
            this.showTimeoutModal();
            throw hasBeenHandledMessage;
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
          { this.modifiers.hasOfflineNotificationBar && <OfflineNotificationBar /> }
          <WrappedComponent
            withConnectivityHandler={this.withConnectivityHandler}
            {...this.props}
          />
        </View>
      );
    }
  }
  withConnectivityHandler.displayName = `withConnectivityHandler(${getDisplayName(WrappedComponent)})`;
  return withConnectivityHandler;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}