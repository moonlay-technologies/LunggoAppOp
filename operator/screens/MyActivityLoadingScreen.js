'use strict';

import React from 'react';
import { ActivityIndicator, Text, RefreshControl } from 'react-native';
import {fetchTravoramaApi,AUTH_LEVEL} from '../../api/Common';
import ListScreen from './ActivityList';
import LoadingAnimation from '../../customer/components/LoadingAnimation';
import { getActivityList } from './ActivityController';


export default class ActivityListLoadingScreen extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      list: [],
      isLoading: true,
    };
  }

  static navigationOptions = {
    title: 'Aktivitasku',
  };

  componentDidMount() {
    getActivityList().then( res => {
      this.setState({list:res.activityList})
    }).catch( e => console.warn(e))
      .finally( () => this.setState({isLoading:false}));
  }

  _refreshCtrl = () =>
    <RefreshControl onRefresh={this._refreshList} refreshing={this.state.isLoading} />

  render() {
    let { isLoading, list } = this.state;
    let { props } = this;
    if (isLoading) { return <LoadingAnimation /> }
    else if (!list) { return <Text>ERROR: Internal Error (in Booking List)</Text> }
    else if (list.length > 0) {
      return <ListScreen list={list} refreshControl={<this._refreshCtrl/>} {...props}/>
    } else { return
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        refreshControl={<this._refreshCtrl/>}
      >
        <Text>Belum ada aktivitas Anda yang terdaftar</Text>
      </ScrollView>
    }
  }

}
