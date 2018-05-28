'use strict';

import React from 'react';
import {
  StyleSheet, Text, View, Image, TextInput,
  TouchableOpacity, Keyboard, TouchableWithoutFeedback, Platform,
} from 'react-native';
import { fetchTravoramaLoginApi } from '../AuthController'
import {
  validateUserName, validatePassword, validatePhone,
} from '../../../logic/FormValidation';
import { Icon } from 'react-native-elements';
import Button from 'react-native-button';
import globalStyles from '../../../components/globalStyles';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync
  from '../../../api/NotificationController';
import { backToMain } from '../../../api/Common';
import { LinearGradient } from 'expo';
import { fetchProfile } from '../../../logic/ProfileController';
import { phoneWithoutCountryCode_Indonesia } from '../../../components/Formatter';
import LoadingModal from '../../../components/LoadingModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { setItemAsync } = Expo.SecureStore;

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: [], isLoading: false };
  }

  _onLoginPressed = () => {
    Keyboard.dismiss();
    let { userName, password } = this.state;
    let errorUserName = validateUserName(userName);
    let errorPassword = validatePassword(password);
    this.setState({ errorUserName, errorPassword });
    if (!errorUserName && !errorPassword) this._login();
  }

  componentWillUnmount() {
    this._notificationSubscription &&
      this._notificationSubscription.remove();
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  }

  _login = () => {
    const { userName, password } = this.state;
    let phoneNumber, countryCallCd, email;

    const isPhoneNo = !validatePhone(userName);
    if (isPhoneNo) {
      phoneNumber = phoneWithoutCountryCode_Indonesia(userName);
      countryCallCd = '62';
    } else {
      email = userName;
    }
    const { screenProps, navigation } = this.props;
    this.setState({ isLoading: true });
    screenProps.withConnHandler( () => fetchTravoramaLoginApi(
      email, countryCallCd, phoneNumber, password
    )).then(response => {
        if (response.status == 200) {
          setItemAsync('isLoggedIn', 'true');
          fetchProfile(); //// need await????
          registerForPushNotificationsAsync();
          backToMain(navigation);
        } else {
          let errorMessage;
          switch (response.error) {
            case 'ERR_NOT_REGISTERED':
              errorMessage = `Akun ${userName} tidak terdaftar`
              break;
            // case 'ERR_PHONENUMBER_NOT_REGISTERED':
            //   errorMessage = `Nomor ${userName} tidak terdaftar`
            //   break;
            case 'ERR_INVALID_PASSWORD':
              errorMessage = 'Password salah';
              break;
            default:
              errorMessage = 'Terjadi kesalahan pada server';
              if (__DEV__) errorMessage = response.error;
          }
          this.setState({ error: errorMessage });
        }
      }).catch(error => {
        console.log("Login error!!");
        console.log(error);
      }).finally( () => this.setState({ isLoading: false }) );
  }

  _toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    let { userName, password, showPassword, isLoading,
      errorUserName, errorPassword, error } = this.state;
    let { params } = this.props.navigation.state;

    let errorMessageUserName = errorUserName ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorUserName}</Text>
      </View> : null;

    let errorMessagePassword = errorPassword ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorPassword}</Text>
      </View> : null;

    let errorMessage = error ?
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{error}</Text>
      </View> : null;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
       <KeyboardAwareScrollView enableOnAndroid={true}
        enableAutomaticScroll={true} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/*<LoadingModal isVisible={isLoading} />*/}
          <View style={{ marginBottom: 30 }}>
            <Text style={globalStyles.categoryTitle1}>Login</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Email / No. Handphone</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              style={this.state.errorUserName ?
                styles.searchInputFalse : styles.searchInput
              }
              keyboardType='email-address'
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='next'
              onSubmitEditing={(event) => {
                this.refs.passwordInput.focus();
              }}
              // blurOnSubmit={false}
              onChangeText={userName => this.setState({
                userName, errorUserName: null, error: null
              })}
            />
          </View>

          {errorMessageUserName}
          <View style={{ marginTop: 0 }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              ref='passwordInput'
              style={this.state.errorPassword ?
                styles.searchInputFalse : styles.searchInput
              }
              underlineColorAndroid='transparent'
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={true}
              onChangeText={password => this.setState({
                password, errorPassword: null, error: null
              })}
              onSubmitEditing={this._onLoginPressed}
              returnKeyType='done'
            />
            <View style={{ position: 'absolute', right: 20, top: 40, }}>
              <TouchableOpacity onPress={this._toggleShowPassword}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-with-line'}
                  type='entypo' size={22} color='#acacac'
                />
              </TouchableOpacity>
            </View>
          </View>
          {errorMessagePassword}
          {errorMessage}

          <TouchableOpacity
            onPress={this._onLoginPressed}
            style={{ alignItems: 'center', width: '100%', marginTop: 30 }}
            activeOpacity={0.6}
            disabled={isLoading}
            styleDisabled={{ opacity: .7 }}
          >
            <LinearGradient
              colors={['#00d3c5', '#35eac6', '#6affc6']}
              start={[0, 0]}
              end={[1, 0]}
              style={{ height: 45, paddingTop: 11, alignItems: 'center', borderRadius: 25, width: '100%' }}>
              <Text style={{
                backgroundColor: 'transparent',
                fontSize: 18, color: '#ffffff',
                fontFamily: 'Hind-SemiBold',
              }}>
                Masuk
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity style={{ marginTop: 15, alignItems: 'flex-end' }}
            onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{ fontSize: 12, color: '#464646', fontFamily: 'Hind' }}>
              Lupa Password?
              </Text>
          </TouchableOpacity>
        </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
    backgroundColor: '#fff',
  },

  normaltext: {
    backgroundColor: 'transparent',
    color: '#ffffff',
  },
  loginemail: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    marginTop: 50,
  },
  description: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 30,
    padding: 40,
    color: '#ffffff'
  },
  label: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
      },
    }),
  },
  searchInput: {
    height: 45,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 7,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 25,
    color: '#565656',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Hind',
  },
  searchInputFalse: {
    height: 45,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 7,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#fdaab8',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Hind',
  },
});
