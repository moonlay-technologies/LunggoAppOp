'use strict';

import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput,
  ScrollView, FlatList, TouchableHighlight } from 'react-native';
import * as Formatter from '../../customer/components/Formatter';

class ListItem extends React.PureComponent {

  _onPress = () => this.props.onPressItem(this.props.item);
  
  render() {
    const {item, index} = this.props;
    return (
      <View key={index} style={{flex:1}}>
        <TouchableHighlight
          onPress={this._onPress}
          underlayColor='#ddd'
        >
          <View style={{marginBottom:30}}>
            <View style={styles.shadow}>
              <Image style={styles.bigThumb}
                source={{uri:item.mediaSrc}}/>
            </View>
            <View style={{marginTop:10}}>
              <Text style={styles.activityTitle}>
                {item.name}
              </Text>
              <Text>{ Formatter.price(item.price) }</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default class ActivityList extends React.Component {

  _keyExtractor = (item, index) => index
  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  )

  _onPressItem = (item) => {
    this.props.navigation.navigate('DetailScreen', {details: item});
  }

  render() {
    return (
      <View style={styles.containerListAppointment}>
        <FlatList
          data={this.props.list}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshControl={this.props.refreshControl}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointment: {
    padding:10,
    flexDirection: 'row',
    flex:1,
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 15,
    marginBottom: 15,
  },
  activityTitle: {
    fontSize:16,
    marginBottom: 3,
    fontWeight:'bold'
  },
  bigThumb: {
    width:'100%',
    height:200,
    resizeMode: 'cover',
    borderRadius:5,
  },
  shadow: {
    shadowOffset:{  width: 1,  height: 1,  },
    shadowRadius:5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    backgroundColor:'transparent',
    elevation:2,
  },
  status: {
    color:'green',
    fontSize:12,
  },
  icon: {
    width:15,
    height:15,
    marginRight:3,
  },
  timeActivity: {
    fontSize:12,
  },
});
