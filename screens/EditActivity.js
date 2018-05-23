'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import { StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';

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
    title: 'Edit Detail',
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
    return (
      <ScrollView style={styles.container}>
        <Text style={{}}>KOTAK UPLOD FOTO{'\n\n'}</Text>
        <Text style={styles.label}>
          Judul Aktivitas
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ name => this.setState({name}) }
          value={this.state.name}
          placeholder="ex: John Doe"
        />

        <Text style={styles.label}>
          Deskripsi
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ description => this.setState({description}) }
          value={this.state.description}
          placeholder="lorem ipsum"
        />
        <Text style={styles.label}>
          Address
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ address => this.setState({address}) }
          value={this.state.address}
          placeholder="address"
        />
        <Text style={styles.label}>
          City
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ city => this.setState({city}) }
          value={this.state.city}
          placeholder="city"
        />
        <Text style={styles.label}>
          asdf
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ city => this.setState({city}) }
          value={this.state.city}
          placeholder="0812345678"
        />
        <Text style={styles.label}>
          asdf
        </Text>
        <TextInput
          underlineColorAndroid= 'transparent'
          style={styles.txtInput}
          onChangeText={ tel => this.setState({tel}) }
          value={this.state.tel}
          placeholder="0812345678"
        />

        <View style={{alignItems: 'flex-end',}}>
          <Button
            containerStyle={{
              height: 40,
              width: 90,
              paddingTop: 10,
              paddingBottom :10,
              overflow: 'hidden',
              borderRadius: 4,
              backgroundColor: '#437ef7',
            }}
            style={{fontSize: 14, color: '#fff'}}
            onPress={this._add}
          >
            Tambahkan
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    backgroundColor: '#fff',
    flex:1,
  },
  label: {
    marginBottom: 5,
  },
  txtInput: {
    height: 40, 
    borderColor: '#cdcdcd', 
    borderWidth: 1, 
    paddingRight:10, 
    paddingLeft:10, 
    marginBottom:20, 
  },
});
