import React from 'react';
import { Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import PlatformTouchable from 'react-native-platform-touchable';
import { LinearGradient } from 'expo';

export default class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: true
    };
  }
  _toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }
  render() {
    let { showPassword } = this.state;
    return (
      <View>
        <View style={{ marginTop: 0 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{this.props.label}</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              style={this.state.errorUserName ?
                styles.searchInputFalse : styles.searchInput
              }
              keyboardType={this.props.keyboardType}
              secureTextEntry={!showPassword}
              underlineColorAndroid='transparent'
              autoCapitalize={this.props.autoCapitalize || 'none'}
              autoCorrect={false}
              returnKeyType='next'
              onSubmitEditing={this.props.onSubmit}
              // blurOnSubmit={false}
              onChangeText={userName => this.setState({
                userName, errorUserName: null, error: null
              })}
            />
          </View>
          {this.props.password &&
            <View style={{ position: 'absolute', right: 20, top: 40, }}>
              <TouchableOpacity onPress={this._toggleShowPassword}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-with-line'}
                  type='entypo' size={22} color='#acacac'
                />
              </TouchableOpacity>
            </View>
          }
        </View>
        { this.state.valid ||
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: '#fc2b4e' }}>{this.props.textfalse}</Text>
        </View>
        }
      </View>
    )

  }
}

const styles = StyleSheet.create({
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
})