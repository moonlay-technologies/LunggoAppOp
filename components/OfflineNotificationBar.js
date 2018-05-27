'use strict';

import React from 'react';
import { StyleSheet, View, Text, NetInfo, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default class OfflineNotificationBar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
    };
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(this._handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
    );
  }
  
  _handleConnectivityChange = isConnected =>
    setTimeout(
      () => this.setState({showNotification: !isConnected})
    , 300)

  _onClose = () => this.setState({showNotification: false})

  render() {
    return ( this.state.showNotification &&
      <View style={styles.offlineState}>
        <Text style={{color:'#fff'}}>
          <Text style={{color:'#fff', fontWeight:'bold'}}>Error! </Text>
          Terputus dari jaringan
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