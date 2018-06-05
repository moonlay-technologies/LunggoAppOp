'use strict';

import React from 'react';
import PersonDataForm from '../components/PersonDataForm';
import { AUTH_LEVEL, fetchTravoramaApi, backToMain } from '../api/Common';
import { fetchProfile } from '../logic/ProfileController';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationActions } from 'react-navigation';

export default class ChangeProfile extends React.Component {

  _changeProfile = async  profile => {
    const { withConnHandler } = this.props.screenProps;

    let request = {
      path: '/v1/profile',
      method: 'PATCH',
      data: { ...profile },
      requiredAuthLevel: AUTH_LEVEL.User,
    }
    const changeProfileResponse = await withConnHandler(
      () => fetchTravoramaApi(request)
    );
    if (changeProfileResponse.status == 200) {
      await withConnHandler(fetchProfile);
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      }));
    } else {
      console.log('failed to fetch profile. response:');
      console.log(changeProfileResponse);
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} enableAutomaticScroll={true}>
        <PersonDataForm
          contact={this.props.navigation.state.params.profile}
          onSubmit={this._changeProfile}
          formTitle='Ubah Profil'
          submitButtonText='OK' />
      </KeyboardAwareScrollView>
    );
  }
}
