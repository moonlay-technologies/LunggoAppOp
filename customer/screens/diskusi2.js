'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class LoginScreen extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
          <Text style={{fontWeight:'bold'}}>Jane Doe {"\n"}<Text style={{fontSize:10, fontWeight:'normal'}}>3 maret 2017</Text></Text>
        </View>
        <Text style={styles.isireview}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et
        </Text>
        <Text style={styles.hyperlink}>
          Reply
        </Text>
        <View style={styles.reviewreply}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
            <Text style={{fontWeight:'bold'}}>Jane Doe {"\n"}<Text style={{fontSize:10, fontWeight:'normal'}}>3 maret 2017</Text></Text>
          </View>
          <Text style={styles.isireview}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et
          </Text>
          <Text style={styles.hyperlink}>
            Reply
          </Text>
        </View>{/* end reviewreply */}
        <View style={styles.reviewreply}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.thumbprofile} source={require('../assets/images/poto-profile.jpg')}/>
            <Text style={{fontWeight:'bold'}}>Jane Doe {"\n"}<Text style={{fontSize:10, fontWeight:'normal'}}>3 maret 2017</Text></Text>
          </View>
          <Text style={styles.isireview}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et
          </Text>
          <Text style={styles.hyperlink}>
            Reply
          </Text>
        </View>{/* end reviewreply */}
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
  reviewreply: {
    marginLeft:20,
    marginTop:25,
  },
   thumbprofile: {
    height: 30,
    width:30,
    borderRadius: 15,
    marginRight: 10,
  },
  hyperlink: {
    fontSize:11,
    marginTop:5,
    color:'#437ef7',
    textDecorationLine: 'underline'
  },
  isireview: {
    fontSize:11,
    marginTop:10,
  },
});
