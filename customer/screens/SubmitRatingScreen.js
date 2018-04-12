'use strict';

import React, { Component } from 'react';
import Button from 'react-native-button';
import { Rating, Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import LoadingAnimation from '../components/LoadingAnimation';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  AUTH_LEVEL, fetchTravoramaApi, checkUserLoggedIn,
} from '../../api/Common';
import Swiper from 'react-native-swiper';

export default class SubmitRatingScreen extends React.Component {

  static navigationOptions = {
    title: 'Beri Rating',
  };

  constructor(props) {
    super(props);
    this.state = {
      step: this.props.navigation.state.params.step || 0,
      questions: this.props.navigation.state.params.questions || [],
      hasRetrievedQuestions: this.props.navigation.state.params.hasRetrievedQuestions || false,
      answers: this.props.navigation.state.params.answers || [],
      rsvNo: this.props.navigation.state.params.rsvNo || ''
    };
  }

  componentDidMount() {
    if (!this.state.hasRetrievedQuestions) {
      const version = 'v1';
      this.setState({ starCount: 0 });
      let rsvNo = this.props.navigation.state.params.rsvNo;
      let request = {
        path: `/${version}/activities/mybooking/${rsvNo}/ratingquestion`,
        requiredAuthLevel: AUTH_LEVEL.User,
      };
      fetchTravoramaApi(request).then(response => {
        this.setState({
          questions: response.questions,
          hasRetrievedQuestions: true
        })
      }).catch(error => console.log(error));
    }
  }

  _submitRating = () => {
    setTimeout(() => {
      let { step, questions, answers, hasRetrievedQuestions, rsvNo } = this.state
      answers.push({
        question: questions[step],
        rate: this.state.starCount,
        date: new Date()
      })
      if (step == questions.length - 1) {
        this._submitAllRating();
        this.props.navigation.navigate('SubmitReview', { rsvNo: rsvNo });
      }
      else {
        this.props.navigation.navigate('SubmitRating', {
          rsvNo: rsvNo,
          step: step + 1,
          questions: questions,
          answers: answers,
          hasRetrievedQuestions: hasRetrievedQuestions
        });
        // this.setState({ step: step + 1, starCount: 0 })
      }
    }, 500);
  }

  _submitAllRating = () => {
    const version = 'v1';
    let rsvNo = this.state.rsvNo;
    let request = {
      path: `/${version}/activities/mybooking/${rsvNo}/ratinganswer`,
      requiredAuthLevel: AUTH_LEVEL.User,
      data: { answers: this.state.answers },
      method: 'POST'
    };
    fetchTravoramaApi(request)
      .catch(error => console.log(error));
  }

  render() {
    const question = this.state.questions[this.state.step];
    return (
      this.state.hasRetrievedQuestions ? (
        <View style={styles.container}>
          <View style={styles.containerReview}>
            <View>
              {!this.state.step && (
                <View style={{ marginBottom: 40 }}>
                  <Text style={styles.activityTitleBig}>Terima kasih telah memesan aktivitas di Travorama!</Text>
                </View>
              )}
              <View>
                <Text style={styles.activityDesc}>{question}</Text>
              </View>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starColor={'#f2a609'}
                  emptyStarColor={'#f2a609'}
                  starSize={35}
                  rating={this.state.starCount}
                  selectedStar={(rating) => {
                    this.setState({ starCount: rating });
                    this._submitRating();
                  }}
                />
              </View>
            </View>
          </View>
        </View>)
        :
        <LoadingAnimation />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  containerSubmit: {
    backgroundColor: '#23d3c3',
    paddingVertical: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '111%'
  },
  containerReview: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 3,
    marginTop: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 6,
        shadowOpacity: 0.1
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activityTitleBig: {
    fontFamily: 'Hind',
    fontSize: 30,
    color: '#454545',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 16,
        paddingTop: 24,
        marginBottom: -30,
      },
      android: {
        lineHeight: 36
        //paddingTop: 23 - (23* 1),

      },
    }),
  },
  activityDesc: {
    fontSize: 17,
    color: '#454545',
    fontFamily: 'Hind',
    textAlign: 'center',
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
});
