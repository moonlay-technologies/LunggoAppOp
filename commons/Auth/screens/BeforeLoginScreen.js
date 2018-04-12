'use strict';

import React from 'react';
import Colors from '../../../constants/Colors';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Button from 'react-native-button';
import globalStyles from '../../../commons/globalStyles';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';

export default class BeforeLoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.params = props.skipIntro ? { thruBeforeLogin: true } : { resetAfter: true };
  }

  static navigationOptions = {
    header: null
  };

  render() {
    let { navigate, goBack } = this.props.navigation;
    return (
      <Image style={styles.bgImg} source={require('../../../assets/images/bglogin2.jpg')}>

        {!!this.props.onIntro || (
          <TouchableOpacity style={{ alignItems: 'flex-start', marginTop: -40 }}
            onPress={() => goBack()}>
            <Icon name='close' type='evilicons' size={24} color='#ffffff' />
          </TouchableOpacity>
        )}

        <View style={{alignItems:'center'}}>
          <Image style={{width:280, height:280, marginTop:80,}} source={require('../../../assets/images/logobaru.png')}/>
        </View>
        <View style={{position:'absolute', bottom:40, alignItems:'center', width:'100%'}}>

          <TouchableOpacity
            onPress={() => navigate('Registration', this.params)} 
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width:'90%'}}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#00d3c5', '#35eac6', '#6affc6']}
              start={[0, 0]}
              end={[1, 0]}
              style={{marginTop: 30, height: 45, paddingTop: 11, alignItems: 'center', borderRadius: 25, width:'100%'}}>
              <Text style={{
                  backgroundColor: 'transparent',
                  fontSize: 18, color: '#ffffff', 
                  fontFamily: 'Hind-SemiBold', 
                }}>
                Daftar
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }}
            onPress={() => navigate('LoginScreen', this.params)}
            activeOpacity={0.7}
            >
            <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'Hind', backgroundColor:'transparent' }}>
              Sudah punya akun? Tap di sini
            </Text>
          </TouchableOpacity>


        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#23d3c3',
  },
  bgImg: {
    resizeMode:'cover', 
    flex:1, 
    width:null, 
    height:null,
  },
});
