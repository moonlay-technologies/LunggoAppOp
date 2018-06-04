'use strict';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common';
import { fetchAppointmentRequests } from './Appointments/AppointmentController';
import MenuButton from './../components/MenuButton';

const ReasonTexts = {
    tidak_cukup_tempat: "Tidak cukup tempat",
    terjadi_perubahan_tempat: "Terjadi perubahan tempat",
    tempat_ditutup_sementara: "Tempat ditutup sementara",
}

export default class CancellationReason extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rsvNo: props.navigation.state.params.rsvNo
        }
    }

    _respondRequest = (rsvNo, action, cancellationReason = null) => {
        const { withConnHandler } = this.props.screenProps;
        const version = 'v1';
        this.setState({ isLoading: true });
        const request = {
            path: `/${version}/operator/appointments/${action}/${rsvNo}`,
            method: 'POST',
            requiredAuthLevel: AUTH_LEVEL.User,
            data: { cancellationReason }
        }
        withConnHandler( () => fetchTravoramaApi(request) )
        .then(response => {
            withConnHandler(fetchAppointmentRequests).then( () => {
                this.props.navigation.goBack();
            });
        }).catch(console.log);
    }

    declineAppointment = cancellationReason => {
        Alert.alert('Menolak Pesanan',
            `Kamu yakin akan menolak pesanan ini dengan alasan ${cancellationReason}?`,
            [
                {
                    text: 'Ya',
                    onPress: () => this._respondRequest(
                        this.state.rsvNo, "decline", cancellationReason
                    ),
                },
                {
                    text: 'Tidak'
                },
            ]
        );
    }

    render() {
        return (
            <View style={styles.boxDetail}>
                <MenuButton
                    label={ReasonTexts.tidak_cukup_tempat}
                    onPress={() => this.declineAppointment(ReasonTexts.tidak_cukup_tempat)}
                />
                <MenuButton
                    label={ReasonTexts.terjadi_perubahan_tempat}
                    onPress={() => this.declineAppointment(ReasonTexts.terjadi_perubahan_tempat)}
                />
                <MenuButton
                    label={ReasonTexts.tempat_ditutup_sementara}
                    onPress={() => this.declineAppointment(ReasonTexts.tempat_ditutup_sementara)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    boxDetail: {
        backgroundColor: '#fff',
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        flex: 1
    },
});

