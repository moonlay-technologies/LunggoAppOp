'use strict';

import React from 'react';
import { StyleSheet, View, Text, NetInfo, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const MessageTexts = {
  CONNECTION_OFFLINE: 'Terputus dari jaringan',
  REQUEST_TIMED_OUT: 'Jaringan buruk',
}
export default class OfflineNotificationBar extends React.Component {
  
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(this._handleConnectivityChange);
    NetInfo.isConnected.addEventListener(
      'connectionChange', this._handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange', this._handleConnectivityChange
    );
  }
  
  forceShowNotification = errCode =>
    this.setState({ errorMessage: MessageTexts[errCode] })

  _handleConnectivityChange = isOnline =>
    setTimeout( () => this.setState({
      errorMessage: isOnline ? '' : MessageTexts.CONNECTION_OFFLINE,
    }), 300)

  _onClose = () => this.setState({errorMessage: ''})

  render() {
    return ( !!this.state.errorMessage &&
      <View style={styles.offlineState}>
        <Text style={{color:'#fff'}}>
          <Text style={{color:'#fff', fontWeight:'bold'}}>Error! </Text>
          {this.state.errorMessage}
        </Text>
        <TouchableOpacity onPress={this._onClose}>
          <Icon
            style={{ width: 45, alignItems: 'center', }}
            name='md-close'
            type='ionicon'
            size={26}
            color='#fff'
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  offlineState: {
    backgroundColor:'#fd5751',
    justifyContent:'space-between', 
    alignItems:'center', 
    flexDirection:'row', 
    paddingHorizontal:15, 
    position:'absolute', 
    bottom:0, 
    width:'100%', 
    height:60,  
    borderTopColor:'#e1e1e1', 
    borderTopWidth:1,
    zIndex: 999,
  },
});