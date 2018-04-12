import React from 'react';
import {
  Platform, StyleSheet, FlatList, Text, View, Image,
  TextInput, TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

export default class SearchHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchString: '',
      placeholder: 'Cari petualanganmu berikutnya...',
    };
  }

  _goToSearchActivity = () => {
    let searchString = this.state.searchString.trim();
    if (searchString)
      this.props.navigation.navigate('SearchActivity', { searchString });
  };

  _goToCart = () => this.props.navigation.navigate('Cart');

  render() {
    let { navigate } = this.props.navigation;
    return (
      <View style={{ elevation: 0.75, backgroundColor: '#fff' }}>
        <View style={[styles.header, styles.flowRight]}>
          <View style={{ flex: 6, }}>
            <TextInput
              style={styles.searchInput}
              onChangeText={str => this.setState({ searchString: str })}
              onSubmitEditing={this._goToSearchActivity}
              placeholder={this.state.placeholder}
              returnKeyType='search'
              underlineColorAndroid='transparent'
              selectTextOnFocus={true}
            />
            <View //TouchableOpacity onPress={this._goToSearchActivity}
              style={{ position: 'absolute', left: 5, top: -3, padding: 9 }}
            >
              <Icon name='magnifying-glass' type='entypo' size={20}
                color='#ccc' />
            </View>
          </View>
          <TouchableOpacity style={{flex:1,alignItems:'center',}} onPress={this._goToCart} activeOpacity={0.8} >
            <Icon name='ios-cart' type='ionicon' size={33} color='#00d3c5' />
           {/* <View style={styles.notification}>
              <Text style={styles.txtNotification}>3</Text>
            </View>*/}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  notification: {
    backgroundColor: '#ffc943',
    height: 18,
    width: 18,
    position: 'absolute',
    right: 0,
    top: -3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  txtNotification: {
    color: '#fff',
    fontFamily: 'Hind-Bold',
    fontSize: 12,
    ...Platform.select({
      ios: {
        //backgroundColor:'red',
        height: 11,
        lineHeight: 16,
      },
    })
  },
  header: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        /* paddingHorizontal:15,
         paddingTop:30,
         paddingBottom:10,
         shadowColor: '#cdcdcd',
         shadowOffset: { height: 3 },
         shadowOpacity: 0.2,
         shadowRadius: 2,
         // paddingVertical:15,*/
        paddingHorizontal: 15,
        paddingTop: 30,
        paddingBottom: 13,
        borderBottomColor: "#ececec",
        borderBottomWidth: 1,
      },
      android: {
        paddingHorizontal: 12.6,
        paddingVertical: 12.6,
        borderBottomColor: "#ececec",
        borderBottomWidth: 1,

      },
    }),
  },
  searchInput: {
    height: 33,
    paddingLeft: 40,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#00d3c5',
    borderRadius: 20,
    color: '#acacac',
    backgroundColor: '#ffffff',
  },
});