'use strict';

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo';


export default class Avatar extends React.Component {

  constructor(props) {
    super(props);
    this.bgColor = this._toColor(this.props.name.hashCode());
    let split = this.props.name.split(' ');
    this.initial = split.length == 1
      ? split[0].substring(0, 1).toUpperCase()
      : [split[0], split[split.length - 1]].map(w => w.substring(0, 1).toUpperCase());
    this.state = { hasImage: this.props.source && this.props.source.uri }
  }

  _toColor = num => {
    num >>>= 0;
    var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16;
    return "rgba(" + [r, g, b, 255].join(",") + ")";
  }

  render() {
    if (this.state.hasImage)
      return (
        <Image
          style={[
            this.props.style,
            {
              width: this.props.size,
              height: this.props.size,
              borderRadius: this.props.size / 2,
            }]}
          source={this.props.source}
          onError={() => this.setState({ hasImage: false })}
        />
      );
    else
      return (
        <View
          style={[
            this.props.style,
            {
              width: this.props.size,
              height: this.props.size,
              borderRadius: this.props.size / 2,
              backgroundColor: this.bgColor
            },
            {
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: this.props.size / 2 }}>{this.initial}</Text>
        </View>
      );
  }
}

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};