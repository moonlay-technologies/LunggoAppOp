'use strict';

import React from 'react';
import {
  StyleSheet, Image, View, Text, ActivityIndicator, FlatList,
  TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import * as Formatter from '../../components/Formatter';
import WishButton from '../../components/WishButton';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

class ListItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { wishlisted: this.props.item.wishlisted };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ wishlisted: nextProps.item.wishlisted });
  }

  _onPressItem = () => this.props.navigation.navigate(
    'DetailScreen', { details: this.props.item }
  );

  render() {
    const { item } = this.props;
    let wishlisted = this.state.wishlisted;
    return (
      <View style={{ backgroundColor: '#fff', width: '50%' }}>
        <TouchableHighlight
          onPress={this._onPressItem}
          underlayColor='#ddd'>
          <View style={styles.rowContainer}>
            <View style={styles.containerItem}>
              <Image
                style={styles.thumbnailMedium}
                source={{ uri: item.mediaSrc }}
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.textContainer}>
                  <Text style={styles.namaKota}>{item.city}</Text>
                  {<Text style={styles.activityTitle} numberOfLines={2}>
                    {item.name}
                  </Text>}
                  <Text style={styles.priceTitle}>
                    {Formatter.price(item.price)}
                  </Text>
                </View>
                <WishButton wishlisted={wishlisted} onPress={this.props.onWishlist}
                  id={item.id} {...this.props} />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

}

export default class ActivityResultScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { list: this.props.list };
  }

  componentWillReceiveProps({ list }) {
    this.setState({ list });
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => {
    return ((!this.props.isWishlist || item.wishlisted) &&
      <ListItem
        item={item}
        index={index}
        onWishlist={this.props.onWishlist}
        {...this.props}
      />);
  }
    ;

  render() {
    return (
      <FlatList
        numColumns={2}
        contentContainerStyle={styles.list}
        data={this.state.list}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }

}

const styles = StyleSheet.create({
  rowContainer: {
    // flexDirection: 'row',
    //paddingTop: 15,
    padding: 7.5,
    // paddingRight:7.5,
    // flex:1,
  },
  containerItem: {
    flex: .2,
  },
  namaKota: {
    fontSize: 12,
    color: '#454545',
    marginBottom: 3,
  },
  thumbnailMedium: {
    resizeMode: 'cover',
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 3,
    // flex:1,
  },
  activityTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#454545',
  },
  priceTitle: {
    fontSize: 12,
    color: '#676767',
    marginTop: 2
  },
  textContainer: {
    marginTop: 5,
    flex: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd'
  },
  list: {
    // justifyContent: 'center',
    // flexDirection: 'row',
    // flex:1,
    // flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 7.5
  },
});