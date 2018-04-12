'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import { StyleSheet, Text, View, TextInput, } from 'react-native';

export default class AddPax extends Component {

  constructor (props) {
    super(props)
    this.state = {
      name: null,
      birthDate : null,
      email : null,
      tel : null,
      idCardNo : null,
      ticketCount: null,
    };
  }

  static navigationOptions = {
    title: 'Peserta Baru',
  };

  _add = () => {
    //// validation
    if (!this.state.name) return;
    
    //// if validation passed
    //// pass data to PaxChoice
    const { navigation } = this.props;
    navigation.state.params.addPaxListItem(this.state);
    navigation.goBack();
  }

  render() {
    let { requiredPaxData } = this.props.navigation.state.params;
    if (!requiredPaxData)
      return (
        <View style={styles.container}>
          <Text style={styles.label}>
            Ticket Amount
          </Text>
          <TextInput
            underlineColorAndroid= 'transparent'
            style={styles.txtInput}
            returnKeyType={ "next" }
            onChangeText={ ticketCount => this.setState({ticketCount}) }
            value={this.state.ticketCount}
            // placeholder=""
          />
        </View>
      )

    let birthDate = (requiredPaxData.indexOf('dateOfBirth') >= 0) ?
      <View style={{marginBottom:15}}>
        <Text style={styles.label}>
          Tanggal Lahir
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.searchInput}
          returnKeyType={ "next" }
          onChangeText={ birthDate => this.setState({birthDate}) }
          value={this.state.birthDate}
          placeholder="DD/MM/YYYY"
        />
      </View>
      : null;

    let idCardNo = (requiredPaxData.indexOf('idCardNo') >= 0) ?
      <View style={{marginBottom:15}}>
        <Text style={styles.label}>
          No. KTP / Passport
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.searchInput}
          returnKeyType={ "next" }
          onChangeText={ idCardNo => this.setState({idCardNo}) }
          value={this.state.idCardNo}
          placeholder="01234567890"
        />
      </View>
      : null;

    let passportNumber = (requiredPaxData.indexOf('passport') >= 0) ?
      <View style={{marginBottom:15}}>
        <Text style={styles.label}>
          No. Passport
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.searchInput}
          returnKeyType={ "next" }
          onChangeText={ idCardNo => this.setState({idCardNo}) }
          value={this.state.idCardNo}
          placeholder="01234567890"
        />
      </View>
      : null;

    return (
      <View style={styles.container}>
        <View style={{marginBottom:15}}>
          <Text style={styles.label}>
            Nama Peserta
          </Text>
          <TextInput
            underlineColorAndroid= 'transparent'
            style={styles.searchInput}
            returnKeyType={ "next" }
            onChangeText={ name => this.setState({name}) }
            value={this.state.name}
            placeholder="ex: John Doe"
          />
        </View>
        
        {birthDate}

        <View style={{marginBottom:15}}>
          <Text style={styles.label}>
            Email
          </Text>
          <TextInput
            underlineColorAndroid= 'transparent'
            style={styles.searchInput}
            returnKeyType={ "next" }
            onChangeText={ email => this.setState({email}) }
            value={this.state.email}
            placeholder="example@email.com"
          />
        </View>
        <View style={{marginBottom:15}}>
          <Text style={styles.label}>
            No. Telp
          </Text>
          <TextInput
            underlineColorAndroid= 'transparent'
            style={styles.searchInput}
            returnKeyType={ "next" }
            onChangeText={ tel => this.setState({tel}) }
            value={this.state.tel}
            placeholder="0812345678"
          />
        </View>

        {idCardNo}
        {passportNumber}
        
        <View style={{position:'absolute', bottom:20, left:20, alignItems:'center', width:'100%',}}>
          <Button
            containerStyle={{
              marginTop:30,
              height:45,
              paddingTop:11,
              paddingBottom:10,
              overflow:'hidden',
              borderRadius:25,
              backgroundColor: '#23d3c3',
              width:'100%', 
            }}
            style={{fontSize: 16, color: '#ffffff', fontFamily:'Hind-Bold'}}
            onPress={this._add}
            styleDisabled={{color:'#fff', opacity:0.7}}
          >
            Tambahkan
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    paddingTop:30,
    backgroundColor: '#fff',
    flex:1,
  },
  label: {
    marginBottom: 5,
    fontFamily:'Hind',
  },
  searchInput: {
    height: 45,
    paddingLeft:15,
    paddingTop:10,
    paddingBottom:7,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor:'#f5f5f5',
    fontFamily:'Hind',
  },
  searchInputFalse: {
    height: 45,
    paddingLeft:15,
    paddingTop:10,
    paddingBottom:7,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#fc2b4e',
    borderRadius: 25,
    color: '#acacac',
    backgroundColor:'#f5f5f5',
    fontFamily:'Hind',
  },
});
