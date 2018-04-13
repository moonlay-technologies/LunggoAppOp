'use strict';

import React from 'react';
import { View, TouchableOpacity, } from 'react-native';
import { MultilineText } from './StyledText'
import MapView, { Marker } from 'react-native-maps';

export default class Maps extends React.Component {

  _enlargeMapView = () => {
    let { name, address, city, lat, long } = this.props;
    this.props.navigation.navigate('MapScreen',
      { name, address, city, lat, long }
    );
  }

  render() {
    let { name, address, city, lat, long } = this.props;
    return (
      <View style={{flex: 1,paddingVertical: 20}}>
        <TouchableOpacity onPress={this._enlargeMapView}>
          <MapView
            style={{ width: "100%", height: 150 }}
            region={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            zoomEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
          >
            <Marker
              coordinate={{ latitude: lat, longitude: long }}
              title={address}
              description={city}
              ref={marker => (this.marker = marker)}
            />
          </MapView>
        </TouchableOpacity>
        <MultilineText>
          {address}
        </MultilineText>
      </View>
    )
  }
}
