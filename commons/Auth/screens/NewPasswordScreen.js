'use strict';

import React from 'react';
import Colors from '../../../constants/Colors';
import { Icon } from 'react-native-elements';
import Button from 'react-native-button';
import {
  StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard,
  KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import { validatePassword } from '../../../commons/FormValidation';
import { resetPassword } from '../ResetPasswordController';
import LoadingAnimation from '../../../customer/components/LoadingAnimation'
import { fetchWishlist, backToMain } from '../../../api/Common';
import { fetchTravoramaLoginApi } from '../AuthController';
import registerForPushNotificationsAsync from '../../../api/NotificationController';
import LoadingModal from './../../components/LoadingModal';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class NewPasswordScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      password: '',
      showPassword: false,
      isLoading: false,
    }
  }

  static navigationOptions = {
    title: 'Reset Password',
  }

  _submit = () => {
    let { password } = this.state;
    let { countryCallCd, phone, email, otp } = this.props.navigation.state.params;
    let errorPassword = validatePassword(password);
    if (errorPassword) {
      this.refs.password.focus();
      return this.setState({ errorPassword });
    }
    this.setState({ isLoading: true });
    resetPassword(email, countryCallCd, phone, otp, password).then(response => {
      let { status, message } = response;
      if (status == 200) {
        fetchTravoramaLoginApi(email, countryCallCd, phone, password)
          .then(response => {
            if (response.status == 200) {
              setItemAsync('isLoggedIn', 'true');
              registerForPushNotificationsAsync();
              fetchWishlist();
              backToMain(this.props.navigation);
            } else {
              console.log(response);
              let error = 'Terjadi kesalahan pada server';
              console.log(error);
            }
          })
          .catch(error => {
            console.log("Login error!!");
            console.log(error);
          });
      }
      this.setState({ isLoading: false, errorMessage: message });
    });
  }

  _toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    let { password, showPassword, isLoading, errorMessage } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <LoadingModal isVisible={isLoading} />
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.categoryTitle}>Masukkan Password Baru</Text>
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.mediumText}>Password minimal 6 karakter</Text>
          </View>
          {errorMessage ?
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fc2b4e' }}>{errorMessage}</Text>
            </View> : null
          }
          <View>
            <TextInput
              style={styles.searchInput}
              underlineColorAndroid='transparent'
              placeholder='New Password'
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={true}
              onChangeText={password => this.setState({
                password, errorMessage: null,
              })}
              returnKeyType='done'
              onSubmitEditing={this._submit}
              ref='password'
              selectTextOnFocus={true}
              autoFocus={true}
            />
            <View style={{ position: 'absolute', right: 20, top: 11, }}>
              <TouchableOpacity onPress={this._toggleShowPassword}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-with-line'}
                  type='entypo' size={22} color='#acacac'
                />
              </TouchableOpacity>
            </View>
          </View>
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
            Ubah Password
          </Button>
          {isLoading && <LoadingAnimation />}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#454545',
  },
  mediumText: {
    fontSize: 15,
    color: '#454545',
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
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor: '#f5f5f5',
  },
});
