import React from 'react';
import { View, Stylesheet, Text, TextInput, AsyncStorage, ScrollView, YellowBox, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Icon } from 'react-native-elements';
import CryptoJS from '../utils/CryptJS';
import firebase from '@firebase/app';
import User from '../entities/User';
import Styles from '../constants/Style';

export default class AddSecretScreen extends React.Component {

  static navigationOptions = {
    title: "Add Secret",
  };

  constructor(props) {
    super(props);

    this.state = {
      publicName: this.props.navigation.getParam('publicName', ''),
      login: this.props.navigation.getParam('login', ''),
      password: this.props.navigation.getParam('password', ''),
      moreInfo: this.props.navigation.getParam('moreInfo', ''),

      operationInfoStyle: Styles.statusInfoHide,

      isLoad: false,
    };

  }

  closeLoading() {
    this.setState({
      isLoad: false
    });
  }

  save = async () => {
    
    this.setState({
      isLoad: true
    });
    this.render();

    var item = {
      publicName: this.state.publicName,
      login: this.state.login,
      password: this.state.password,
      moreInfo: this.state.moreInfo,
    };
    
    var json = JSON.stringify(item);
    var encrypted = CryptoJS.AES.encrypt(json, User.pin);
    var secret = encrypted.toString();

    var _this = this;
    
    firebase
      .firestore()
      .collection('userdata')
      .add({
        secret: secret,
        owner: User.uid,
        publicName: item.publicName,
      })
      .then(function() {
        _this.setState({
          isLoad: false,
          operationInfoStyle: Styles.statusInfoShow,

          publicName: '',
          login: '',
          password: '',
          moreInfo: '',
        });
      })
      .catch(function(error) {
          Alert.alert("Error", error.data())
          _this.setState({
            isLoad: false,
          });
      });
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
          <Text style={Styles.textHd}>Edit Secret Data</Text>
          <TextInput
            value={this.state.publicName}
            onChangeText={(publicName) => this.setState({ publicName })}
            placeholder={'Public name'}
            style={Styles.input}
          />
          <TextInput
            value={this.state.login}
            onChangeText={(login) => this.setState({ login })}
            placeholder={'Secret Login'}
            style={Styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Secret Password'}
            style={Styles.input}
          />
          <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={(moreInfo) => this.setState({ moreInfo })}
            placeholder={'Secret More Info'}
            value={this.state.moreInfo}
            style={Styles.textArea}
          />
          <Text style={this.state.operationInfoStyle}>Add item to database</Text>

          <Text
            type={"outline"}
            style={Styles.button}
            onPress={this.save.bind(this)}
          >
            SAVE
          </Text>
        </View>
      );
    }
  }
}