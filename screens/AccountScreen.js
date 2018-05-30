'use strict';

import React from 'react';
import { Platform, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { getProfile } from '../logic/ProfileController';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import MenuButton from './../components/MenuButton';
import { reversePhoneWithoutCountryCode_Indonesia } from './../components/Formatter';

export default class AccountScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    };
  };

  static navigationOptions = {
    title: 'Akun',
  };

  _goToEditProfile = () => this.props.navigation.navigate('ChangeProfile', { profile: this.state.profile })
  _goToBankAccountScreen = () => this.props.navigation.navigate('BankAccountScreen')
  _askLogout = () => this._openLogoutModal();
  _openLogoutModal = () => this.refs.logoutModal.openModal();

  componentDidMount() {
    this.props.screenProps.withConnHandler(getProfile).then(
      profile => this.setState({ profile })
    );
  }

  render() {
    const { profile } = this.state;
    return (
      <ScrollView style={{ backgroundColor: '#f7f8fb' }} >
        <LogoutConfirmationModal ref='logoutModal' {...this.props} />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Text style={styles.namaProfile}>{profile.name}</Text>
              <Text style={styles.descProfile}>{profile.email}</Text>
              <Text style={styles.descProfile}>{reversePhoneWithoutCountryCode_Indonesia(profile.phone)}</Text>
            </View>
            {/* <TouchableOpacity onPress={this._goToEditProfile}>
              <View style={{ flex: 1, alignItems: 'flex-end', }}>
                <Text style={styles.editProfile}>Ubah</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.boxSeparator}></View>

        <View style={styles.boxDetail}>
          <MenuButton
            label='Ubah Profil'
            icon={
              <Icon
                name='new-message'
                type='entypo'
                size={24}
                color='#00d3c5'
              />
            }
            onPress={this._goToEditProfile}
          />
          <MenuButton
            label='Rekening Terdaftar'
            icon={
              <Icon
                name='ios-card'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._goToBankAccountScreen}
          />
          <MenuButton
            label='Keluar Akun'
            icon={
              <Icon
                name='ios-log-out'
                type='ionicon'
                size={26}
                color='#00d3c5'
              />
            }
            onPress={this._askLogout}
          />
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  boxDetail: {
    backgroundColor: '#fff',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    flex: 1
  },
  namaProfile: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 25,
        paddingTop: 0,
        marginBottom: -12,
      },
      android: {},
    }),
  },
  descProfile: {
    fontFamily: 'Hind-Light',
    fontSize: 15,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 25,
        paddingTop: 0,
        marginBottom: -10,
      },
      android: {},
    }),
  },
  // editProfile: {
  //   fontFamily: 'Hind-SemiBold',
  //   fontSize: 15,
  //   color: '#00a89d',
  //   ...Platform.select({
  //     ios: {
  //       lineHeight: 25,
  //       paddingTop: 0,
  //       marginBottom: -10,
  //     },
  //     android: {},
  //   }),
  // },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 20
  },
  boxSeparator: {
    height: 20
  },
});