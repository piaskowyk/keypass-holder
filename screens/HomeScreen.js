import * as React from 'react';
import { View, Stylesheet, Text, AsyncStorage, ScrollView, YellowBox, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

// import { Icon } from 'react-native-elements';
import { DrawerActions } from 'react-navigation-drawer';
import CryptoJS from '../utils/CryptJS';
import firebase from '@firebase/app';
import User from '../entities/User';
import Styles from '../constants/Style';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Home",
    drawerLabel: 'Home',
    drawerIcon: (
      <TouchableOpacity>
        {/* <Icon name="md-home" size={25} color="black" /> */}
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      passItems: [],
      uid: this.props.navigation.getParam('uid', ''),
      pin: this.props.navigation.getParam('pin', ''),
      list: null,
      cardData: [],
      isLoad: true,
      cardList: [],
    };
  }

  componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer', 'Warning: Can']);
    this.loadData();
  }

  loadData = async () => {
    _this = this;
    try{
      firebase
        .firestore()
        .collection('userdata')
        .where('owner', "==", _this.state.uid)
        .onSnapshot(snapshot => {
          var elements = [];
          snapshot.forEach(item => {
            if(typeof item.id !== 'undefined'){
              elements.push({
                id: item.id, 
                ...item.data()
              });
            }
          });
  
          this.state.passItems = elements;
          this.decryptData(elements);
          this.generateCardList();
          this.setState({
            isLoad: false,
          });
        });
    }
    catch(e){
      console.log(error);
      Alert.alert('Error', 'Authentication problem, try relogin.');
    }
  };

  decryptData(elements) {
    elements.forEach((item, key) => {
      data = this.decodeItem(item);
      this.state.cardData[key] = {
        isOpen: false,
        data: data,
        publicName: item.publicName,
      };
    });
    this.forceUpdate();
  }

  decodeItem(item) {
    _this = this;
    var itemData = {
      status: false,
      publicName: 'Error',
      login: '',
      password: '',
      moreInfo: '',
    }

    var decrypted = "";
    try {
      decrypted = CryptoJS.AES.decrypt(item.secret, _this.state.pin).toString(CryptoJS.enc.Utf8);
      var secretData = JSON.parse(decrypted);
    } catch (e) {
      console.log(e);
      return itemData;
    }

    if(typeof secretData.publicName == 'undefined') return itemData;

    return secretData;
  }

  changeCardStatus(key){
    this.state.cardData[key].isOpen = !!!this.state.cardData[key].isOpen;

    this.state.cardList[key] = (
      <Card key={key} style={Styles.card}>
        <Card.Content>
          <Title>{this.state.cardData[key].publicName}</Title>
          {
            (this.state.cardData[key].isOpen == true) ?
            <Card.Content>
              <Paragraph>Name: {this.state.cardData[key].publicName}</Paragraph> 
              <Paragraph>Login: {this.state.cardData[key].data.login}</Paragraph> 
              <Paragraph>Password: {this.state.cardData[key].data.password}</Paragraph> 
              <Paragraph>Info: {this.state.cardData[key].data.moreInfo}</Paragraph> 
            </Card.Content>
            :
            <Paragraph>Tap to show more</Paragraph>
          }
        </Card.Content>
        {
          (this.state.cardData[key].isOpen == true) ?
          <Card.Actions>
            <Button onPress={() => this.changeCardStatus(key)}>Close</Button>
          </Card.Actions>
          :
          <Card.Actions>
            <Button onPress={() => this.changeCardStatus(key)}>Decode</Button>
          </Card.Actions>
        }
    </Card> );

    this.forceUpdate();
  }

  generateCardList(){
    this.setState({ cardList: this.state.passItems.map((item, key) => {
      this.state.cardData[key] = {
        isOpen: !!this.state.cardData[key].isOpen,
        data: this.state.cardData[key].data,
        publicName: item.publicName,
      };
      return(
        <Card key={key} style={Styles.card}>
          <Card.Content>
            <Title>{item.publicName}</Title>
            {
              (this.state.cardData[key].isOpen == true) ?
              <Card.Content>
                <Paragraph>Name: {this.state.cardData[key].publicName}</Paragraph> 
                <Paragraph>Login: {this.state.cardData[key].data.login}</Paragraph> 
                <Paragraph>Password: {this.state.cardData[key].data.password}</Paragraph> 
                <Paragraph>Info: {this.state.cardData[key].data.moreInfo}</Paragraph> 
              </Card.Content>
              :
              <Paragraph>Tap to show more</Paragraph>
            }
          </Card.Content>
          {
            (this.state.cardData[key].isOpen == true) ?
            <Card.Actions>
              <Button onPress={() => this.changeCardStatus(key)}>Close</Button>
            </Card.Actions>
            :
            <Card.Actions>
              <Button onPress={() => this.changeCardStatus(key)}>Decode</Button>
            </Card.Actions>
          }
        </Card>
      );
    })
  });
  }

  render() {
    if (this.state.isLoad) {
      return (
        <ScrollView style={Styles.stdBrCard}>
          <View>
            <Text style={Styles.textHdCenter}>Key List</Text>
          </View>
          <View style={Styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </ScrollView>
      )
    }
    else {
      return (
        <ScrollView style={Styles.stdBrCard}>
          <View>
            <Text style={Styles.textHdCenter}>Key List</Text>
          </View>
          {
            this.state.cardList.map((item) => {
              return item;
            })
          }
        </ScrollView>
      );
    }
  }
}