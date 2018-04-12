'use strict';

import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default class MapScreen extends React.Component {

  static navigationOptions = props => {
    return {title: props.navigation.state.params.name || ''
    // headerStyle: {
    //   backgroundColor: 'transparent',
    //   position: 'absolute',
    //   zIndex: 100,
    //   top: 0,
    //   left: 0,
    //   right: 0
    // },
  }}

  render() {
    let {address, city, lat, long} = this.props.navigation.state.params;
    return (
      <MapView
        style={{width:"100%", height:"100%"}}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: long }}
          title={address}
          description={city}
        />
      </MapView>
    );
  }
}
