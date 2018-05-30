'use strict';

import React from 'react';
import {
    Image, Platform, ScrollView, Text, TouchableOpacity, View, RefreshControl,
    TextInput, ActivityIndicator, TouchableNativeFeedback, StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Button from 'react-native-button';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { fetchTravoramaApi, AUTH_LEVEL } from '../api/Common';
import { getProfile } from '../logic/ProfileController';
import * as Formatter from '../components/Formatter';
import Modal from '../components/Modal';
import LoadingAnimation from '../components/LoadingAnimation';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import { checkUserLoggedIn } from '../api/Common';
import { NavigationActions } from 'react-navigation';
import {
    fetchAppointmentRequests, getAppointmentList, fetchAppointmentList, appointmentRequestItemStore, _getAppointmentRequests, _refreshAppointmentRequest, fetchAppointmentListActive, appointmentListActiveItemStore, _refreshAppointmentListActive
} from './Appointments/AppointmentController';
import { getActivityList, fetchActivityList } from './ActivityController';
import Avatar from './../components/Avatar';
import MenuButton from './../components/MenuButton';
import intervalController from './IntervalController';
import { observable, observer } from 'mobx-react';

export default class CancellationReason extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rsvNo: this.props.navigation.state.params.rsvNo
        }
    }

    _respondRequest = (rsvNo, action, cancellationReason = null) => {
        this.setState({ isLoading: true });
        const version = 'v1';
        let request = {
            path: `/${version}/operator/appointments/${action}/${rsvNo}`,
            method: 'POST',
            requiredAuthLevel: AUTH_LEVEL.User,
            data: { cancellationReason }
        }
        fetchTravoramaApi(request).then(response => {
            fetchAppointmentRequests().then(res => {
                this.props.navigation.goBack();
            }
            );
        }).catch(error => console.log(error)
        );
    }

    declineAppointment = (cancellationReason) => {
        this._respondRequest(this.state.rsvNo, "decline", cancellationReason);
    }

    render() {
        return (
            <View style={styles.boxDetail}>
                <MenuButton
                    label="Tidak cukup tempat"
                    onPress={() => this.declineAppointment("Tidak cukup tempat")}
                />
                <MenuButton
                    label="Terjadi perubahan tempat"
                    onPress={() => this.declineAppointment("Terjadi perubahan tempat")}
                />
                <MenuButton
                    label="Tempat ditutup sementara"
                    onPress={() => this.declineAppointment("Tempat ditutup sementara")}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalMenu: {
        backgroundColor: '#fff',
        width: 180,
        padding: 10,
        position: 'absolute',
        right: 10,
        top: 80,
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowRadius: 4,
                shadowOpacity: 0.2
            },
            android: {
                elevation: 2
            },
        }),
    },
    separatorOption: {
        paddingVertical: 10
    },
    containerDashboard: {
        padding: 15,
        position: 'absolute',
        top: 30,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 15,

    },
    containerBoxDashboard: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
        zIndex: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#e8f0fe',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowRadius: 2,
                shadowOpacity: 0.9
            },
            android: {
                elevation: 2
            },
        }),
    },
    boxDetail: {
        backgroundColor: '#fff',
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        flex: 1
    },
    boxSeparator: {
        height: 20
    },
    avatarBig: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 45,
    },
    namaProfile: {
        fontFamily: 'Hind-SemiBold',
        fontSize: 22,
        color: '#454545',
        letterSpacing: -1,
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -18
            },
            android: {
                marginBottom: -5

            },
        }),
    },
    labelHeader: {
        flex: 1,
        fontFamily: 'Hind',
        fontSize: 16,
        color: '#000',
        marginTop: 2,
        ...Platform.select({
            ios: {
                lineHeight: 14,
                paddingTop: 10,
                marginBottom: -12,
            },
            android: {
                lineHeight: 24,

            },
        }),
    },
    imgRecentActivity: {
        height: 125,
        width: '100%',
        resizeMode: 'cover',
        overflow: 'hidden'
    },
    saldo: {
        fontSize: 16,
        color: '#f57b76',
        marginTop: 2,
        fontFamily: 'Hind-SemiBold',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -5,
            },
            android: {

            },
        }),
    },
    teks1: {
        fontSize: 14,
        color: '#989898',
        fontFamily: 'Hind',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -5,
            },
            android: {

            },
        }),
    },
    teks2: {
        fontSize: 20,
        color: '#454545',
        fontFamily: 'Hind-SemiBold',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -5,
            },
            android: {

            },
        }),
    },
    teks3: {
        fontSize: 14,
        color: '#454545',
        fontFamily: 'Hind',
        textAlign: 'right',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -10,
            },
            android: {

            },
        }),
    },
    teks3a: {
        fontSize: 15,
        color: '#454545',
        fontFamily: 'Hind',
        textAlign: 'left',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -10,
            },
            android: {

            },
        }),
    },
    teks4: {
        fontSize: 14,
        color: '#23d3c3',
        fontFamily: 'Hind-SemiBold',
        textAlign: 'center',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -10,
            },
            android: {

            },
        }),
    },
    teks5: {
        fontSize: 14,
        color: '#f57b76',
        fontFamily: 'Hind-SemiBold',
        textAlign: 'center',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -10,
            },
            android: {

            },
        }),
    },
    ctaButton1: {
        width: '100%',
        paddingVertical: 6,
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: '#00d3c5',
    },
    ctaButton2: {
        width: '100%',
        paddingVertical: 6,
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: '#f57b76',
    },
    ctaButton3: {
        width: '100%',
        paddingVertical: 6,
        overflow: 'hidden',
        borderRadius: 3,
        borderColor: '#ff5f5f',
        borderWidth: 1
    },
    categoryTitle: {
        fontFamily: 'Hind-SemiBold',
        fontSize: 19,
        color: '#454545',
    },
    activityReviewButton: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#efefef',
    },
    credit: {
        fontSize: 15,
        marginTop: 3,
        marginLeft: 5,
        fontFamily: 'Hind',
        color: '#454545',
    },
    notification: {
        backgroundColor: '#00d3c5',
        alignItems: 'center',
        padding: 1,
        width: 15,
        height: 15,
        borderRadius: 20,
        position: 'absolute',

        ...Platform.select({
            ios: {
                right: 3,
                bottom: 14,
            },
            android: {
                right: 3,
                bottom: 11,
            },
        }),
    },
    textKecil: {
        fontSize: 12,
        fontFamily: 'Hind',
        color: '#676767',
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -8,
            },
            android: {
                marginBottom: -2,
            },
        }),
    },
    boldRating: {
        fontSize: 45,
        fontFamily: 'Hind-Bold',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -30,
            },
            android: {
                marginBottom: -14,
            },
        }),
    },
    point: {
        fontFamily: 'Hind-Bold',
        fontSize: 30,
        color: '#01d4cb',
        ...Platform.select({
            ios: {
                // lineHeight:19*0.8,
                // paddingTop: 20 - (19 * 0.4),
                marginBottom: -20,
            },
            android: {
                marginBottom: -2,
            },
        }),
    },
    activityTitle: {
        fontSize: 16,
        color: '#454545',
        fontFamily: 'Hind-SemiBold',
        textAlign: 'right',
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f8fb',
    },
});

