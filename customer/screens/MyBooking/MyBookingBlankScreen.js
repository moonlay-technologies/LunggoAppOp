'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity,
} from 'react-native';
import globalStyles from '../../../commons/globalStyles';
import { checkUserLoggedIn } from '../../../commons/Auth/AuthController';

export default class MyBookingBlankScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  static navigationOptions = {
    title: 'Pesananku',
  };

  _checkLoggedIn = async () => {
    let isLoggedIn = await checkUserLoggedIn();
    this.setState({ isLoggedIn });
  }

  componentDidMount() {
    this._checkLoggedIn();
  }

  componentWillReceiveProps() {
    this._checkLoggedIn();
  }

  render() {
    let { isLoggedIn } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Image style={{ width: 180, height: 180, resizeMode: 'contain' }}
            source={require('../../assets/images/pesanan.jpg')} />
          <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={styles.textCartBesar}>{isLoggedIn ? 'Belum ada pesanan' : 'Login untuk Melihat Pesanan'}</Text>
            <View>
              <Text style={styles.textCart}>
                Semua pesanan kamu yang sudah dibayarkan akan terdaftar di sini. {"\n"}
                {isLoggedIn ? '' : 'Ayo login sekarang untuk melihat!'}
              </Text>
            </View>
          </View>
          <View style={{ width: '100%', marginTop: 30 }}>
            <Button
              containerStyle={globalStyles.ctaButton}
              style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
              onPress={() => isLoggedIn
                ? this.props.navigation.goBack()
                : this.props.navigation.navigate('LoginScreen', { resetAfter: true })
              }
            >
              {isLoggedIn ? 'Jelajah Sekarang' : 'Login'}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  textCartBesar: {
    fontFamily: 'Hind-Bold',
    color: '#454545',
    fontSize: 19,
    ...Platform.select({
      ios: {
        lineHeight: 25,
        paddingTop: 0,
        //backgroundColor:'red'
      },
      android: {
        //marginTop:30
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  textCart: {
    fontFamily: 'Hind',
    color: '#454545',
    fontSize: 14,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 4,
        marginBottom: -5,
        //backgroundColor:'red'
      },
      android: {
        //marginTop:5
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
});
