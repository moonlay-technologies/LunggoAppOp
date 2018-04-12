'use strict';

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image, TextInput,
  ScrollView, TouchableOpacity, Animated
} from 'react-native';
import * as Formatter from '../components/Formatter';
import globalStyles from '../../commons/globalStyles';
import Colors from '../../constants/Colors';
import ImageSlider from 'react-native-image-slider';
import Accordion from '../components/Accordion';
import Button from 'react-native-button';
import { Rating, Icon } from 'react-native-elements';
import WishButton from '../components/WishButton';
import Swiper from 'react-native-swiper';
import LoadingAnimation from '../components/LoadingAnimation';
import {
  AUTH_LEVEL, fetchTravoramaApi, checkUserLoggedIn,
} from '../../api/Common';
import { MultilineText } from '../components/StyledText'
import { APP_TYPE } from '../../constants/env';
import Maps from '../components/Maps';
import Avatar from './../../commons/components/Avatar';

const { getItemAsync, setItemAsync, deleteItemAsync } = Expo.SecureStore;

export default class DetailScreen extends Component {

  constructor(props) {
    super(props);
    this._onWishlist = this._onWishlist.bind(this);
    let { details, id } = this.props.navigation.state.params;

    let item = { ...details }
    if (!Array.isArray(item.mediaSrc))
      item.mediaSrc = [details.mediaSrc];

    this.state = {
      ...item,
      review: {
        rating: 0.0,
        reviewCount: 0,
      },
      lat: 0, lng: 0,
      contents: [],
      scrollY: new Animated.Value(0),
      isLoading: true,
      isDateLoading: true,
    };
  }

  static navigationOptions = { header: null }

  componentDidMount() {
    const version = 'v1';
    const { id } = this.state;
    let request = {
      path: `/${version}/activities/${id}`,
      requiredAuthLevel: AUTH_LEVEL.Guest,
    };
    fetchTravoramaApi(request).then(response => {
      this.setState(response.activityDetail);
      this.setState({ isLoading: false });
      if (!response.activityDetail.package) {
        console.log('PACKAGES:');
        console.log(response.activityDetail.package);
        console.error(response.activityDetail.package);
      }
    }).catch(error => console.log(error));

    request.path = `/${version}/activities/${id}/availabledates`;
    fetchTravoramaApi(request).then(response => {
      this.setState(response);
      this.setState({ isDateLoading: false });
      // this.forceUpdate( () => {/*this.marker.showCallout()*/} );
    }).catch(error => console.log(error));
  }

  _onWishlist = async ({ wishlisted }) => {
    new Promise(() => {
      this.setState({ wishlisted });
    });
  }

  _isDateAvailable = (availableDates) => {
    if (availableDates.length > 0) {
      return (
        <Footer price={this.state.price} details={this.state} {...this.props} />
      );
    }
    else {
      return (
        <View style={globalStyles.bottomCtaBarContainer}>
          <View>
            <Text style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 20,
            }}>Aktivitas Tidak Tersedia</Text>
          </View>
        </View>
      )
    }
  }

  render() {
    const { requiredPaxData, isLoading, name, city, duration, price, id,
      mediaSrc, address, lat, long, wishlisted, shortDesc, contents,
      review, reviewCount, rating, ratingCount, additionalContents, isDateLoading, availableDateTimes } = this.state;
    return (
      <View>
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } },
          ])}
          scrollEventThrottle={16}
        >

          <MediaContents media={mediaSrc} />

          <View style={styles.container}>


            {(isLoading || isDateLoading) && (
              <LoadingAnimation />
            )}


            {(!isLoading && !isDateLoading) && (
              <View>
                <MainInfo name={name} shortDesc={shortDesc} city={city} duration={duration} />
                <Contents contents={contents} />

                <TouchableOpacity onPress={() => this.props.navigation.navigate('CancelationPolicy')}>
                  <View style={[styles.containerdescriptionActivity, { flexDirection: 'row' }]}>
                    <Text style={[styles.sectionTitle, { alignItems: 'flex-start' }]}>
                      Ketentuan Pembatalan
                    </Text>
                    <View style={{ marginLeft: 10, alignItems: 'flex-end', flex: 2 }}>
                      <Icon
                        name='chevron-right'
                        type='entypo'
                        size={22}
                        color='black' />
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <ReviewAndRating rating={rating} ratingCount={ratingCount} review={review} reviewCount={reviewCount} id={id} {...this.props} />

                <View style={styles.divider} />

                <View style={styles.containerdescriptionActivity}>
                  <Text style={styles.sectionTitle}>
                    Lokasi
                  </Text>
                  <Maps lat={lat} long={long} name={name} address={address} city={city} {...this.props} />
                </View>

                <Accordion style={styles.containerdescriptionActivity}
                  sections={additionalContents.contents} />
                {/*<Recommendation />*/}
              </View>
            )}
          </View>
          <View style={{ paddingBottom: 95 }}></View>

        </ScrollView>
        
        <Header wishlisted={wishlisted} id={id} scrollY={this.state.scrollY} title={name} _onWishlist={this._onWishlist} {...this.props} />
        {
          (!isLoading && !isDateLoading) &&  (
            this._isDateAvailable(availableDateTimes)
          )
        }

      </View>
    );
  }
}

class Footer extends Component {
  constructor(props) {
    super();
    this.state = { isLoading: false };
  }

  _goToBookingDetail = async () => {
    this.setState({ isLoading: true })
    const { requiredPaxData, price, id, availableDateTimes, name } = this.props.details;
    let isUserLoggedIn = await checkUserLoggedIn();
    let nextScreen = isUserLoggedIn ? 'BookingDetail' : 'BeforeLoginScreen';
    this.props.navigation.navigate(nextScreen, {
      price, requiredPaxData, availableDateTimes,
      package: this.props.details.package,
      activityId: id, title: name
    });
    this.setState({ isLoading: false })
  }

  _goToEditActivity = () => this.props.navigation.navigate('EditDetailActivity')

  _onCtaButtonClick = () => {
    //// if customer
    if (APP_TYPE == 'CUSTOMER') this._goToBookingDetail();
    //// if operator
    if (APP_TYPE == 'OPERATOR') this._goToEditActivity();
  }

  render() {
    let { price } = this.props;
    return (
      <View style={globalStyles.bottomCtaBarContainer}>
        <View style={{ alignItems: 'flex-start', flex: 1.5 }}>
          <View >
            <Text style={{ fontSize: 12, color: '#676767', }}>Mulai dari</Text>
          </View>
          <View>
            <Text style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 20,
            }}>{Formatter.price(price)}</Text>
          </View>

        </View>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          <Button
            containerStyle={globalStyles.ctaButton}
            style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
            onPress={this._onCtaButtonClick}
            disabled={this.state.isDateLoading}
            styleDisabled={{ color: '#aaa' }}
          >
            {(APP_TYPE == 'CUSTOMER') ? 'Pesan' : 'Edit'}
          </Button>
        </View>
      </View>
    );
  }
}

class Header extends Component {

  componentWillMount() {
    let half = [200, 400];
    let sudden = [380, 400];
    let { scrollY } = this.props;
    this.setState({
      backgroundColor: scrollY.interpolate({
        inputRange: half,
        outputRange: ['#fff0', '#ffff'],
        extrapolate: 'clamp',
      }),
      elevation: scrollY.interpolate({
        inputRange: half,
        outputRange: [0, 2],
        extrapolate: 'clamp',
      }),
      opacity: scrollY.interpolate({
        inputRange: sudden,
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    });
  }

  _goBack = () => this.props.navigation.goBack()

  render() {
    let { wishlisted, id, title } = this.props;
    let { backgroundColor, elevation, opacity } = this.state;
    // let borderBottomWidth = opacity;
    return (
      <Animated.View style={[styles.headerBackground, { backgroundColor, elevation }]}>
        <View style={styles.headerContentContainer}>
          {/*<View style={[ styles.headerContentContainer,
          {
            ...Platform.select({
              ios: {borderBottomWidth}
            })
          }
        ]}>*/}
          <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start' }} onPress={this._goBack}>
            <Icon name='arrow-back' type='materialicons' size={30} color='#000' />
          </TouchableOpacity>
          <Animated.View style={{ opacity, flex: 6.5 }}>
            <Text
              style={[styles.activitydetailTitleHeader,
              { marginTop: 4, textAlign: 'center' }
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </Animated.View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
            {/* <TouchableOpacity style={{ marginLeft: 10 }}>
              <Icon name='share' type='materialicons' size={30} color='#000' />
            </TouchableOpacity> */}
            <WishButton wishlisted={wishlisted} id={id} big={true} onPress={this.props._onWishlist}
              {...this.props} style={{ marginLeft: 5 }} unwishlistedColor={'#000'} />
          </View>
        </View>
      </Animated.View>
    );
  }
}

/*class Recommendation extends Component {

  render() {
    return (
      <View>
        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Similiar Activities</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', }}>
              <Text style={styles.seeMore}>See More</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ width: 140, marginLeft: 15, }}>
              <Image style={styles.thumbnailMedium} source={require('../../assets/images/other-img1.jpg')} />
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <View style={{ flex: 4, }}>
                  <Text style={styles.namaKota}>
                    Jepang
                    </Text>
                  <Text style={styles.activityTitle}>
                    Create your own Sushi
                    </Text>
                  <Text style={styles.priceTitle}>
                    IDR 300.000
                    </Text>
                  <View>
                    <Rating
                      type="star"
                      fractions={1}
                      startingValue={3.6}
                      readonly
                      imageSize={11}
                      ratingColor="#00c5bc"
                      onFinishRating={this.ratingCompleted}
                      style={{ paddingTop: 2.5, marginRight: 5, }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 0 }}>
                  <Icon
                    name='favorite-border'
                    type='materialicons'
                    size={24}
                    color='#cdcdcd' />
                </View>
              </View>
            </View>
            <View style={{ width: 140, marginLeft: 15, }}>
              <Image style={styles.thumbnailMedium} source={require('../../assets/images/other-img2.jpg')} />
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <View style={{ flex: 4, }}>
                  <Text style={styles.namaKota}>
                    Jepang
                    </Text>
                  <Text style={styles.activityTitle}>
                    Create your own Sushi
                    </Text>
                  <Text style={styles.priceTitle}>
                    IDR 300.000
                    </Text>
                  <View>
                    <Rating
                      type="star"
                      fractions={1}
                      startingValue={3.6}
                      readonly
                      imageSize={11}
                      ratingColor="#00c5bc"
                      onFinishRating={this.ratingCompleted}
                      style={{ paddingTop: 2.5, marginRight: 5, }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 0 }}>
                  <Icon
                    name='favorite-border'
                    type='materialicons'
                    size={24}
                    color='#cdcdcd' />
                </View>
              </View>
            </View>
            <View style={{ width: 140, marginLeft: 15, marginRight: 15 }}>
              <Image style={styles.thumbnailMedium} source={require('../../assets/images/other-img3.jpg')} />
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <View style={{ flex: 4, }}>
                  <Text style={styles.namaKota}>
                    Jepang
                    </Text>
                  <Text style={styles.activityTitle}>
                    Create your own Sushi
                    </Text>
                  <Text style={styles.priceTitle}>
                    IDR 300.000
                    </Text>
                  <View>
                    <Rating
                      type="star"
                      fractions={1}
                      startingValue={3.6}
                      readonly
                      imageSize={11}
                      ratingColor="#00c5bc"
                      onFinishRating={this.ratingCompleted}
                      style={{ paddingTop: 2.5, marginRight: 5, }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 0 }}>
                  <Icon
                    name='favorite-border'
                    type='materialicons'
                    size={24}
                    color='#cdcdcd' />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}*/

class Contents extends Component {

  render() {
    let { contents } = this.props;
    return contents.length ?
      (<View>
        {contents.map((content, index) => (
          <View key={index}>
            <View style={styles.containerdescriptionActivity} >
              <Text style={styles.sectionTitle}>
                {content.title}
              </Text>
              <MultilineText style={styles.activityDesc}>
                {content.desc}
              </MultilineText>
            </View>
            <View style={styles.divider} />
          </View>
        ))}

      </View>) :
      null;
  }
};

class MainInfo extends Component {

  render() {
    console.log('main info rerendered');
    let { name, shortDesc, city, duration = {} } = this.props;
    return (
      <View>
        <View style={{ paddingTop: 10, paddingBottom: 20 }}>
          <View >
            <Text style={styles.activitydetailTitle}>
              {name}
            </Text>
          </View>
          <View style={{ marginBottom: 15 }}>
            <MultilineText style={styles.activityDesc}>
              {shortDesc}
            </MultilineText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Icon name='ios-pin' type='ionicon' size={18} color='#009389' />
            <View style={{ marginTop: 1, marginLeft: 10 }}>
              <Text style={styles.activityDesc}>
                {city}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
            <Icon name='ios-person' type='ionicon' size={18} color='#009389' />
            <View style={{ marginTop: 1, marginLeft: 10 }}>
              <Text style={styles.activityDesc}>
                DUMMY Maksimum 6 orang
                  </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
            <Icon name='ios-calendar' type='ionicon' size={18} color='#009389' />
            <View style={{ marginTop: 1, marginLeft: 10 }}>
              <Text style={styles.activityDesc}>
                DUMMY Khusus hari minggu
                  </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
            <Icon name='ios-clipboard' type='ionicon' size={18} color='#009389' />
            <View style={{ marginTop: 1, marginLeft: 10 }}>
              <Text style={styles.activityDesc}>
                DUMMY Untuk usia diatas 10 tahun
                  </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
            <Icon name='md-alarm' type='ionicon' size={18} color='#009389' />
            <View style={{ marginTop: 1, marginLeft: 10 }}>
              <Text style={styles.activityDesc}>
                {duration.amount + " " + duration.unit}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 3 }}>
            <Text>{'\u2022'}</Text>
            <Text style={[styles.activityDesc,
            { paddingLeft: 5 }]}>23.00 - 24.00: Guest picked-up in Surabaya city center jakarta selatan</Text>
          </View>

        </View>
        <View style={styles.divider} />
      </View>
    );
  }
}

class MediaContents extends Component {
  constructor(props) {
    super(props);
  }

  ActiveDot = <View style={styles.activeDot} />;
  Dot = <View style={styles.dot} />;

  render() {
    let { media } = this.props;
    return media.length == 1
      ?
      <View style={styles.wrapper}>
        <Image style={styles.slides} source={{ uri: media[0] }} />
      </View>
      : (
        <Swiper
          style={styles.wrapper}
          activeDot={this.ActiveDot}
          dot={this.Dot}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={3.5}
          loop={false}
        >
          {media.map((m, idx) => (
            <Image style={styles.slides} source={{ uri: m }} key={idx} />
          ))}
        </Swiper>
      )
  }
}

class ReviewAndRating extends Component {

  render() {
    let { rating, ratingCount, review, reviewCount, id } = this.props;
    return (
      <View>
        <View style={styles.containerdescriptionActivity}>
          <Text style={styles.sectionTitle}>
            Review
        </Text>
          {!reviewCount && (

            <Text style={styles.activityDesc}>
              Belum ada review
            </Text>
          )}
          {!!reviewCount && (
            <View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                  <View style={{ marginRight: 10 }}>
                    <Avatar size={45} style={styles.avatar} name={review.name} source={(review.avatar && { uri: review.avatar })} />
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.reviewTitle}>
                      {review.name}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {Formatter.dateLong(review.date)}
                    </Text>
                  </View>
                </View>
                {/*<View style={{ flex: 1, alignItems: 'flex-end', justifyContent:'center' }}>
                <Text style={styles.reviewDate}>
                  {Formatter.dateLong(review.date)}
                </Text>
              </View>*/}
              </View>
              <View style={{ marginTop: 10 }}>

                <MultilineText style={styles.isireview}>
                  {review.content}
                </MultilineText>
              </View>
            </View>
          )}
        </View>
        <View style={styles.divider} />

        {!!reviewCount && (
          <TouchableOpacity onPress={() => reviewCount != 0 && this.props.navigation.navigate('Review', { id, rating, ratingCount })} >
            <View style={{ flex: 1, marginTop: 15, marginBottom: 15, flexDirection: 'row', }}>
              <View style={{ marginTop: 3, flexDirection: 'row', flex: 1 }}>
                <View>
                  <Text style={{ color: '#454545', fontSize: 18, fontWeight: 'bold' }}>{rating}</Text>
                </View>
                <Icon name='star' type='fontawesome' size={20} color='#00c5bc' />
              </View>

              <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', flex: 2 }}>

                <View style={{ marginBottom: 5 }}>
                  <Text style={{ color: '#454545', fontSize: 16, }}>
                    Lihat semua {reviewCount} review
                  </Text>
                </View>
                <View style={{ marginLeft: 10, }}>
                  <Icon
                    name='chevron-right'
                    type='entypo'
                    size={24}
                    color='#00c5bc' />
                </View>

              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  };
}

const styles = StyleSheet.create({
  headerContentContainer: {
    padding: 10,
    ...Platform.select({
      ios: {
        marginTop: 18,
        borderBottomColor: '#dfdfdf'
      },
      android: {
        marginTop: 5
      }
    }),
    flexDirection: 'row',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    borderBottomWidth: 0
  },
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  similarActivityContainer: {
    marginRight: 10,
    width: 150,
    // flex:1,
  },
  wrapper: { height: 400 },
  slides: {
    flex: 1,
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#9DD6EB',
  },
  thumbnailMedium: {
    resizeMode: 'cover',
    width: 140,
    height: 150,
    borderRadius: 5,
  },
  namaKota: {
    fontSize: 12,
    color: '#454545',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5
  },
  activityTitle: {
    fontFamily: 'Hind-Bold',
    fontSize: 16,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 15 * 0.8,
        paddingTop: 20 - (19 * 0.4),
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 24
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activitydetailTitle: {
    fontFamily: 'Hind-Bold',
    fontSize: 24,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop: 15,
        marginBottom: -10,
      },
      android: {
        lineHeight: 30,
        marginBottom: 20,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activitydetailTitleHeader: {
    fontFamily: 'Hind-Bold',
    fontSize: 20,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 19,
        paddingTop: 15,
        marginBottom: -10,
      },
      android: {
        lineHeight: 30,
        marginBottom: 5,
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  priceTitle: {
    fontSize: 12,
    color: '#676767',
    marginTop: 2
  },
  seeMore: {
    fontSize: 14,
    color: '#acacac'
  },
  activityDesc: {
    fontSize: 15.5,
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
  containerdescriptionActivity: {
    flex: 1,
    paddingVertical: 30
  },
  containersimiliarActivity: {
    marginBottom: 20,
    marginTop: 20,
    flex: 1
  },
  sectionTitle: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 18,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 15 * 0.8,
        paddingTop: 20 - (19 * 0.4),
        marginBottom: 0,
      },
      android: {
        lineHeight: 24,
        marginBottom: 10
      },
    }),
  },
  reviewTitle: {
    fontFamily: 'Hind-SemiBold',
    fontSize: 17,
    color: '#454545',
    ...Platform.select({
      ios: {
        lineHeight: 15 * 0.8,
        paddingTop: 20 - (19 * 0.4),
        marginBottom: -15,
        //backgroundColor:'red'
      },
      android: {
        lineHeight: 13
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  reviewDate: {
    fontSize: 13,
    color: '#9a9a9a',
    marginTop: 5

  },
  hyperlink: {
    fontSize: 11,
    marginTop: 8,
    color: '#437ef7',
    textDecorationLine: 'underline',
  },
  isireview: {
    fontSize: 15,
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
  thumbprofile: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  ul: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
  },
  li: {
    fontSize: 11,
    marginRight: 8
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  descriptionActivity: {
    fontSize: 11,
    lineHeight: 15,
  },
  lidescriptionActivity: {
    fontSize: 11,
    marginBottom: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e1e1e1',
  },
  locationActivity: {
    fontSize: 12,
    marginBottom: 5,
  },
  timeActivity: {
    fontSize: 12,
    marginBottom: 5,
  },
  detailimg: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  activeDot: {
    backgroundColor: '#01aebc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  dot: {
    backgroundColor: '#fff',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  }
});