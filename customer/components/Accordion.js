import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import CollapsibleAccordion from 'react-native-collapsible/Accordion';

export default class Accordion extends React.Component {

  constructor(props) {
    super(props);
    this.icons = {   
      'up'   : require('../../assets/icons/up-arrow.png'),
      'down' : require('../../assets/icons/down-arrow.png')
    };
  }

  _renderHeader(section, isActive) {
    let icon = isActive ? this.icons['up'] : this.icons['down'];
    return (
      <View>
        <View style={styles.titleContainer}>
          { this.props.renderHeader ?
            this.props.renderHeader(section)
            :
            <Text style={styles.title}>
              {section.title || section.name || section.header}
            </Text>
          }
          <Image style={styles.buttonImage} source={icon}/>
        </View>
      </View>
    );
  }

  _renderContent = section => {
    if (this.props.renderContent) return (
      <View>
        {this.props.renderContent(section)}
      </View>
    );
    else return (
      <View style={styles.content}>
        <Text style={styles.activityDesc}>{section.desc}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <CollapsibleAccordion
          sections={this.props.sections}
          underlayColor={'transparent'}
          renderHeader={(section, index, isActive) =>
            this._renderHeader(section,isActive)
          }
          renderContent={this._renderContent}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#efefef',
  },
  titleContainer: {
    flexDirection: 'row',
    marginVertical:20,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  title: {
    flex    : 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#454545',
  },
  buttonImage: {
    width : 20,
    height: 20,
    
  },
  content: {
    overflow: 'hidden',
    paddingBottom:30
  },
    divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#efefef',
  },
  activityDesc: {
    fontSize: 16,
    color: '#454545',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 15 * 0.8,
        paddingTop: 10,
        marginBottom: -10
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e1e1e1',
  },


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

})