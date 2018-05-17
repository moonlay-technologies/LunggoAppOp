'use strict';

import React from 'react';
import ModalPlugin from 'react-native-modal';

export default class Modal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isVisible: props.isVisible || false,
    }
  }

  componentWillReceiveProps({ isVisible }) {
    this.setState({ isVisible });
  }

  setVisibility = vis => this.setState({ isVisible: vis });
  closeModal = () => this.setVisibility(false);
  openModal = () => this.setVisibility(true);
  toggleVisibility = () => this.setVisibility(!this.state.isVisible);

  render() {
    let { props } = this;
    return (
      <ModalPlugin
        style={props.style}
        animationIn={props.animationIn}
        animationOut={props.animationOut}
        backdropOpacity={props.backdropOpacity}
        isVisible={this.state.isVisible}
        onBackdropPress={props.onBackdropPress || this.closeModal}
        onBackButtonPress={props.onBackButtonPress || this.closeModal}
      >
        {this.props.children}
      </ModalPlugin>
    )
  }
}