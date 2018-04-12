'use strict';

import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import BlankScreen from './MyBookingBlankScreen';
import CartListItem from './MyBookingListScreen';
import { getMyBookingList, shouldRefreshMyBookingList } from './MyBookingController';
import LoadingAnimation from '../../components/LoadingAnimation'


export default class MyBookingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      list: [],
    };
  }

  static navigationOptions = {
    title: 'Pesananku',
  }

  componentDidMount() {
    let { params } = this.props.navigation.state;
    if (params && !params.loggedIn) {
      return this.setState({ isLoading: false });
    }
    getMyBookingList().then(list => {
      this.setState({ list, isLoading: false });
    });
  }

  _refreshMyBookingList = () => {
    this.setState({ isLoading: true });
    shouldRefreshMyBookingList();
    getMyBookingList().then(list => {
      this.setState({ list });
    }).finally(() => this.setState({ isLoading: false }));
  }

  _keyExtractor = (item, index) => index
  _renderItem = ({ item, index }) => (
    <CartListItem
      item={item}
      index={index}
      // onPressItem={this._onPressItem}
      navigation={this.props.navigation}
    />
  )
  _refreshCtrl = () =>
    <RefreshControl onRefresh={this._refreshMyBookingList} refreshing={this.state.isLoading} />

  render() {
    let { isLoading, list, status } = this.state;
    let { props } = this;

    if (isLoading) return <LoadingAnimation />
    else if (list && list.length > 0) return (
      <FlatList
        data={list}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        refreshControl={<this._refreshCtrl />}
      />)
    else return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<this._refreshCtrl />}>
        <BlankScreen {...props} />
      </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#f1f0f0',
  },
});
