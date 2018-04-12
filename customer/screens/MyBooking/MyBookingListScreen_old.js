'use strict';

import React from 'react';
import Button from 'react-native-button';
import { Platform, StyleSheet, FlatList, RefreshControl, Text, View,
  Image, TextInput, ScrollView, TouchableHighlight,
} from 'react-native';
import { getMyBookingList } from './MyBookingController';
import { Icon } from 'react-native-elements';
import * as Formatter from '../../components/Formatter';

class ListItem extends React.PureComponent {

  _onPress = () => this.props.onPressItem(this.props.item);
  render() {
    const {item} = this.props;
    let bookingStatusText = 'booking status';
    switch (item.bookingStatus) {
      case 'PROC' : bookingStatusText = 'On Progress'; break;
    }
    return (
      <View key={item.rsvNo}>
        <View style={styles.divider}></View>
        <TouchableHighlight
          onPress={this._onPress}
          underlayColor='#ddd'
        >
          <View style={styles.containerBooking}>
            <Image source={{uri: item.mediaSrc}} style={{
              flex: 1.8,
              resizeMode: 'cover',
              width: '100%',
              height: 100,
              borderRadius:5,
            }}/>
            <View style={{
              flex:3,
              marginRight: '10%',
              marginLeft: '5%',
            }}>
              <Text style={styles.activityTitle}>
                {item.name}
              </Text>
              <Text style={styles.status}>
                {bookingStatusText}
              </Text>
              <View style={{
                marginTop: 10,
                marginBottom: 5,
                width: '100%',
                flexDirection:'row',
              }}>
                <View style={{ flexDirection:'row', marginRight:10 }}>
                  <Icon
                    name='person'
                    type='materialicons'
                    size={16}
                    color='#454545'
                  />
                  <View style={{marginTop:1, marginLeft:5}}>
                    <Text style={{fontSize:12}}>
                      {item.paxCount} orang
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection:'row', marginRight:10 }}>
                <Icon
                  name='event'
                  type='materialicons'
                  size={16}
                  color='#454545'
                />
                <View style={{marginTop:1, marginLeft:5}}>
                  <Text style={{fontSize:12}}>
                    {Formatter.dateFullShort(item.date)}
                  </Text>
                </View>
              </View>

            </View> 
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default class MyBookingListScreen extends React.Component {

  static navigationOptions = {
    title: 'Pesananku',
  };

  constructor (props) {
    super(props)
    this.state = {
      bookingList: props.list,
      isRefreshing:false
    };
  }

  _keyExtractor = (item, index) => index;
  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );
  _onPressItem = (item) => {
    this.props.navigation.navigate(
      'BookedPageDetail',{details: item}
    );
  };
  _onRefresh = () => {
    this.setState({isRefreshing: true});
    getMyBookingList().then( () => {
      this.setState({isRefreshing: false});
    });
  }

  render() {
    return (
      <ScrollView
        style={{flex:1, backgroundColor: '#fff',}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >

      {/* Tab Button

        <View style={{
          flex:1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:'#fff',
          marginTop:10,
        }}>
          <Button
            containerStyle={{
              marginRight:3,
              height:40, width:120, paddingTop:10, paddingBottom:10,
              overflow:'hidden', borderRadius:4,
              backgroundColor: '#437ef7'
            }}
            style={{fontSize: 14, color: '#ffffff'}}
            onPress={() => this._handlePress()}>
            Active
          </Button>
          <Button
            containerStyle={{ height:40, width:120, paddingTop:10,
              paddingBottom:10, overflow:'hidden', borderRadius:4,
              borderWidth: 1,
              borderColor: '#437ef7',backgroundColor: '#ffffff'
            }}
            style={{fontSize: 14, color: '#437ef7'}}
            onPress={() => this._handlePress()}>
            History 
          </Button>
        </View>
        
      */}

        <View style={{marginBottom:10}}>
          <FlatList
            data={this.state.bookingList}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerBooking: {
    padding:15,
    paddingTop:0,
    paddingBottom:0,
    flexDirection: 'row',
    flex:1
  },
  thumbnailMedium: {
    resizeMode:'cover', 
    width:'100%', 
    height:100, 
    borderRadius:5,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 15,
    marginBottom: 15,
  },
  activityTitle: {
    fontWeight:'bold',
    fontSize:15,
    color:'#454545',
  },
  status: {
    color:'#01d4cb',
    fontSize:12,
  },
  icon: {
    width:15,
    height:15,
    marginRight:3,
  },
  timeActivity: {
    fontSize:12,
    color:'#676767',
  },
});
