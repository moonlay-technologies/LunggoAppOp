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
      // shouldThrowOnConnectionError: false,
    };
    alertOptions = {
      ...this.defaultAlertOptions,
      ...WrappedComponent.alertOptions,
    };


    /***===== withConnHandler =====***
      handlingType:
        modal   : show modal on loading, no connection, or timeout
        bar     : only show connection error, in notification bar
        content : any loading and connection error state shown in
                  caller's screen
    ***/
    withConnHandler = async (fn, handlingType = 'modal') => {
      const withModal = handlingType == 'modal';
      //// await 0 sec to make sure NetInfo.isConnected.fetch() works
      //// bug from isConnected.fetch(), dunno why
      await new Promise( resolve => setImmediate(resolve) );
      if (!await NetInfo.isConnected.fetch()) {
        this._handleConnectionError('CONNECTION_OFFLINE', handlingType);
      }
      withModal && this.setModal('loading');
      const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 10000, 'REQUEST_TIMED_OUT');
      });
      return Promise
        .race([ timeout, fn() ])
        .then( res => { withModal && this.setModal(''); return res} )
        .catch(err => {
          withModal && this.setModal('');
          if (err === 'REQUEST_TIMED_OUT') {
            this._handleConnectionError(err, handlingType);
          } else if ( err === 'ERRGEN99' ) {
            console.warn(err);
            throw err;
          }
          else throw err;
        });
    }

    _handleConnectionError = (err, handlingType) => {
      if (handlingType == 'content') throw err;
      else if (handlingType == 'bar')
        this.bar.forceShowNotification(err);
      else {
        withModal && this.setModal(err);
        throw hasBeenHandledMessage;
      }
    }

    setModal = code => this.setState({connectionStatus: code})

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
            <OfflineNotificationBar ref={ e => this.bar = e } />
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