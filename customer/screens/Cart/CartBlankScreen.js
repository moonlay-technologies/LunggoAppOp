'use strict';

import React from 'react';
import Button from 'react-native-button';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity,
} from 'react-native';
import globalStyles from '../../../commons/globalStyles';

export default class CartBlankScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Cart',
  };
  state = {open: false};


  render() {
    return (
        <View style={styles.container}>
          <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
            <Image style={{width:180, height:180, resizeMode:'contain'}} source={require('../../assets/images/cart1.jpg')}/>
            <View style={{marginTop:20, justifyContent:'center', alignItems:'center',}}>
              <Text style={styles.textCartBesar}>Keranjang kamu kosong</Text>
              <View>
                <Text style={styles.textCart}>Semua pesanan kamu akan masuk keranjang. {"\n"}Ayo mulai mencari dan jelajahi dunia!</Text>
              </View>
            </View>
            <View style={{width:'100%', marginTop:30}}>
              <Button
                  containerStyle={globalStyles.ctaButton}
                  style={{fontSize: 16, color: '#fff', fontWeight:'bold'}}
                  onPress={() => this.props.navigation.goBack()}
                >
                  Jelajah Sekarang
              </Button>
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    backgroundColor: '#fff',
    flex:1,
  },
  textCartBesar: {
    fontFamily: 'Hind-Bold', 
    color:'#454545', 
    fontSize:19,
    ...Platform.select({
      ios: {
        lineHeight:25,
        paddingTop:0,
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
    color:'#454545', 
    fontSize:14,
    textAlign:'center',
    ...Platform.select({
      ios: {
        lineHeight:12,
        paddingTop:4,
        marginBottom:-5,
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
