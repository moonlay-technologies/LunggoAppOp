import React from 'react';
import { Text, View, StyleSheet, Platform, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

export default class MenuButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onPress}
      >
        <View style={styles.row}>
          <View style={{ width: '15%' }}>
            {this.props.icon}
          </View>
          <Text style={styles.labelHeader}>{this.props.label}</Text>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 10 }}>
            <Icon
              name='chevron-thin-right'
              type='entypo'
              size={18}
              color='#cdcdcd'
            />
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  labelHeader: {
    flex: 1,
    fontFamily: 'Hind',
    fontSize: 16,
    color: '#000',
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
})