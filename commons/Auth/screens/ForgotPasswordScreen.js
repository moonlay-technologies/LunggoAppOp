'use strict';

import React from 'react';
import Colors from '../../../constants/Colors';
import Button from 'react-native-button';
import {
  StyleSheet, Text, View, Image, TextInput, ScrollView,
  KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { validatePhone } from '../../../commons/FormValidation';
import { sendOtp } from '../ResetPasswordController';
import LoadingAnimation from '../../../customer/components/LoadingAnimation';
import { phoneWithoutCountryCode_Indonesia } from '../../../customer/components/Formatter';
import LoadingModal from './../../components/LoadingModal';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      countryCallCd: 62,
      phone: '',
      isLoading: false,
      errorMessage: '',
    }
  }

  static navigationOptions = {
    title: 'Lupa Password',
  }

  _onOtpVerified = ({ navigation, countryCallCd, phone, email, otp }) => {
    navigation.replace('NewPassword', { countryCallCd, phone, email, otp });
  }

  _submit = () => {
    let { countryCallCd } = this.state;
    let phone = phoneWithoutCountryCode_Indonesia(this.state.phone);
    let errorMessage = validatePhone(phone);
    if (errorMessage) {
      // this.refs.phone.focus(); //// keknya ga gitu guna
      return this.setState({ errorMessage });
    }
    this.setState({ isLoading: true });
    sendOtp(countryCallCd, phone).then(response => {
      if (response.status == 200 ||
        response.error == 'ERR_TOO_MANY_SEND_SMS_IN_A_TIME') {
        this.props.navigation.replace('OtpVerification', {
          countryCallCd, phone, onVerified: this._onOtpVerified
        });
      } else
        this.setState({ isLoading: false, errorMessage: response.message });
    });
  }

  render() {
    let { phone, isLoading, errorMessage } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <LoadingModal isVisible={isLoading} />
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.categoryTitle}>Lupa Password?</Text>
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.mediumText}>
              Masukkan nomor telepon kamu untuk mereset password
            </Text>
          </View>
          {!!errorMessage &&
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fc2b4e' }}>{errorMessage}</Text>
            </View>
          }
          <TextInput
            style={styles.searchInput}
            underlineColorAndroid='transparent'
            placeholder='Nomor telepon'
            keyboardType='phone-pad' //keyboardType='email-address'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={phone => this.setState({
              phone, errorMessage: null,
            })}
            onSubmitEditing={this._submit}
            ref='phone'
            selectTextOnFocus={false}
            autoFocus={false}
          />
          <Button
            containerStyle={{
              marginTop: 40,
              height: 45,
              paddingTop: 13,
              paddingBottom: 10,
              overflow: 'hidden',
              borderRadius: 25,
              backgroundColor: Colors.primaryColor,
            }}
            style={{ fontSize: 16, color: '#fff' }}
            onPress={this._submit}
            disabled={isLoading}
            styleDisabled={{ color: '#aaa' }}
          >
            Kirim
          </Button>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 15,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#454545',
    textAlign: 'center'
  },
  mediumText: {
    fontSize: 15,
    color: '#454545',
    textAlign: 'center'
  },
  smallText: {
    fontSize: 13,
    color: '#afafaf',
    textAlign: 'justify',
  },
  loginemail: {
    backgroundColor: 'transparent',
    color: '#fff',
    marginTop: 50,
  },
  description: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 30,
    padding: 40,
    color: '#fff',
  },
  searchInput: {
    height: 45,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor: '#f5f5f5',
  },
});
