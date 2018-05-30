'use strict';

import React from 'react';
import { Text, RefreshControl, ScrollView } from 'react-native';
import ListScreen from './ActivityList';
import LoadingAnimation from '../components/LoadingAnimation';
import { getActivityList } from './ActivityController';


export default class ActivityListLoadingScreen extends React.Component {

  constructor(props) {
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
    this._refreshList();
  }

  _refreshList = () => {
    getActivityList().then(res => {
      this.setState({ list: res.activityList })
    }).catch(e => console.warn(e))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    let { isLoading, list } = this.state;
    let { props } = this;
    if (isLoading) { return <LoadingAnimation /> }
    else if (list && list.length > 0) {
      return <ListScreen
        list={list}
        refreshControl={<RefreshControl onRefresh={this._refreshList}
          refreshing={this.state.isLoading} />}
        {...props} />
    } else {
      return
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        refreshControl={<RefreshControl onRefresh={this._refreshList} refreshing={this.state.isLoading} />}
      >
        <Text>Belum ada aktivitas Anda yang terdaftar</Text>
      </ScrollView>
    }
  }

}
