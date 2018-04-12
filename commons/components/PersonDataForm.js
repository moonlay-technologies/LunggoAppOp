'use strict';

import React from 'react';
import { Icon } from 'react-native-elements';
import {
  Platform, StyleSheet, TouchableOpacity, Text, View, Image,
  TextInput, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePassword, validateRequiredField, validatePhone }
  from '../FormValidation';
import globalStyles from '../globalStyles';
import { reversePhoneWithoutCountryCode_Indonesia, phoneWithoutCountryCode_Indonesia } from '../../customer/components/Formatter';
import { WideCTAButton } from './Buttons';


export default class PersonDataForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log(props.contact);
    this.state = props.contact || {
      name: '',
      email: '',
      // countryCallCd: '+62',
      phone: '',
      password: '',
    };
    this.state.countryCallCd = 62;
    this.state.phone = reversePhoneWithoutCountryCode_Indonesia(this.state.phone);
    this.passwordInput = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.contact);
  }

  _onSubmitForm = () => {
    let { name, email, countryCallCd, phone, password } = this.state;
    let errorName = validateRequiredField(name);
    let errorEmail = validateEmail(email);
    let errorPassword = this.props.hasPasswordField ? validatePassword(password) : false;
    let errorCountryCallCd = validateRequiredField(countryCallCd);
    let errorPhone = validatePhone(phone);
    if (!errorName && !errorEmail && !errorPassword &&
      !errorCountryCallCd && !errorPhone) {
      this.props.onSubmit({ ...this.state, phone: phoneWithoutCountryCode_Indonesia(phone) });
    } else this.setState({
      errorName, errorEmail, errorPassword,
      errorCountryCallCd, errorPhone
    });
  }

  render() {
    let { name, email, phone, countryCallCd, errorName, errorEmail,
      errorPhone, errorCountryCallCd, error, password, showPassword,
      errorPassword, } = this.state;

    let errorMessageName = errorName ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorName}</Text>
      </View> : null;

    let errorMessageEmail = errorEmail ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorEmail}</Text>
      </View> : null;

    let errorMessagePassword = errorPassword ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorPassword}</Text>
      </View> : null;

    let errorMessageCountryCallCd = errorCountryCallCd ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorCountryCallCd}</Text>
      </View> : null;

    let errorMessagePhone = errorPhone ?
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{errorPhone}</Text>
      </View> : null;

    let errorMessage = error ?
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={{ color: '#fc2b4e' }}>{error}</Text>
      </View> : null;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={{ marginBottom: 25 }}>
            <Text style={globalStyles.categoryTitle1}>
              {this.props.formTitle}
            </Text>
          </View>
          {this.props.additionalContent}
          <KeyboardAvoidingView>
            {/*<KeyboardAwareScrollView
          style={{ backgroundColor: 'transparent' }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >*/}

            <View style={{ marginBottom: 5 }}>
              <Text style={styles.label}>Nama Lengkap</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <TextInput
                style={this.state.errorName ?
                  styles.searchInputFalse : styles.searchInput
                }
                underlineColorAndroid='transparent'
                placeholder='contoh: Andi Budi'
                value={name}
                onChangeText={name => this.setState({
                  name, errorName: null, error: null
                })}
                returnKeyType={"next"}
                onSubmitEditing={() => this.refs.email.focus()}
              />
            </View>
            {errorMessageName}
            <View style={{ marginBottom: 5 }}>
              <Text style={styles.label}>Email</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <TextInput
                style={this.state.errorEmail ?
                  styles.searchInputFalse : styles.searchInput
                }
                ref='email'
                underlineColorAndroid='transparent'
                placeholder='contoh@email.com'
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={email => this.setState({
                  email, errorEmail: null, error: null
                })}
                returnKeyType={"next"}
                onSubmitEditing={() => this.refs.phone/*countryCallCd*/.focus()}
              />
            </View>
            {errorMessageEmail}
            <View style={{ marginBottom: 5 }}>
              <Text style={styles.label}>No. Handphone</Text>
            </View>
            <View style={{ marginBottom: 15, flexDirection: 'row' }}>
              {/*<View style={{ flex: 1.4 }}>
              <TextInput
                style={this.state.errorCountryCallCd ?
                  styles.searchInputFalse : styles.searchInput
                }
                ref='countryCallCd'
                underlineColorAndroid='transparent'
                placeholder='+ ....'
                keyboardType='phone-pad'
                value={countryCallCd}
                selectTextOnFocus={true}
                onChangeText={countryCallCd => this.setState({
                  countryCallCd, errorCountryCallCd: null, error: null
                })}
                returnKeyType={"next"}
                onSubmitEditing={() => this.refs.phone.focus()}
              />
            </View>*/}
              <View style={{ flex: 4 }}>
                <TextInput
                  style={this.state.errorPhone ?
                    styles.searchInputFalse : styles.searchInput
                  }
                  ref='phone'
                  underlineColorAndroid='transparent'
                  placeholder='08123456789'
                  keyboardType='numeric'
                  value={phone}
                  onChangeText={phone => this.setState({
                    phone, errorPhone: null, error: null
                  })}
                  returnKeyType={this.props.hasPasswordField ? 'next' : 'done'}
                  onSubmitEditing={this.props.hasPasswordField ? this.passwordInput.focus : this._onSubmitForm}
                />
              </View>
            </View>

            {errorMessageCountryCallCd}
            {errorMessagePhone}
            {this.props.hasPasswordField &&
              <View>
                <View style={{ marginBottom: 5 }}>
                  <Text style={styles.label}>Password</Text>
                </View>
                <View style={{ marginBottom: 15 }}>
                  <TextInput
                    style={this.state.errorPassword ?
                      styles.searchInputFalse : styles.searchInput
                    }
                    ref={ref => this.passwordInput = ref}
                    underlineColorAndroid='transparent'
                    placeholder='Password minimal 6 karakter'
                    value={password}
                    onChangeText={password => this.setState({
                      password, errorPassword: null, error: null
                    })}
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    returnKeyType={"done"}
                    onSubmitEditing={this._onSubmitForm}
                  />
                  {errorMessagePassword}
                  {errorMessage}
                  <View style={{ position: 'absolute', right: 20, top: 11, }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ showPassword: !showPassword })}
                    >
                      <View>
                        <Icon
                          name={showPassword ? 'eye' : 'eye-with-line'}
                          type='entypo'
                          size={22}
                          color='#acacac'
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }

            <WideCTAButton
              onPress={this._onSubmitForm}
              disabled={this.props.buttonDisabled}
              text={this.props.submitButtonText}
            />

            {/*</KeyboardAwareScrollView>*/}
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 10,
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
