'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, FlatList, Text, View, ScrollView, RefreshControl,
} from 'react-native';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common';
import { dateFullShort, timeFromNow } from '../components/Formatter';
import { fetchAppointmentRequests, shouldRefreshAppointmentList,
  appointmentRequestItemStore, _refreshAppointmentRequest
} from './Appointments/AppointmentController';
import { getPaxCountText } from '../logic/otherCommonFunctions';
import { observer } from 'mobx-react';
@observer
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

  _refreshList = () => {
    this.props.screenProps.withConnHandler(fetchAppointmentRequests)
    .then(res => {
      this.setState({ list: res.appointmentRequests });
      this.props.screenProps.withConnHandler(_refreshAppointmentRequest)
      .then( () => this.setState({ isLoading: false }) );
    });
  }

  _keyExtractor = (item, index) => index
  _renderItem = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPressAccept={this._acceptRequest}
      onPressDecline={this._declineRequest}
    />
  )

  _respondRequest = (rsvNo, action, cancellationReason = null) => {
    this.setState({ isLoading: true });
    const version = 'v1';
    let request = {
      path: `/${version}/operator/appointments/${action}/${rsvNo}`,
      method: 'POST',
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    this.props.screenProps.withConnHandler(()=>fetchTravoramaApi(request))
    .then(response => {
      shouldRefreshAppointmentList();
      this._refreshList();
      this.setState({ list: list.filter(e => e.rsvNo != rsvNo) });
    }).catch(error => console.log(error));
  }

  _acceptRequest = ({ rsvNo }) => this._respondRequest(rsvNo, 'confirm');
  _declineRequest = ({ rsvNo }) => this.props.navigation.navigate('CancellationReason', {rsvNo});

  render() {
    let { isLoading } = this.state;
    let list = appointmentRequestItemStore.appointmentRequestItem;
    return (
      (list && list.length > 0) ?
        <View style={{ marginBottom: 10, backgroundColor: '#fff', }}>
          <FlatList
            data={list}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={<RefreshControl onRefresh={this._refreshList} refreshing={isLoading} />}
          />
        </View>
        :
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          refreshControl={<RefreshControl onRefresh={this._refreshList} refreshing={isLoading} />}
          contentContainerStyle={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>Belum ada pesanan baru yang masuk</Text>
        </ScrollView>
    );
  }
}

class ListItem extends React.Component {

  _onPressDecline = () => this.props.onPressDecline(this.props.item);
  _onPressAccept = () => this.props.onPressAccept(this.props.item);

  render() {
    const { item } = this.props;
    return (
      <View style={[{ flex: 1 }, styles.containerListAppointment]} key={item.rsvNo}>

        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={styles.activityTitle}>
              {item.activityName}
            </Text>
          </View>
          <Text style={styles.activityDesc}>
            No. Pesanan {item.rsvNo}
          </Text>
          <View style={{ width: '100%', flexDirection: 'row' }}>
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
            onPress={this._onPressDecline}
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
            onPress={this._onPressAccept}
          >
            Terima
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerListAppointment: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
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
});
