'use strict';

import React from 'react';
import {
  Platform, StyleSheet, Text, View, Image, RefreshControl,
  TextInput, ScrollView, TouchableHighlight, FlatList,
} from 'react-native';
import Moment from 'moment';
import 'moment/locale/id';
import { Icon } from 'react-native-elements';
import { getAppointmentList } from './Appointments/AppointmentController';

class ListItem extends React.PureComponent {

  _onPress = () => this.props.onPressItem(this.props.item);

  render() {
    const {item} = this.props;
    item.totalPax = item.reservations.reduce( (total, rsv) => {
      // if (rsv.paxes.length > 0) return total + rsv.paxes.length;
      // else
      return total + rsv.paxCount.reduce( (total2,paxType) => {
        return total2 + paxType.count;
      }, 0);
    }, 0);

    return (
      <View style={{flex:1,}}>

        <TouchableHighlight
          onPress={this._onPress}
          underlayColor='#ddd'
        >
        <View style={styles.containerListAppointment}>

          <View style={{flex:0.8, alignItems:'flex-start'}}>
            <View style={{}}>
              <Icon
              name='calendar'
              type='evilicon'
              size={34}
              color='#454545'/>
            </View>
          </View>

          <View style={{flex:3}}>
            <Text style={styles.activityTitle}>{item.name}</Text>
            <Text style={[styles.timeActivity,{marginTop:7}]}>{item.totalPax} Guest</Text>
            <View style={{width:'100%', marginTop:5, flexDirection:'row',}}>
              <View style={{ flexDirection:'row', marginRight:10 }}>
                <Text style={styles.timeActivity}>
                  {Moment(item.date).format('ddd, D MMM YYYY')}
                </Text>
              </View>
              <View style={{ flexDirection:'row' }}>
                <Text style={styles.timeActivity}>
                  {item.session}
                </Text>
              </View>
            </View>
            <View style={{marginTop:5,}}>
              <Text style={styles.status}>
                {Moment(item.date).fromNow()}
              </Text>
            </View>
          </View>

          <View style={{flex:1}}>
            <View style={{marginTop:10, alignItems:'flex-end'}}>
              <Icon
                name='chevron-thin-right'
                type='entypo'
                size={26}
                color='#707070'
              />
            </View>
          </View> 

        </View>

        </TouchableHighlight>

        <View style={styles.divider}></View>

      </View>
    );
  }
}

export default class AppointmentList extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      list: this.props.navigation.state.params.list,
      isLoading: false,
    };
  }

  static navigationOptions = {
    title: 'Pesanan Terjadwal',
  }

  _refreshList = () => {
    this.setState({isLoading:true})
    getAppointmentList().then( r =>
      this.setState({ list: r.appointments })
    ).catch(e  => console.warn(e))
    .finally( () => this.setState({isLoading:false}))
  }

  _keyExtractor = (item, index) => index
  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  )

  _onPressItem = (item) => {
    this.props.navigation.navigate(
      'AppointmentDetail',{details: item}
    );
  }

  _refreshCtrl = () =>
    <RefreshControl onRefresh={this._refreshList} refreshing={this.state.isLoading} />

  render() {
    let {list} = this.state;
    return (
      ( list && list.length > 0 ) ?
        <View style={{ backgroundColor: '#fff'}}>
          <FlatList
            style={{paddingTop:15}}
            data={list}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={<this._refreshCtrl />}
          />
        </View>
      :
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          refreshControl={<this._refreshCtrl/>}
        >
          <Text>Anda belum memiliki pesanan terjadwal</Text>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointment: {
    padding:10,
    flexDirection: 'row',
    flex:1
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontWeight:'bold',
    fontSize:16,
    color:'#454545',
  },
  icon: {
    width:15,
    height:15,
    marginRight:3,
  },
  status: {
    color:'#ff7f00',
    fontSize:13,
    fontStyle:'italic'
  },
  timeActivity: {
    fontSize:14,
    color:'#454545',
  },

});
