'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, FlatList, Text, View, Image,
  TextInput, ScrollView, TouchableHighlight, RefreshControl,
} from 'react-native';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';
import { dateFullShort, timeFromNow } from '../../customer/components/Formatter';
import { fetchAppointmentRequests } from './Appointments/AppointmentController';
import { shouldRefreshAppointmentRequest } from './AppointmentList';
import LoadingModal from './../../commons/components/LoadingModal';
import { getPaxCountText } from '../../commons/otherCommonFunctions';

export default class AppointmentRequests extends React.Component {

  constructor(props) {
    super(props)
    let { requests } = props.navigation.state.params || [];
    this.state = {
      list: [...requests],
      isLoading: false
    };
  }

  static navigationOptions = {
    title: 'Pesanan Baru',
  }

  componentDidMount() {
    this._refreshList();
  }

  _refreshList = () => fetchAppointmentRequests().then( res =>
    this.setState({ list: res.appointmentRequests })
  )

  _keyExtractor = (item, index) => index
  _renderItem = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._viewDetails}
      onPressAccept={this._acceptRequest}
      onPressDecline={this._declineRequest}
    />
  )

  _viewDetails = (item) => {
    // this.props.navigation.navigate(
    //   'BookedPageDetail',{details: item}
    // );
  }

  _respondRequest = (rsvNo, action) => {
    this.setState({ isLoading: true });
    const version = 'v1';
    let request = {
      path: `/${version}/operator/appointments/${action}/${rsvNo}`,
      method: 'POST',
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    fetchTravoramaApi(request).then(response => {
      shouldRefreshAppointmentRequest();
      this.setState({ list: list.filter(e => e.rsvNo != rsvNo) });
    }).catch(error => console.log(error));
    this.setState({ isLoading: false });
  }

  _acceptRequest = ({ rsvNo }) => this._respondRequest(rsvNo, 'confirm')
  _declineRequest = ({ rsvNo }) => this._respondRequest(rsvNo, 'decline')
  _refreshCtrl = () =>
    <RefreshControl onRefresh={this._refreshList} refreshing={this.state.isLoading} />

  render() {
    let { isLoading, list } = this.state;
    return (
      isLoading ? <LoadingModal isVisible={isLoading} />
      :
      ( list && list.length > 0 ) ?
        <View style={{ marginBottom: 10,backgroundColor: '#fff', }}>
          <FlatList
            style={{ paddingTop: 15 }}
            data={this.state.list}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={<this._refreshCtrl/>}
          />
        </View>
      :
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          refreshControl={<this._refreshCtrl/>}
          contentContainerStyle={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>Belum ada pesanan baru yang masuk</Text>
        </ScrollView>
    );
  }
}

class ListItem extends React.Component {

  _onPressItem = () => this.props.onPressItem(this.props.item);
  _onPressDecline = () => this.props.onPressDecline(this.props.item);
  _onPressAccept = () => this.props.onPressAccept(this.props.item);

  render() {
    const { item } = this.props;
    return (
      <View key={item.rsvNo}>
        <TouchableHighlight onPress={this._onPressItem} underlayColor='#ddd'>
          <View style={[{ flex: 1 }, styles.containerListAppointment]}>

            <View style={{ flex: 3 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.activityTitle}>
                  {item.activityName}
                </Text>
              </View>
              <View style={{ width: '100%', flexDirection: 'row', marginTop: 5 }}>
                <Text style={styles.activityDesc}>
                  {dateFullShort(item.date)}
                </Text>
                <Text style={[styles.activityDesc, { marginLeft: 10 }]}>
                  {item.session}
                </Text>
              </View>
              <Text style={[styles.activityDesc,]}>
                {item.contactName} ({getPaxCountText(item.paxCount)})
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.dueDate}>
                Batas waktu menerima: {timeFromNow(item.timeLimit)}
              </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
              <Button
                containerStyle={{
                  height: 32,
                  width: 100,
                  paddingTop: 6,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#bfbfbf',
                  backgroundColor: 'transparent'
                }}
                style={{ fontSize: 14, color: '#454545' }}
                onPress={() => this._onPressDecline()}
              >
                Tolak
              </Button>
              <Button
                containerStyle={{
                  marginLeft: 10,
                  height: 32,
                  width: 100,
                  paddingTop: 6,
                  borderRadius: 4,
                  backgroundColor: '#00c8be'
                }}
                style={{ fontSize: 14, color: '#fff' }}
                onPress={() => this._onPressAccept()}
              >
                Terima
              </Button>


            </View>
          </View>
        </TouchableHighlight>

        <View style={styles.divider} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointment: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityDesc: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  dueDate: {
    fontSize: 15,
    color: '#f3645e',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityGuest: {
    fontSize: 18,
    marginBottom: 3,
    fontWeight: 'bold'
  },
  status: {
    color: 'green',
    fontSize: 12,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 3,
  },

});
