'use strict';

import React from 'react';
import ImageSlider from 'react-native-image-slider';
import MapView from 'react-native-maps';
import Button from 'react-native-button';
import { Slider } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';

export default class Filter extends React.Component {

  static navigationOptions = {
    title: 'Filter',
    headerStyle: {
      // backgroundColor: 'transparent',
      position: 'absolute',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0
    },
  };

  constructor (props) {
    super(props)
    this.state = {
      checked: false,
    };
  }

  

  render() {
    return (
      <View style={styles.container}>

        <ScrollView style={{marginTop:60,}}>
          <View>
            <Text>Kisaran harga</Text>
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
              <Slider
                thumbTintColor={'blue'}
                value={this.state.value}
                onValueChange={(value) => this.setState({value})} />
              <Text>Value: {this.state.value}</Text>
            </View>
            <View style={styles.divider}/>
            <Text>Berapa Lama</Text>
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
              <Slider
                value={this.state.value}
                onValueChange={(value) => this.setState({value})} />
              <Text>Value: {this.state.value}</Text>
            </View>
            <View style={styles.divider}/>
            <Text>Kategori</Text>
            <View style={styles.divider}/>
            <View style={{flexDirection: 'row'}}>
              <Text style={{}}>Food Scene</Text>
              <View style={{alignItems: 'flex-end', flex:1,}}>
                <CheckBox iconRight style={{backgroundColor:'#ffffff', paddingRight:0,}} checked={this.state.checked} />
              </View>
            </View>
            <View style={styles.divider}/>
            <View style={{flexDirection: 'row'}}>
              <Text style={{}}>Food Scene</Text>
              <View style={{alignItems: 'flex-end', flex:1,}}>
                <CheckBox iconRight style={{backgroundColor:'#ffffff', paddingRight:0,}} checked={this.state.checked} />
              </View>
            </View>
            <View style={styles.divider}/>
            <View style={{flexDirection: 'row'}}>
              <Text style={{}}>Food Scene</Text>
              <View style={{alignItems: 'flex-end', flex:1,}}>
                <CheckBox iconRight style={{backgroundColor:'#ffffff', paddingRight:0,}} checked={this.state.checked} />
              </View>
            </View>
            <View style={styles.divider}/>


            <Button
              containerStyle={{height:35, flex:1, paddingTop:10, paddingBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#437ef7'}}
              style={{fontSize: 12, color: '#ffffff'}}
              // onPress={() => this._handlePress()}
              onPress={() => this.props.navigation.navigate(
                'CalendarPicker'//, { list: response.activityList}
              )}
            >
              Filter
            </Button>
          </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    paddingBottom:40,
    backgroundColor: '#fff',
    flex:1,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 15,
    marginBottom: 15,
  },
});
