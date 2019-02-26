import React from 'react';
import { Alert, Button, TextInput, View, Text, AsyncStorage, ActivityIndicator } from 'react-native';

import CryptoJS from '../utils/CryptJS';
import User from '../entities/User';
import Styles from '../constants/Style';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

export default class PinPanelScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      pin: '1234',
      pinInfoStyle: Styles.errorInfoHide,
      isLoad: false
    };
  }

  componentDidMount(){
    // only for developer mode
    this.onLogin();
  }

  onLogin = async () => {
    this.setState({ 
      isLoad: true,
      pinInfoStyle: Styles.errorInfoHide,
     });
    this.render();

    const { pin } = this.state;

    const userData = await AsyncStorage.getItem('userData');
    var decrypted = "";
    try {
      decrypted = CryptoJS.AES.decrypt(userData, pin).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      this.setState({
        isLoad: false,
        pinInfoStyle: Styles.errorInfoShow
      });
      return;
    }

    var UserFromJson = ""
    try{
      UserFromJson = JSON.parse(decrypted);
    }
    catch{
      this.setState({
        isLoad: false,
        pinInfoStyle: Styles.errorInfoShow
      });
      return;
    }

    if(UserFromJson.email == ""){
      this.setState({
        isLoad: false,
        pinInfoStyle: Styles.errorInfoShow
      });
      return;
    }

    this.setState({ isLoad: false });

    User.uid = UserFromJson.uid;
    User.email = UserFromJson.email;
    User.password = UserFromJson.password;
    User.pin = pin;

    this.props.navigation.navigate('Home', {
      uid: UserFromJson.uid,
      email: UserFromJson.email,
      password: UserFromJson.password,
      pin: pin
    });
  }

  onLogout = async () => {
    await AsyncStorage.clear();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
    this.props.navigation.navigate('AccountNavigator');
  };

  render() {
    if (this.state.isLoad) {
      return (
        <View style={Styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else {
      return (
        <View style={Styles.container}>
          <Text style={Styles.textHd}>KeyPass Holder</Text>
          <TextInput
            value={this.state.pin}
            onChangeText={(pin) => this.setState({ pin })}
            placeholder={'PIN'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <Text style={this.state.pinInfoStyle}>Incorrect PIN</Text>

          <Text
            type={"outline"}
            style={Styles.button}
            onPress={this.onLogin.bind(this)}
          >
            LOGIN
          </Text>

          <Text
            style={Styles.textLink}
            onPress={this.onLogout}
          >
            log out
          </Text>

        </View>
      );
    }
  }
}