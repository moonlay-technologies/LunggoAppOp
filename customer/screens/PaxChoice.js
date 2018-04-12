'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import { CheckBox, Rating, Icon } from 'react-native-elements';
import * as Formatter from '../components/Formatter';
import globalStyles from '../../commons/globalStyles';
import {
  Platform, StyleSheet,
  Text, View, Image, TextInput, FlatList, TouchableOpacity
} from 'react-native';

export default class PaxChoice extends Component {

  static navigationOptions = {
    title: 'Pilih Peserta',
  };

  constructor (props) {
    super(props)
    this.state = {
      paxListItemIndexes:
        this.props.navigation.state.params.paxListItemIndexes || [],
      paxCount: this.props.navigation.state.params.paxCount,
      pax: [
        { key:0, name: "John Doe (me)" },
        { key:1,id:1, name: "Ali Zainal" },
      ]
    };
  }

  _return = () => {
    let choosenPax = [],
        {paxListItemIndexes, pax} = this.state,
        {navigation} = this.props,
        {params} = navigation.state;
    paxListItemIndexes.map( (currValue, index) => {
      // console.log(index, currValue);
      if (currValue) choosenPax.push( pax[index] );
    });
    // console.log(choosenPax);
    params.setPax(choosenPax);
    params.setPaxListItemIndexes(paxListItemIndexes);
    navigation.goBack();
    
  }

  addPaxListItem = newPaxObj => {
    let {pax,paxListItemIndexes} = this.state;
    newPaxObj.key = pax.length;
    paxListItemIndexes[pax.length] = true;
    pax.push(newPaxObj)
    this.setState({pax,paxListItemIndexes})
  }

  _checkPax = index => {
    let {paxListItemIndexes, paxCount} = this.state;
    paxListItemIndexes[index] = !paxListItemIndexes[index];
    if (paxListItemIndexes[index]) paxCount++; else paxCount--;
    this.setState({ paxListItemIndexes, paxCount })
  }

  _renderItem = pax =>
    <View>
      <View style={{flexDirection: 'row'}}>
        <CheckBox style={{backgroundColor: '#fff'}}
          title={pax.name}
          checked={ this.state.paxListItemIndexes[pax.key] }
          onPress={ () => this._checkPax(pax.key) }
        />
        <View style={{
          alignItems: 'flex-end',
          flex: 1,
          marginTop: 3,
        }}>
          <Text>Edit</Text>
        </View>
      </View>
      <View style={styles.divider}/>
    </View>

  render() {
    let {navigation} = this.props;
    let {requiredPaxData, price} = navigation.state.params;
    let {paxCount} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={{ marginBottom: 60, flex:1}}
          data={this.state.pax}
          renderItem={ ({item}) => this._renderItem(item) }
        />
        <View style={{flexDirection:'row', justifyContent: 'space-between', paddingBottom:20, marginTop:20}}>
          <View>
            <Text>Tambah Peserta</Text>
          </View>
          <TouchableOpacity
            containerStyle={{
              height:35,
              width:'100%',
              paddingTop:10,
              paddingBottom:10,
              overflow:'hidden',
              borderRadius:4,
              backgroundColor: '#437ef7'
            }}
            onPress={ () => navigation.navigate( "AddPax", {
              addPaxListItem: this.addPaxListItem,
              requiredPaxData,
              })}
          >
            <Icon
              name='plus'
              type='evilicon'
              size={26}
              color='#01d4cb'
            />
          </TouchableOpacity>
        </View>         
        {/*<Button
          containerStyle={{
            height: 45,
            width: '100%',
            paddingTop: 13,
            paddingBottom: 13,
            overflow: 'hidden',
            borderRadius:25,
            backgroundColor: '#01d4cb',
          }}
          style={{fontSize: 14, fontWeight:'bold', color: '#fff'}}
          onPress={ () => navigation.navigate( "AddPax", {
            addPaxListItem: this.addPaxListItem,
            requiredPaxData,
          })}
        >
          Tambah Peserta Baru
        </Button>*/}
        <View style={{flex:.25}}/>
        {/*bottom CTA button*/}
        <View style={globalStyles.bottomCtaBarContainer}>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Text style={{marginRight: 5, fontSize: 12,}}>
              {paxCount} orang
            </Text>
            <Text style={{
              color:'#000',
                fontWeight: 'bold',
                fontSize:20,
            }}>
              { Formatter.price(paxCount*price) }
            </Text> 
          </View>
          <View style={{alignItems: 'flex-end', flex:1}}>
            <Button
              containerStyle={{
                height: 45,
                width: '100%',
                paddingTop: 13,
                paddingBottom: 13,
                overflow: 'hidden',
                borderRadius:25,
                backgroundColor: '#01d4cb',
              }}
              style={{fontSize: 16, fontWeight:'bold', color: '#fff'}}
              onPress={this._return}
            >
              Daftarkan
            </Button>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    paddingBottom:40,
    backgroundColor: '#fff',
    flex:1,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
    marginTop: 15,
    marginBottom: 15,
  },
});
