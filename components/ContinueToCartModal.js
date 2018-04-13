'use strict';

import React from 'react';
import Button from 'react-native-button';
import { Platform, StyleSheet, Text, View, } from 'react-native';
import globalStyles from '../../commons/globalStyles';
// import Modal from '../../commons/components/Modal';
import Modal from 'react-native-modal';
import { backToMain } from '../../api/Common';
import { NavigationActions } from 'react-navigation';

export default class ContinueToCartModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = { isVisible: false };
  }

  componentWillReceiveProps({ isVisible }) {
    this.setState({ isVisible });
  }

  _goToCart = () => {
    this.setState({ isVisible: false });
    let { reset, navigate } = NavigationActions;
    const action = reset({
      index: 1,
      actions: [
        navigate({ routeName: 'Main' }),
        navigate({ routeName: 'Cart' })],
    });
    this.props.navigation.dispatch(action);
  }

  _seeMoreActivity = () => {
    this.setState({ isVisible: false });
    backToMain(this.props.navigation);
  }

  render() {
    if (this.state.isVisible) return (
      <Modal
        isVisible={true}
        onBackButtonPress={this._goToCart}
      >
        <View style={{ flex: 1 }}></View>
        <View style={styles.modalContentContainer}>
          <Text style={styles.textCart}>
            Pesananmu sudah masuk keranjang
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Button
              containerStyle={globalStyles.ctaButton2}
              style={{ fontSize: 14, color: '#fff', fontFamily: 'Hind-SemiBold' }}
              onPress={this._goToCart}
            >
              Lanjut ke Pembayaran
            </Button>
          </View>
          <View >
            <Button
              containerStyle={globalStyles.ctaButton3}
              style={{ fontSize: 14, color: '#ff5f5f', fontFamily: 'Hind', }}
              onPress={this._seeMoreActivity}
            >
              Pesan Aktivitas Lainnya
            </Button>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </Modal>
    );
    else return null;
  }
}

const styles = StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'white',
    // height: 300,
    // width: 300,
    // flex: 1,
    paddingHorizontal: 10, paddingVertical: 15,
    // justifyContent: 'flex-end'
  },
  textCart: {
    fontFamily: 'Hind',
    color: '#454545',
    fontSize: 14,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 4,
        marginBottom: -5,
      },
      android: {
        //marginTop:5
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
});