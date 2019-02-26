import React from 'react';
import {
  Alert,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import firebase from '@firebase/app';
import User from '../entities/User';
import CryptoJS from '../utils/CryptJS';
import Styles from '../constants/Style';

export default class RegisterScreen extends React.Component {

  static navigationOptions = {
    title: "Register new account",
  };

  constructor(props) {
    super(props);
    this.state = {
      email: 'krzychu2956@gmail.com',
      password: '12345678',
      retypePassword: '12345678',
      pin: '1234',
      retypePin: '1234',

      emailInfoStyle: Styles.errorInfoHide,
      passwordInfoStyle: Styles.errorInfoHide,
      retypePasswordInfoStyle: Styles.errorInfoHide,
      pinInfoStyle: Styles.errorInfoHide,
      retypePinInfoStyle: Styles.errorInfoHide,

      validForm: true,
      isLoad: false,
    };
  }

  createAccount() {

    const { email, password, retypePassword, pin, retypePin } = this.state;
    this.setState({
      validForm: true,
    });

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    this.setState({
      emailInfoStyle: this.chcekValid(reg.test(email) === false),
      passwordInfoStyle: this.chcekValid(password.length < 8 || password.length > 20),
      retypePasswordInfoStyle: this.chcekValid(password != retypePassword),
      pinInfoStyle: this.chcekValid(pin.length < 4 || pin.length > 50),
      retypePinInfoStyle: this.chcekValid(pin != retypePin),
    });

    if (this.state.validForm) {
      this.setState({
        isLoad: true
      });
      this.render();
      var _this = this;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (data) {
          if (!!data.user) {
            User.uid = data.user.uid;
            User.email = email;
            User.password = password;

            var encrypted = CryptoJS.AES.encrypt(JSON.stringify(User), pin);
            AsyncStorage.setItem("userData", encrypted.toString());

            _this.closeLoading()
            _this.props.navigation.navigate('PinPanel');
          }
        }).catch(function (error) {
          var errorMessage = error.message;
          Alert.alert('Error', errorMessage);
          _this.closeLoading();
        });
    }
  }

  closeLoading() {
    this.setState({
      isLoad: false
    });
  }

  chcekValid(predicate) {
    if (predicate) {
      this.state.validForm = false;
      return Styles.errorInfoShow;
    }
    else {
      return Styles.errorInfoHide;
    }
  }

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
        // <ScrollView>
        <View style={Styles.container}>
          <Text style={Styles.textHd}>KeyPass Holder add new account</Text>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            style={Styles.input}
          />
          <Text style={this.state.emailInfoStyle}>Uncorrect email</Text>
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <Text style={this.state.passwordInfoStyle}>Password lenght must be between 8-20 characters</Text>
          <TextInput
            value={this.state.retypePassword}
            onChangeText={(retypePassword) => this.setState({ retypePassword })}
            placeholder={'Retype password'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <Text style={this.state.retypePasswordInfoStyle}>Retyped password is not the same</Text>
          <TextInput
            value={this.state.pin}
            onChangeText={(pin) => this.setState({ pin })}
            placeholder={'PIN'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <Text style={this.state.pinInfoStyle}>PIN lenght must be between 4-50 characters</Text>
          <TextInput
            value={this.state.retypePin}
            onChangeText={(retypePin) => this.setState({ retypePin })}
            placeholder={'Retype PIN'}
            secureTextEntry={true}
            style={Styles.input}
          />
          <Text style={this.state.retypePinInfoStyle}>Retyped PIN is not the same</Text>
          <Text
            style={Styles.button}
            onPress={this.createAccount.bind(this)}
          >
            REGISTER
            </Text>

        </View>
        // </ScrollView>
      );
    }
  }
}