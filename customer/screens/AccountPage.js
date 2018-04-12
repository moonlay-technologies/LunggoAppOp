'use strict';

import React from 'react';
import Button from 'react-native-button';
import {
  Platform, StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import LogoutConfirmationModal from '../../commons/components/LogoutConfirmationModal';
import { checkUserLoggedIn, fetchTravoramaApi, AUTH_LEVEL, backToMain } from '../../api/Common'; //'../../commons/Auth/AuthController';
import { fetchProfile, getProfile, shouldRefreshProfile } from '../../commons/ProfileController';
import Avatar from './../../commons/components/Avatar';

export default class AccountScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: null,
      profile: {},
      avatar: 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png',
    }
  }

  static navigationOptions = {
    title: 'Akun',
  };

  componentDidMount() {
    this._checkUserLoggedIn();
    this.props.navigation.addListener('willFocus', this._checkUserLoggedIn);
  }

  _checkUserLoggedIn = () => {
    checkUserLoggedIn().then(async isLoggedIn => {
      let profile = isLoggedIn ? await getProfile() : {};
      this.setState({ profile, isLoggedIn });
    });
  };

  _openModal = () => this.refs.modal.openModal()

  _goToReferral = () => this.props.navigation.navigate('Referral')
  _goToEditProfile = () => this.props.navigation.navigate('ChangeProfile', { profile: this.state.profile })
  _goToPhoneVerification = () => this.props.navigation.navigate('OtpVerification', {
    countryCallCd: this.state.profile.countryCallCd,
    phone: this.state.profile.phone,
    onVerified: this._onOtpPhoneVerified,
  })

  _onOtpPhoneVerified = ({ countryCallCd, phone, otp, navigation }) => {
    let request = {
      path: '/v1/account/verifyphone',
      method: 'POST',
      data: { countryCallCd, phoneNumber: phone, otp },
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    fetchTravoramaApi(request).then(({ status }) => {
      shouldRefreshProfile();
      if (status = 200) backToMain(navigation);
    });
  }

  render() {
    let { navigate } = this.props.navigation;
    let { profile } = this.state;
    return (
      <ScrollView style={{ backgroundColor: '#f1f0f0', }} >

        <LogoutConfirmationModal ref='modal' {...this.props} />
        {
          this.state.isLoggedIn ?
            <View>
              <View>
                <View style={styles.container}>

                  {profile.isPhoneVerified ||
                    <TouchableOpacity style={styles.stickyHeader} onPress={this._goToPhoneVerification}>
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <Icon
                            name='ios-information-circle'
                            type='ionicon'
                            size={24}
                            color='#fff' />
                        </View>
                        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                          <Text style={styles.txtstickyHeader}>Verifikasi nomor telepon kamu di sini</Text>
                        </View>
                      </View>

                    </TouchableOpacity>
                  }

                  {/* <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ marginBottom: 20 }}>
                      <Avatar size={90} style={styles.avatarBig} name={this.state.name} source={{ uri: this.state.avatar }} />
                    </View>
                    <View>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={styles.activitydetailTitle}>{this.state.name}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.textCart}>Edit Profile</Text>
                        <View style={{ marginHorizontal: 10 }}>
                          <Text style={styles.textCart}>|</Text>
                        </View>
                        <Text style={styles.textCartColor}>100 point</Text>
                      </View>
                    </View> */}

                  <View style={{ flexDirection: 'row' }}>

                    <View style={{ flex: 2 }}>
                      <View>
                        <Text style={styles.namaProfile}>{profile.name}</Text>
                      </View>
                      <View>
                        <Text style={styles.descProfile}>{profile.email}</Text>
                      </View>
                      <View>
                        <Text style={styles.descProfile}>0{profile.phone}</Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={this._goToEditProfile}>
                      <View style={{ flex: 1, alignItems: 'flex-end', }}>
                        <View>
                          <Text style={styles.editProfile}>Ubah</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>

              <View style={styles.container}>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this._goToReferral}>
                    <View style={{ alignItems: 'flex-start' }}>
                      <Icon
                        name='ios-contacts-outline'
                        type='ionicon'
                        size={26}
                        color='#454545' />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                      <Text style={styles.optionProfile}>Undang Teman</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.divider}></View>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this._openModal}>
                    <View style={{ alignItems: 'flex-start' }}>
                      <Icon
                        name='ios-log-out'
                        type='ionicon'
                        size={26}
                        color='#454545' />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                      <Text style={styles.optionProfile}>Log Out</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <View style={styles.container}>
              <View>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('LoginScreen', { resetAfter: true })}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Icon
                      name='ios-log-in'
                      type='ionicon'
                      size={26}
                      color='#454545' />
                  </View>
                  <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                    <Text style={styles.optionProfile}>Login</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.divider}></View>
              <View>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('Registration', { resetAfter: true })}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Icon
                      name='ios-laptop'
                      type='ionicon'
                      size={26}
                      color='#454545' />
                  </View>
                  <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                    <Text style={styles.optionProfile}>Daftar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
        }
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 20
  },
  stickyHeader: {
    backgroundColor: '#f57b76',
    margin: -20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activitydetailTitle: {
    fontFamily: 'Hind-Bold',
    fontSize: 19,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 14,
        marginBottom: -16,
      },
      android: {
        lineHeight: 24
      },
    }),
  },
  avatarBig: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 45
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
        //backgroundColor:'red'
      },
      android: {},
    }),
  },
  editProfile: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 15,
    color: '#00a89d',
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
  optionProfile: {
    fontFamily: 'Hind-Light',
    fontSize: 16,
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
  namaProfile: {
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
  txtstickyHeader: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 15,
    color: '#fff',
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
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e1e1e1',
    marginVertical: 16
  },
});
