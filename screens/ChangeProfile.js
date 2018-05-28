'use strict';

import React from 'react';
import { phoneWithoutCountryCode_Indonesia } from '../components/Formatter';
import PersonDataForm from '../components/PersonDataForm';
import { AUTH_LEVEL, fetchTravoramaApi, backToMain } from '../api/Common';
import { fetchProfile } from '../logic/ProfileController';
import LoadingAnimation from './../components/LoadingAnimation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingModal from './../components/LoadingModal';
import { NavigationActions } from 'react-navigation';

export default class ChangeProfile extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false
    };
  }

  _changeProfile = async  profile => {
    this.setState({ isLoading: true });

    let request = {
      path: '/v1/profile',
      method: 'PATCH',
      data: { ...profile },
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    var changeProfileResponse = await fetchTravoramaApi(request);

    if (changeProfileResponse.status == 200) {
      await this.props.screenProps.withConnHandler(fetchProfile);
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      }));
    } else {
      // TODO: display if timeout or failed
      console.log('failed to fetch profile. response:');
      console.log(changeProfileResponse);
    }

    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingModal isVisible={this.state.isLoading} />
    }
    else

      return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} enableAutomaticScroll={true}>
          <LoadingModal isVisible={this.state.isLoading} />
          <PersonDataForm
            contact={this.props.navigation.state.params.profile}
            onSubmit={this._changeProfile}
            formTitle='Ubah Profil'
            submitButtonText='OK' />
        </KeyboardAwareScrollView>
      );
  }
}
