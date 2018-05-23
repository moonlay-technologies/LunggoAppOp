'use strict';
import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default StyleSheet.create({
  ctaButton: {
    height: 45,
    width: '100%',
    paddingTop: 13,
    paddingBottom: 13,
    overflow: 'hidden',
    borderRadius:25,
    backgroundColor: Colors.primaryColor,
  },
  ctaButton2: {
    height: 40,
    width: '100%',
    paddingTop: 11,
    paddingBottom: 13,
    overflow: 'hidden',
    borderRadius:3,
    backgroundColor: Colors.primaryColor,
  },
  ctaButton3: {
    height: 20,
    width: '100%',
    overflow: 'hidden',
    borderRadius:3,
  },
  ctaButton4: {
    width: '85%',
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden',
    borderRadius:2,
    backgroundColor: '#00d3c5',
  },
  ctaButton5: {
    width: '85%',
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden',
    borderRadius:4,
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor:'#00d3c5',
  },
  ctaButton6: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    overflow: 'hidden',
    borderRadius:2,
    backgroundColor: '#00d3c5',
  },
  ctaButton7: {
    width: '70%',
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden',
    borderRadius:3,
    backgroundColor: '#f57b76',
  },
  ctaButton8: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    overflow: 'hidden',
    borderRadius:3,
    backgroundColor: '#f57b76',
  },
  ctaButtonReview: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    overflow: 'hidden',
    borderRadius:3,
    backgroundColor: '#ffc300',
    borderWidth:1,
    borderColor:'#ffc300'
  },
  bottomCtaBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fbfbfb',
    padding: 20,
    borderTopColor: "#efefef",
    borderTopWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  bottomCtaBarContainer1: {
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    padding: 20,
    borderTopColor: "#efefef",
    borderTopWidth: 1,
  },
    bottomCtaBarContainer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fbfbfb',
    padding: 20,
    borderTopColor: "#efefef",
    borderTopWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  openingText: {
    fontSize:56, color:'#fff', 
    fontFamily: 'Hind-Bold',
    ...Platform.select({
      ios: {
        lineHeight:56*0.4,
        paddingTop: 76 - (56 * 0.4)
      },
      android: {
        lineHeight:56,
        paddingBottom: 30
      },
    }),
  },
  categoryTitle :{
    fontFamily:'Hind-Bold',
    fontSize:30,
    color:'#454545',
    ...Platform.select({
      ios: {
        lineHeight:20,
        paddingTop: 30 - (30 * 0.2),
        height:40
        //backgroundColor:'red'
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),
        //backgroundColor:'red'

      },
    }),
  },
  categoryTitle1 :{
    fontFamily:'Hind-Bold',
    fontSize:26,
    color:'#454545',
    ...Platform.select({
      ios: {
        lineHeight:20,
        paddingTop: 30 - (30 * 0.2),
        height:40
        //backgroundColor:'red'
      },
      android: {
        //lineHeight:24
        //paddingTop: 23 - (23* 1),
        //backgroundColor:'red'

      },
    }),
  },
});