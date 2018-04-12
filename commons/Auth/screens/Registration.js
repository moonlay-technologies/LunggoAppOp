'use strict';

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { phoneWithoutCountryCode_Indonesia } from '../../../customer/components/Formatter';
import { fetchTravoramaApi, fetchWishlist, AUTH_LEVEL, backToMain } from '../../../api/Common';
import registerForPushNotificationsAsync from '../../../api/NotificationController';
import { fetchTravoramaLoginApi } from '../AuthController';
import PersonDataForm from '../../components/PersonDataForm';
import { shouldRefreshProfile } from '../../ProfileController';
import LoadingModal from './../../components/LoadingModal';
import {
  validateUserName, validatePassword, validatePhone,
} from '../../FormValidation';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class Registration extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
    };
  }

  _register = accountData => {
    let { navigate, goBack, replace, pop } = this.props.navigation;
    let { params } = this.props.navigation.state;
    this.setState({ isLoading: true });

    let onOtpPhoneVerified = ({ countryCallCd, phone, otp, navigation }) => {
      this.setState({ isLoading: true });
      let request = {
        path: '/v1/account/verifyphone',
        method: 'POST',
        data: { countryCallCd, phoneNumber: phone, otp },
        requiredAuthLevel: AUTH_LEVEL.User,
      }
      fetchTravoramaApi(request).then(({ status }) => {
        shouldRefreshProfile();
        if (status = 200) {
          let { resetAfter, thruBeforeLogin } = params;
          if (resetAfter)
            backToMain(this.props.navigation);
          else if (thruBeforeLogin)
            pop(2);
          else
            pop();
        }
      }).finally(() => this.setState({ isLoading: false }));
    };

    let goToPhoneVerification = () => {
      replace('OtpVerification', {
        countryCallCd: accountData.countryCallCd,
        phone: accountData.phone,
        onVerified: onOtpPhoneVerified,
      });
    };

    let request = {
      path: '/v1/register',
      method: 'POST',
      data: { ...accountData, phone: phoneWithoutCountryCode_Indonesia(accountData.phone), countryCallCd: '62' },
      requiredAuthLevel: AUTH_LEVEL.Guest,
    };

    this.setState({ isLoading: true });

    fetchTravoramaApi(request).then(response => {
      if (response.status == 200) {
        fetchTravoramaLoginApi(accountData.email, '62', accountData.phone, accountData.password)
          .then(response => {
            if (response.status == 200) {
              console.log('1212121');
              setItemAsync('isLoggedIn', 'true');
              registerForPushNotificationsAsync();
              fetchWishlist();
              goToPhoneVerification();
              // this.setState({ isLoading: false });
            } else {
              console.log(response);
              let error = 'Terjadi kesalahan pada server';
            }
            this.setState({ error });
          }
          ).catch(error => {
            // this.setState({ isLoading: false });
            console.log("Login error!!");
            console.log(error);
          });
      }
      else {
        this.setState({ isLoading: false });
        console.log(request);
        console.log(response);
        let error;
        switch (response.error) {
          case 'ERR_EMAIL_ALREADY_EXIST':
            error = 'Email ' + accountData.email + ' sudah pernah terdaftar';
            break;
          case 'ERR_PHONENUMBER_ALREADY_EXIST':
            error = 'Nomor ' + accountData.phone + ' sudah pernah terdaftar';
            break;
          case 'ERR_INVALID_REQUEST':
            error = 'Ada kesalahan pengisian data';
            break;
          default:
            error = 'Terjadi kesalahan pada server';
        }
        this.setState({ error });
      }
    }).catch(error => console.log(error))
      .finally(() => this.setState({ isLoading: false }));
  }

  _goToLoginScreen = () => this.props.navigation.replace('LoginScreen', this.props.navigation.state.params)

  render() {
    return (

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LoadingModal isVisible={this.state.isLoading} />
        <PersonDataForm onSubmit={this._register} formTitle='Daftar Akun Baru' hasPasswordField={true}
          submitButtonText='Daftarkan' buttonDisabled={this.state.isLoading}
        />
        <TouchableOpacity style={{ marginBottom: 30, alignItems: 'center' }}
          onPress={this._goToLoginScreen}
        >
          <Text style={{ fontSize: 14, color: '#000', fontFamily: 'Hind' }}>
            Sudah punya akun? Login di sini
          </Text>
        </TouchableOpacity>
      </View>

    );
  }
}
