'use strict';

import React from 'react';
import {phoneWithoutCountryCode_Indonesia} from '../components/Formatter';
import PersonDataForm from '../../commons/components/PersonDataForm';
import { getProfile } from '../../commons/ProfileController';
import { CheckBox } from 'react-native-elements';

export default class AddBookingContact extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...props.navigation.state.params.contact,
      isContactNeverFilled: props.navigation.state.params.isContactNeverFilled,

    }
    this.getProfile = getProfile();
  }

  _fillMyContactInfo = async () => {
    let contact = await this.getProfile;
    this.setState({isContactNeverFilled:false, ...contact});
  }

  _backAndSetContact = contactData => {
    let { name, email, countryCallCd } = contactData;
    let phone = phoneWithoutCountryCode_Indonesia(contactData.phone);
    let contact = { name, email, phone, countryCallCd };
    this.props.navigation.state.params.setContact(contact);
    this.props.navigation.goBack();
  }

  _fillMyContactInfoCheckbox = () => (
    (this.state.isContactNeverFilled) ?
      <CheckBox size={18} textStyle={{ fontSize: 13 }} style={{ marginBottom: 20 }}
        title='Pesan untuk saya sendiri'
        checkedColor='#01d4cb' uncheckedColor='grey' checked={false}
        onPress={this._fillMyContactInfo}
      /> : null
  )

  render() {
    return (
      <PersonDataForm onSubmit={this._backAndSetContact} formTitle='Kontak'
        contact={{...this.state}} submitButtonText='OK'
        additionalContent={<this._fillMyContactInfoCheckbox/>}
      />
    );
  }
}
