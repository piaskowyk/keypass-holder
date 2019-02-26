import React from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Text, Alert } from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import Styles from '../constants/Style';

export default class AuthScreen extends React.Component {

	static navigationOptions = {
		header: null,
	};

  constructor(props) {
		super(props);
		this._bootstrapAsync();
	}
	
	_bootstrapAsync = async () => {
		let config = {
			apiKey: "AIzaSyAAsuGZEtjxVZVtf6v4gB9VZHNOYuvnlh8",
			authDomain: "keypass-holder.firebaseapp.com",
			databaseURL: "https://keypass-holder.firebaseio.com",
			projectId: "keypass-holder",
			storageBucket: "keypass-holder.appspot.com",
			messagingSenderId: "98637337363"
		};

    const userData = await AsyncStorage.getItem('userData');
		firebase.initializeApp(config);
		this.props.navigation.navigate(userData ? 'PinPanel' : 'AccountNavigator');
  };

  render() {
    return (
        <View style={Styles.container}>
				<Text style={Styles.textHd}>KeyPass Holder</Text>
           <Text style={Styles.textHd}>Loading...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
  }
}