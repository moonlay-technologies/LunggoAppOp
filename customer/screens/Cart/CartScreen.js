'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, ScrollView,
  FlatList, TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import globalStyles from '../../../commons/globalStyles';
import { Rating, Icon } from 'react-native-elements';
import * as Formatter from '../../components/Formatter';
import { deleteCart } from './CartController';
import LoadingAnimation from '../../components/LoadingAnimation';
import BlankScreen from './CartBlankScreen';
import { getCart } from './CartController';

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      totalPrice: props.totalPrice,
      isLoading: true,
      list: [],
    };
  }

  static navigationOptions = {
    title: 'Keranjang',
  };

  componentDidMount() {
    this._refreshCart();
  }

  _refreshCart = () => {
    this.setState({ isLoading: true });
    getCart().then(({ cartId, list, totalPrice, status }) => {
      this.setState({ cartId, list, totalPrice, status, isLoading: false });
    }).catch(error => console.log(error))
      .finally(() => this.setState({ isLoading: false }));
  }

  _goToRincian = () => {
    let { cartId, list, totalPrice, status } = this.state;
    let title = "Nomor Keranjang #" + cartId;
    let total = totalPrice;
    let breakdown = list.map(rsv => ({
      name: rsv.activityDetail.name,
      details: rsv.ticketCount.filter(pax => pax.count).map(pax => {
        return {
          unit: pax.type,
          count: pax.count,
          unitPrice: pax.totalPrice / pax.count,
          totalPrice: pax.totalPrice
        }
      })
    }));
    this.props.navigation.navigate('RincianHarga', { title, total, breakdown });
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPress={() => this._onPressItem(item)}
      onPressDelete={this._onPressDelete}
    />
  );

  _onPressItem = item => {
    this.props.navigation.navigate('DetailScreen', { details: item.activityDetail })
  };

  _onPressDelete = (index, rsvNo) => {
    this.setState({ isLoading: true });
    let { list, totalPrice } = this.state;
    let deletedItemPrice = list[index].payment.originalPrice;
    deleteCart(rsvNo).then(response => {
      if (response.status == 200) {
        list.splice(index, 1);
        totalPrice -= deletedItemPrice;
        this.setState({ totalPrice, isLoading: false });
        this.forceUpdate();
      }
    }).catch(error => console.error(error));
  }

  _goToPayment = () => this.props.navigation.navigate('PaymentScreen', { cartId: this.state.cartId });

  render() {
    let { cartId, isLoading, list, totalPrice, status } = this.state;
    if (isLoading) return (
      <LoadingAnimation />)
    else if (status == 200 && list && list.length > 0) return (
      <View style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
          <FlatList
            contentContainerStyle={styles.list}
            data={this.state.list}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={<RefreshControl onRefresh={this._refreshCart.bind(this)} refreshing={this.state.isLoading} />}
          />
        </View>

        {/*bottom CTA button*/}
        <View style={globalStyles.bottomCtaBarContainer}>
          <View style={{ alignItems: 'flex-start', flex: 1.5 }}>
            <TouchableOpacity onPress={this._goToRincian}>
              <View>
                <Text style={{ fontSize: 12, color: '#676767', }}>Total</Text>
              </View>
              <View>
                <Text style={{
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>{Formatter.price(this.state.totalPrice)}</Text>
              </View>
              <View style={{ marginTop: 4 }} >
                <Text style={{ fontSize: 11, color: '#01d4cb', fontWeight: 'bold' }}>
                  Lihat Rincian Harga
            </Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <Button
              containerStyle={globalStyles.ctaButton}
              style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
              onPress={() => this._goToPayment()}
              styleDisabled={{ color: '#aaa' }}
            >
              Bayar
            </Button>
          </View>
        </View>
      </View>
    );
    else return <BlankScreen {...this.props} />
  }
}

class ListItem extends React.PureComponent {

  _onPressDelete = () =>
    this.props.onPressDelete(this.props.index, this.props.item.rsvNo)

  render() {
    const { item } = this.props;
    const { date, selectedSession } = item.selectedDateTime;
    console.log(selectedSession);
    let timeText = (!!selectedSession) ? ' - ' + selectedSession : '';
    const selectedDateTimeText =
      Formatter.dateFullShort(date) + timeText;
    // Moment(date).format('ddd, D MMM YYYY') + timeText;

    return (
      <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#ececec', marginBottom: 15 }}>

        <TouchableOpacity onPress={() => this.props.onPress(this.props)}>
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <View style={{ flex: 1 }}>
              <Image style={{ width: 70, height: 70, resizeMode: 'cover' }}
                source={{ uri: item.activityDetail.mediaSrc[0] }} />
            </View>
            <View style={{ flex: 3, paddingLeft: 15 }}>
              <View>
                <Text style={styles.activitydetailTitle}>
                  {item.activityDetail.name}
                </Text>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={styles.infoActivity}>
                  {item.activityDetail.city}
                </Text>
                <Text style={styles.infoActivity}>
                  {selectedDateTimeText}
                </Text>
                <Text style={styles.infoActivity}>
                  {item.ticketCount.filter(t => t.count != 0).map((t) => `${t.count} ${t.type}`).join(', ')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ paddingVertical: 15, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: '#ececec', flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.priceTitle}>
              {Formatter.price(item.payment.originalPrice)}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
            {/*<TouchableOpacity style={{marginRight:20}}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>*/}
            <TouchableOpacity onPress={this._onPressDelete}>
              <Text style={styles.actionText}>Hapus</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 100
  },
  activitydetailTitle: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 16,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 9,
        paddingTop: 14,
        //backgroundColor:'red',
        marginBottom: -10,
      },
      android: {
        lineHeight: 20
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  infoActivity: {
    fontFamily: 'Hind',
    fontSize: 14,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 5,
        paddingTop: 14,
        // backgroundColor:'red',
        marginBottom: -5
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),
      },
    }),
  },
  priceTitle: {
    fontSize: 16,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        lineHeight: 5,
        paddingTop: 14,
        // backgroundColor:'red',
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  actionText: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 5,
        paddingTop: 14,
        // backgroundColor:'red',
        marginBottom: -10
      },
      android: {
        lineHeight: 24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },

});
