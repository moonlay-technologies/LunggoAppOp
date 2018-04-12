'use strict';

import React from 'react';
import Button from 'react-native-button';
import { LinearGradient } from 'expo';
import {
  Platform, StyleSheet, Text, View, Image, ScrollView, FlatList,
  TouchableOpacity,
} from 'react-native';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';
import Accordion from '../components/Accordion';
import * as Formatter from '../components/Formatter';

export default class ReferralHistory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      referralHistories: [],
    }
  }

  static navigationOptions = {
    title: 'Riwayat Referral',
  };

  componentDidMount() {
    this._fetchReferralHistories();
  }

  _fetchReferralHistories = () => {
    const version = 'v1';
    let request = {
      path: `/${version}/account/referraldetail`,
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    fetchTravoramaApi(request).then(res => {
      this.setState({ referralHistories: res.referralDetails });
    }).catch(error => console.log(error));
  }

  _keyExtractor = (item, index) => index
  _renderContent = item => <ListItem item={item}/>
  _renderHeader = item =>
    <View style={{flex:1,flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
      <Text style={styles.h1}>{item.name}</Text>
      <Text style={styles.h2}>
        {item.history.filter(step=>step.stepStatus!=false).length}/{item.history.length} Reward
      </Text>
    </View>

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#fff',}}>
        <Accordion
          style={styles.containerRiwayat}
          sections={this.state.referralHistories}
          renderContent={this._renderContent}
          renderHeader={this._renderHeader}
        />
        {/*
        <FlatList
            data={this.state.referralHistories}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
        />*/}
      </ScrollView>
    );
  }
}

class ListItem extends React.PureComponent {
  render() {
    let {item} = this.props;
    return (
        <View style={styles.containerRiwayat}>
          { item.history.map( (step,index) =>
            <View key={index} 
              style={[
                styles.referralAccordionItem,
                { opacity:step.stepStatus!=false?1:.5 }
              ]}
            >
              <View style={{flex:0.8}}>
                <Image 
                  style={{width:25, height:25}}
                  source={ step.stepStatus!=false ?
                    require('../../assets/images/check.png') :
                    require('../../assets/images/uncheck.png')
                  }
                />
              </View>
              <View style={{flex:7}}>
                <Text style={styles.activityJudulReward}>{Formatter.price(step.referralCredit)}</Text>
                <Text style={styles.activityDesc}>{step.stepDetail}</Text>
              </View>
            </View>
          )}  
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex:1,
    padding:20,
  },
  h1:{
    fontFamily: 'Hind-SemiBold',
    fontSize: 20,
    color: '#454545',
    backgroundColor:'transparent',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop:15 ,
        marginBottom: -10,
      },
      android: {
        lineHeight: 30,
        marginBottom:5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  h2:{
    fontSize: 13,
    color: '#454545',
    backgroundColor:'transparent',
    alignItems: 'flex-end',
  },
  containerRiwayat:{
    padding:15,
    borderBottomWidth:1,
    borderBottomColor:'#d7d7d7',
  },
  activityJudulReward: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind-SemiBold',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityDesc: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind-Light',
    ...Platform.select({
      ios: {
        lineHeight: 14,
        paddingTop: 9,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  referralAccordionItem: {
    marginVertical: 5,
    flexDirection: 'row', 
  },

});
