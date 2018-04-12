'use strict';

import React from 'react';
import { StyleSheet, View, Text, NetInfo, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default class OfflineNotificationBar extends React.Component {
  state = {
    isConnected: null,
    isClosed: false,
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        isConnected => { this.setState({isConnected}); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
    );
  }

  componentWillReceiveProps({isClosed}) {
    this.setState({isClosed});
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  }

  _onClose = () => this.setState({isClosed: true})

  render() {
    return ( !this.state.isConnected && !this.state.isClosed &&
    	<View style={styles.offlineState}>
        <Text style={{color:'#454545'}}>
          <Text style={{color:'#f57b76'}}>Error! </Text>
          Terputus dari jaringan
        </Text>
        <TouchableOpacity onPress={this._onClose}>
          <Icon
            style={{ width: 45, alignItems: 'center', }}
            name='md-close'
            type='ionicon'
            size={26}
            color='#00D3C5'
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  offlineState: {
    backgroundColor:'#fff',
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
  },
});