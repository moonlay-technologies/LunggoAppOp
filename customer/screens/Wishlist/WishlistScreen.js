'use strict';

import React from 'react';
import LoadingAnimation from '../../components/LoadingAnimation';
import BlankScreen from './WishlistBlankScreen';
import ListScreen from '../SearchActivity/ActivityResultScreen';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class WishlistScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      list: [],
    };
    this._getWishlist = this._getWishlist.bind(this);
    this._onWishlist = this._onWishlist.bind(this);
  }

  static navigationOptions = {
    title: 'Favorit',
  };

  _getWishlist = async () => {
    setTimeout(async () => {
      let wishlistItems = await getItemAsync('wishlist');
      if (wishlistItems != null) {
        let activityList = JSON.parse(wishlistItems);
        this.setState({ list: activityList });
      }
    }, 0);
  }

  _onWishlist = async ({ id, wishlisted }) => {
    new Promise(() => {
      if (!wishlisted) {
        let list = this.state.list.filter(l => l.id != id);
        this.setState({ list });
      }
    });
  }

  componentDidMount() {
    let { params } = this.props.navigation.state;
    if (params && !params.loggedIn) return;
    this.props.navigation.addListener('willFocus', this._getWishlist);
    this._getWishlist();
  }

  render() {
    let { isLoading, list } = this.state;
    let { props } = this;
    if (isLoading) return <LoadingAnimation />
    else if (list && list.length > 0)
      return <ListScreen list={list} isWishlist={true} onWishlist={this._onWishlist} {...props} />
    else return <BlankScreen {...props} />
  }
}

// const styles = StyleSheet.create({
// });
