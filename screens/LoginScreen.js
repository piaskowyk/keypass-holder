import React from 'react';
import { Alert, TextInput, View, Text, AsyncStorage, ActivityIndicator } from 'react-native';

import User from '../entities/User';
import CryptoJS from '../utils/CryptJS';
import Styles from '../constants/Style';

import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

export default class LoginScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: 'krzychu2956@gmail.com',
      password: '12345678',
      pin: '1234',
      isLoad: false,
    };

  }

  onLogin = async () => {
  
    this.setState({isLoad: true});
    this.render();

    const { email, password, pin } = this.state;
    var _this = this;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(data){
        if(!!data.user){
          User.uid = data.user.uid;
          User.email = email;
          User.password = password;

          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(User), pin);
          AsyncStorage.setItem("userData", encrypted.toString());
          _this.props.navigation.navigate('PinPanel');
        }
        _this.closeLoading();
      }).catch(function(error) {
        var errorMessage = error.message;
        Alert.alert('Error', errorMessage);
        _this.closeLoading();
      });
  }

  onRegister() {
    this.props.navigation.navigate('Register');
  }

  closeLoading(){
    this.setState({
      isLoad: false
    });
  }

  render() {
    if(this.state.isLoad){
      return(
        <View style={Styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else{
      return (
        <View style={Styles.container}>
          <Text style={Styles.textHd}>KeyPass Holder</Text>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'email'}
            style={Styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <TextInput
            value={this.state.pin}
            onChangeText={(pin) => this.setState({ pin })}
            placeholder={'PIN'}
            secureTextEntry={true}
            style={Styles.input}
          />

          <Text
            type={"outline"}
            style={Styles.button}
            onPress={this.onLogin}
          >
            LOGIN
          </Text>

          <Text
            style={Styles.textLink}
            onPress={this.onRegister.bind(this)}
          >
            or create account
          </Text>

        </View>
      );
    }
  }
}