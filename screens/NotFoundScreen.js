'use strict';

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Button from 'react-native-button';

export default class NotFoundScreen extends React.Component {

  static navigationOptions = {
    title: 'NOT FOUND',
  };

  render() {
    return (

      <View style={{flex:1,/* alignItems:'center',*/ justifyContent:'center', backgroundColor:'red'}}>
        <Text style={styles.h1}>ERROR 404 SCREEN NOT FOUND</Text>
      <Button
        onPress={()=>this.props.navigation.goBack()}
        style={styles.goBackButton}
      >
        Go Back
      </Button>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  h1: {
    fontWeight: 'bold',
    textAlign:'center',
    fontSize: 35,
    color: 'white',
  },
  goBackButton: {
    marginTop:30,
    padding:10,
    backgroundColor:'white',
    fontSize:20,
    color: '#454545',
  }
});