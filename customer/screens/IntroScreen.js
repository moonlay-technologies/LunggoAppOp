'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';
import globalStyles from '../../commons/globalStyles';
import Colors from '../../constants/Colors';
import BeforeLoginScreen from '../../commons/Auth/screens/BeforeLoginScreen'

export default class IntroScreen extends Component {

  constructor() {
    super();
    this.state = { notLastScreen: true, dot: this.Dot, activeDot: this.ActiveDot };
  }

  static navigationOptions = {
    header: null
  };

  ActiveDot =
    <View style={{
      backgroundColor: '#01aebc',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    }} />
  Dot =
    <View style={{
      backgroundColor: 'rgba(0,0,0,.2)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    }} />

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.notLastScreen && (
          <TouchableOpacity style={styles.containerLeft} onPress={() => this.props.navigation.replace('Main')}>
            <Text style={{ color: '#01aebc', fontFamily: 'Hind' }}>Lewati</Text>
          </TouchableOpacity>
        )}
        {this.state.notLastScreen && (
          <TouchableOpacity style={styles.containerRight} onPress={() => this.swiper.scrollBy(1)}>
            <Text style={{ color: '#01aebc', fontFamily: 'Hind' }}>Berikutnya</Text>
          </TouchableOpacity>
        )}
        <Swiper
          ref={ref => { this.swiper = ref }}
          style={styles.wrapper}
          activeDot={this.state.activeDot}
          dot={this.state.dot}
          showsButtons={false}
          loop={false}
          onIndexChanged={
            index => index == 3 ?
              this.setState({ notLastScreen: false, dot: <View />, activeDot: <View /> }) :
              this.setState({ notLastScreen: true, dot: this.Dot, activeDot: this.ActiveDot })}
        >
          <Image style={styles.slides} source={require('../../assets/images/welcome1.jpg')} />
          <Image style={styles.slides} source={require('../../assets/images/welcome2.jpg')} />
          <Image style={styles.slides} source={require('../../assets/images/welcome3.jpg')} />
          <BeforeLoginScreen {...this.props} onIntro={true} />
        </Swiper>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  slides: {
    flex: 1,
    width: '100%'
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#9DD6EB',
  },
  containerLeft: {
    zIndex: 200,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 20,
    ...Platform.select({
      ios: {
        bottom: 15,
      },
      android: {
        bottom: 20,
      },
    }),
  },
  containerRight: {
    zIndex: 200,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    ...Platform.select({
      ios: {
        bottom: 15,
      },
      android: {
        bottom: 20,
      },
    }),
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#23d3c3',
  },
});
