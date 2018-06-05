'use strict';

import React from 'react';
import {
  Image, Platform, ScrollView, Text, TouchableOpacity, View, RefreshControl,
  TextInput, ActivityIndicator, TouchableNativeFeedback, StyleSheet,
} from 'react-native';
import { getUserBankAccounts } from '../logic/ProfileController';

export default class BankAccountScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bankAccounts: null,
    };
  };

  static navigationOptions = {
    title: 'Rekening Terdaftar',
  };

  componentDidMount() {
    this.getUserBankAccounts();
  }

  getUserBankAccounts = () => {
    this.props.screenProps.withConnHandler(getUserBankAccounts)
      .then(bankAccounts => {
        this.setState({ bankAccounts });
      }).catch(() => {
        this.setState({ bankAccounts: null });
      });
  }

  render() {
    let { bankAccounts } = this.state;
    if (bankAccounts == null)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Gagal mengambil data dari server.{'\n'}Silakan coba kembali</Text>
        </View>);
    else if (bankAccounts.length == 0)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Tidak ada nomor rekening yang terdaftar</Text>
        </View>);
    else
      return (
        <ScrollView
          style={{ backgroundColor: '#f7f8fb' }}
        >
          {this.state.bankAccounts.map((acc, idx) => (
            <View style={styles.container} key={idx}>
              <Text style={styles.title}>{acc.bankName}</Text>
              <Text style={styles.title}>{acc.accountNumber}</Text>
              <Text style={styles.desc}>a.n. {acc.ownerName}</Text>
              <Text style={styles.desc}>{acc.branch}</Text>
            </View>
          ))}
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 25,
        paddingTop: 0,
        marginBottom: -12,
        //backgroundColor:'red'
      },
      android: {},
    }),
  },
  desc: {
    fontFamily: 'Hind-Light',
    fontSize: 15,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 25,
        paddingTop: 0,
        marginBottom: -10,
        //backgroundColor:'red'
      },
      android: {},
    }),
  },
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
});