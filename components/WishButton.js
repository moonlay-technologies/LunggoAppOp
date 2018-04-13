'use strict';

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform,
  InteractionManager } from 'react-native';
import Button from 'react-native-button';
import { Icon } from 'react-native-elements';
import { toggleWishlist, checkUserLoggedIn } from '../../api/Common';
import Modal from 'react-native-modal';
import globalStyles from '../../commons/globalStyles';
import Colors from '../../constants/Colors';

export default class WishButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      wishlisted: props.wishlisted,
    };
  }

  componentWillReceiveProps({ wishlisted }) {
    this.setState({ wishlisted });
  }

  // _syncWishlistStateWithOtherScreen = key => {
  //   const setParamsAction = NavigationActions.setParams({
  //     key,
  //     params: { shouldRefresh: true },
  //   });
  //   this.props.navigation.dispatch(setParamsAction);
  // }

  _executeWishlist = async () => {
    //// negate wishlisted state
    let wishlisted = !this.state.wishlisted;
    this.setState({ wishlisted })
    if (this.props.onPress)
      setTimeout(() => this.props.onPress({ id: this.props.id, wishlisted }), 0);

    let isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) { //// if guest:
      return this.setState({ isModalVisible: true, wishlisted: false });
      if (this.props.onPress)
        setTimeout(() => this.props.onPress({ id: this.props.id, wishlisted: false }), 0);
    }

    await toggleWishlist(this.props.id, wishlisted);
  }

  _goToLoginScreen = () => {
    this.setState({ isModalVisible: false });
    this.props.navigation.navigate('LoginScreen', { back: true });
  }

  _goToRegisterScreen = () => {
    this.setState({ isModalVisible: false });
    this.props.navigation.navigate('Registration', { back: true });
  }

  _setModalVisible = vis => this.setState({ isModalVisible: vis })

  _closeModal = () => this._setModalVisible(false)

  render() {
    return (
      <View>

        <TouchableOpacity onPress={this._executeWishlist}
          style={{ flex: 1, alignItems: 'flex-end', ...this.props.style }} >
          <Icon type='materialicons' size={this.props.big ? 30 : 24}
            name={this.state.wishlisted ? 'favorite' : 'favorite-border'}
            color={this.state.wishlisted ? 'red' : this.props.unwishlistedColor ? this.props.unwishlistedColor : '#cdcdcd'}
          />
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}
          onBackdropPress={this._closeModal}
          onBackButtonPress={this._closeModal}
        >
          <View style={{ paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }}>
            <Text style={styles.textCart}>
              Silakan login terlebih dahulu
            </Text>
            <View style={{ marginVertical: 10 }}>
              <Button
                containerStyle={globalStyles.ctaButton2}
                style={{ fontSize: 14, color: '#fff', fontFamily: 'Hind', }}
                onPress={this._goToRegisterScreen}>
                Daftar
              </Button>
            </View>
            <View style={{ marginVertical: 5 }}>
              <Button
                containerStyle={globalStyles.ctaButton1}
                style={{ fontSize: 14, color: Colors.primaryColor, fontFamily: 'Hind', }}
                onPress={this._goToLoginScreen}>
                Login
              </Button>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  textCart: {
    fontFamily: 'Hind-Light',
    color: '#454545',
    fontSize: 14,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 4,
        marginBottom: -5,
        marginTop: 8
      },
      android: {
        marginTop: 5

      },
    }),
  }
});
