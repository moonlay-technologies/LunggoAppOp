'use strict';

import React from 'react';
import {
  Image, Platform, ScrollView, Text, TouchableOpacity, View,
  Button, TextInput, StyleSheet, Dimensions
} from 'react-native';
import SearchHeader from './SearchActivity/SearchHeader';
import { Icon } from 'react-native-elements';
import WishButton from '../components/WishButton';
import search from './SearchActivity/SearchController';
import Swiper from 'react-native-swiper';
import * as Formatter from '../components/Formatter';
import Carousel from 'react-native-snap-carousel';
import LoadingAnimation from '../components/LoadingAnimation'
import { fetchTravoramaApi, AUTH_LEVEL } from '../../api/Common';

const { width } = Dimensions.get('window');
const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class ExploreScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tiketList: [],
      paketList: [],
      tripList: [],
      turList: [],
      promoList: [],
      isLoading: true,
      wishlists: {},
    };
    setItemAsync('skipIntro', 'true');
    this._onWishlist = this._onWishlist.bind(this)
  }

  static navigationOptions = {
    title: 'Jelajah',
    header: (props) => <SearchHeader {...props} />
  };

  _getWishlist = async () => {
    setTimeout(async () => {
      let wishlistItems = await getItemAsync('wishlist');
      if (wishlistItems != null) {
        let activityList = JSON.parse(wishlistItems);
        let wishlists = {};
        for (let i = 0; i < activityList.length; i++)
          wishlists[activityList[i].id] = true;
        this.setState({ wishlists });
      }
    }, 0);
  }

  _getPromos = async () => {
    const path = '/v1/featpromo';
    let request = { path, requiredAuthLevel: AUTH_LEVEL.Guest }
    try {
      let response = await fetchTravoramaApi(request);
      if (response) {
        return response.featuredPromos;
      } else {
        console.error('PromoAPI: no response returned!');
        return 'no response returned';
      }
    } catch (error) {
      console.error(error);
    }
  }

  _refreshContents = () => {
    Promise.all([
      search('tiket').then(tiketList => this.setState({ tiketList })),
      search('paket').then(paketList => this.setState({ paketList })),
      search('trip').then(tripList => this.setState({ tripList })),
      search('tur').then(turList => this.setState({ turList })),
      this._getPromos().then(promoList => this.setState({ promoList }))
    ]).then(response => {
      this.setState({ isLoading: false });
    });
  }

  componentDidMount() {
    this._refreshContents();
    this.props.navigation.addListener('willFocus', this._getWishlist);
    this._getWishlist();
  }

  _onWishlist = async ({ id, wishlisted }) => {
    let wishlists = this.state.wishlists;
    wishlists[id] = wishlisted;
    this.setState({ wishlists });
  }

  render() {
    let allList = [...this.state.turList, ...this.state.tripList, ...this.state.paketList, ...this.state.tiketList];
    let placeSrc = [require('../../assets/images/yogya.jpg'), require('../../assets/images/surabaya.jpg'), require('../../assets/images/bg.jpg')];
    let places = [...placeSrc, ...placeSrc, ...placeSrc];
    let placeList = places.map(place => { return { mediaSrc: place } });
    if (this.state.isLoading)
      return <LoadingAnimation />
    else
      return (
        <ScrollView style={{ backgroundColor: '#fff' }}>

          {/*<View style={{flexDirection:'row', marginTop:20}}>
            <View style={{flex:1, padding:10, borderColor:'#3adfb5', backgroundColor:'#3adfb5', borderRadius:5, borderWidth:2, flexDirection:'row', justifyContent:'center'}}>
              <View>
                <Icon
                name='md-pin'
                type='ionicon'
                size={20}
                color='#fff'/>
              </View>
              <View style={{marginLeft:5}}>
                <Text style={{color:'#fff', fontSize:18,}}>Activity</Text>
              </View>
            </View>
            <View style={{flex:1, padding:10, borderColor:'#3adfb5', backgroundColor:'#fff', borderRadius:5, borderWidth:2, flexDirection:'row', justifyContent:'center', marginLeft:10, marginRight:10,}}>
              <View>
                <Icon
                name='flight'
                type='materialicon'
                size={20}
                color='#3adfb5'/>
              </View>
              <View style={{marginLeft:5}}>
                <Text style={{color:'#acacac', fontSize:18, }}>Flight</Text>
              </View>
            </View>
            <View style={{flex:1, padding:10, borderColor:'#3adfb5', backgroundColor:'#fff', borderRadius:5, borderWidth:2, flexDirection:'row', justifyContent:'center'}}>
              <View>
                <Icon
                name='hotel'
                type='materialicons'
                size={20}
                color='#3adfb5'/>
              </View>
              <View style={{marginLeft:5}}>
                <Text style={{color:'#acacac', fontSize:18,}}>Hotel</Text>
              </View>
            </View>
          </View> */}

          {this._renderHeader({ title: 'Tiket', searchUrl: 'tiket' })}
          {this._renderContent({ list: this.state.tiketList, itemsPerScreen: 1, height: 200 })}

          {this._renderHeader({ title: 'Paket', searchUrl: 'paket' })}
          {this._renderContent({ list: this.state.paketList, itemsPerScreen: 2, height: 150 })}

          {this._renderHeader({ title: 'Trip', searchUrl: 'trip' })}
          {this._renderContent({ list: this.state.tripList, itemsPerScreen: 3, height: 150 })}

          {this._renderHeader({ title: 'Tur Keliling Kota', searchUrl: 'tur' })}
          {this._renderContent({ list: this.state.turList, itemsPerScreen: 1, height: 100 })}

          {/* {this._renderHeader({ title: 'Destinasi Favorit' })} */}
          {/* {this._renderContent({ list: placeList, itemsPerScreen: 3, height: 150 })} */}

          {this._renderHeader({ title: 'Promo Terkini' })}
          {this._renderPromo({ list: this.state.promoList, itemsPerScreen: 1, height: 100 })}

          <View style={{ paddingTop: 10 }}></View>

        </ScrollView>
      );
  }

  _goTo = (screen, params) =>
    this.props.navigation.navigate(screen, params);

  _onPressProduct = item => this._goTo('DetailScreen', { details: item });
  _onPressPromo = promo => this._goTo('WebViewScreen', { title: promo.title, url: promo.detailsUrl });
  _onPressCategory = str => this._goTo('SearchActivity', { searchString: str });

  _renderHeader({ title, searchUrl }) {
    return (
      <View style={[styles.container, { flexDirection: 'row', }]}>
        <Text style={[{ flex: 2 }, styles.categoryTitle]}>{title}</Text>
        {searchUrl && (
          <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() => this._onPressCategory(searchUrl)} >
            <Text style={styles.seeMore}>Lihat Semua</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  _renderPromo({ list, itemsPerScreen, height }) {
    let itemWidth = ((width - 1.5 * THUMBNAIL_WS) / itemsPerScreen - THUMBNAIL_WS);
    let style = StyleSheet.create({
      containerThumbnail: {
        backgroundColor: 'transparent',
        paddingBottom: 8,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowRadius: 3,
            shadowOpacity: 0.7
          },
        })
      },
      thumbnail: {
        backgroundColor: 'transparent',
        resizeMode: 'cover',
        width: itemWidth,
        height: height,
        borderRadius: 5,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowRadius: 6,
            shadowOpacity: 0.7
          },

        }),
      }
    });

    let _renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity key={item.id}
          style={{
            width: itemWidth,
            marginLeft: THUMBNAIL_WS,

          }}
          activeOpacity={1}
          onPress={() => this._onPressPromo(item)}
        >
          <View style={[style.containerThumbnail, { paddingTop: 0 }]}>
            <Image
              style={style.thumbnail}
              source={{ uri: item.bannerUrl }}
            />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <Carousel
        ref={c => this._carousel = c}
        data={list}
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={itemWidth + THUMBNAIL_WS}
        layout={'default'}
        firstItem={0}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
    );
  }

  _renderContent({ list, itemsPerScreen, height }) {
    let itemWidth = ((width - 1.5 * THUMBNAIL_WS) / itemsPerScreen - THUMBNAIL_WS);
    let style = StyleSheet.create({
      containerThumbnail: {
        backgroundColor: 'transparent',
        paddingBottom: 8,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowRadius: 3,
            shadowOpacity: 0.7
          },
        })
      },
      thumbnail: {
        backgroundColor: 'transparent',
        resizeMode: 'cover',
        width: itemWidth,
        height: height,
        borderRadius: 5,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowRadius: 6,
            shadowOpacity: 0.7
          },

        }),
      }
    });

    let _renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity key={item.id}
          style={{
            width: itemWidth,
            marginLeft: THUMBNAIL_WS,
          }}
          activeOpacity={1}
          onPress={() => this._onPressProduct(item)}
        >
          <View style={[style.containerThumbnail, { paddingTop: 0 }]}>
            <Image
              style={style.thumbnail}
              source={item.mediaSrc.toString().startsWith('http') ? { uri: item.mediaSrc } : item.mediaSrc}
            />
          </View>
          {item.name && (
            <View style={{ marginTop: 5, flexDirection: 'row', paddingTop: 0 }}>
              <View style={{
                flex: 4,
                paddingBottom: 20,
                backgroundColor: 'transparent',
              }}>
                <Text style={itemsPerScreen == 1 ? styles.namaKotaBig : styles.namaKota}>
                  {item.city}
                </Text>
                <Text style={itemsPerScreen == 1 ? styles.activityTitleBig : styles.activityTitle}>
                  {item.name}
                </Text>
                <Text style={itemsPerScreen == 1 ? styles.priceTitleBig : styles.priceTitle}>
                  {Formatter.price(item.price)}
                </Text>
              </View>
              {itemsPerScreen < 3 && (
                <View>
                  <WishButton wishlisted={this.state.wishlists[item.id]} onPress={this._onWishlist}
                    id={item.id} big={itemsPerScreen == 1} {...this.props} />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <Carousel
        ref={c => this._carousel = c}
        data={list}
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={itemWidth + THUMBNAIL_WS}
        layout={'default'}
        firstItem={0}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
    );
  }
}

const THUMBNAIL_WS = 10;
const styles = StyleSheet.create({
  /*  slides:{
      backgroundColor:'red',
      width:width/2,
       marginLeft:15
    },
    wrapper: {
      height:200,
    },
    wrapperContainer: {
      width:width/2
    },*/
  placeTitleContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 15
  },
  placeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  namaKota: {
    fontSize: 12,
    color: '#454545',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        lineHeight: 6,
        paddingTop: 14,
        marginBottom: -4,
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 18,
        marginBottom: -2

      },
    }),
  },
  namaKotaBig: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {

        lineHeight: 6,
        paddingTop: 14,
        marginBottom: -4,
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 18,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityTitleBig: {
    fontFamily: 'Hind-Bold',
    fontSize: 20,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 12,
        paddingTop: 14,
        marginBottom: -13,
      },
      android: {
        lineHeight: 24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityTitle: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'Hind-Bold',
    ...Platform.select({
      ios: {
        lineHeight: 10,
        paddingTop: 10,
        marginBottom: -12,
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 20,
        //paddingTop: 23 - (23* 1),


      },
    }),
  },
  containerThumbnailBig: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.7
      },
    }),
  },
  thumbnailBig: {
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    width: width * 0.90,
    height: 200,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.7
      },

    }),
  },
  thumbnailPromo: {
    resizeMode: 'cover',
    width: width * 0.85,
    height: 150,
    borderRadius: 5,
  },
  containerThumbnailMedium: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 5,
        shadowOpacity: 0.5
      },
      android: {
        elevation: 2,
      },
    }),
  },
  thumbnailMedium: {
    resizeMode: 'cover',
    width: width * 0.4,
    height: 150,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 5,
        shadowOpacity: 0.5
      },
    }),
  },
  thumbnailPlaces: {
    resizeMode: 'cover',
    width: '100%',
    height: 150,
    borderRadius: 5,
    opacity: 0.7
  },
  priceTitle: {
    fontSize: 13,
    color: '#676767',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        //backgroundColor:'red'
      },
      android: {
        marginTop: 1

      },
    }),
  },
  priceTitleBig: {
    fontSize: 15,
    color: '#676767',
    fontFamily: 'Hind',
    ...Platform.select({
      ios: {
        // lineHeight:19*0.8,
        // paddingTop: 20 - (19 * 0.4),
        //backgroundColor:'red'
      },
      android: {
        marginTop: 3

      },
    }),
  },
  categoryTitle: {
    fontFamily: 'Hind-Bold',
    fontSize: 22,
    color: '#454545',
  },
  seeMore: {
    fontSize: 14,
    color: '#acacac',
    marginTop: 5,
    fontFamily: 'Hind'
  },
  container: {
    // flex: 1,
    padding: THUMBNAIL_WS,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        paddingBottom: 0,
      },
      android: {
        paddingBottom: 15,

      },
    }),
  },
});