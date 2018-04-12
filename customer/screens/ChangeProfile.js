'use strict';

import React from 'react';
import { phoneWithoutCountryCode_Indonesia } from '../components/Formatter';
import PersonDataForm from '../../commons/components/PersonDataForm';
import { AUTH_LEVEL, fetchTravoramaApi, backToMain } from '../../api/Common';
import { fetchProfile } from '../../commons/ProfileController';

export default class ChangeProfile extends React.Component {

  constructor(props, context) {
    super(props, context);
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
    this.setState({ isLoading: false });
    if (changeProfileResponse.status == 200) {
      await fetchProfile();
      backToMain(this.props.navigation);
    } else {
      // TODO: display if timeout or failed
      console.log('failed to fetch profile. response:');
      console.log(changeProfileResponse);
    }
  }

  render() {
    return (
      <PersonDataForm
        contact={this.props.navigation.state.params.profile}
        onSubmit={this._changeProfile}
        formTitle='Ubah Profil'
        submitButtonText='OK' />
    );
  }
}
