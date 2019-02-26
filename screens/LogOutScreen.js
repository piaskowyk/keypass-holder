import React from 'react';
import { View, ActivityIndicator, AsyncStorage, Text } from 'react-native';
import Styles from '../constants/Style';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

export default class Screen extends React.Component {

	static navigationOptions = {
		header: null,
		title: "Log out",
	};

  constructor(props) {
		super(props);
		this._bootstrapAsync();
	}
	
	_bootstrapAsync = async () => {
    await AsyncStorage.clear();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
    this.props.navigation.navigate('AccountNavigator');
  };

  render() {
    return (
        <View style={Styles.container}>
					<Text style={Styles.textHd}>KeyPass Holder</Text>
          <Text style={Styles.textHd}>Log out...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
  }
}