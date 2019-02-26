import React from 'react';
import { View, Text, AsyncStorage, ScrollView, YellowBox, Alert, TouchableOpacity } from 'react-native';
import Styles from '../constants/Style';

export default class InfoScreen extends React.Component {

  static navigationOptions = {
    title: "Info",
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={Styles.containerNoCenter}>
					<Text style={Styles.textHd}>KeyPass Holder</Text>
          <Text>Info about application</Text>
        </View>
    );
  }
}