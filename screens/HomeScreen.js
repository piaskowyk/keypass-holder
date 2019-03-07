import * as React from 'react';
import { View, Text, ScrollView, YellowBox, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import CryptoJS from '../utils/CryptJS';
import firebase from '@firebase/app';
import Styles from '../constants/Style';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Home",
    drawerLabel: 'Home',
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
        marginCard: 0,
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

    this.state.cardList[key] = this.makeOneCard(key);

    this.forceUpdate();
  }

  generateCardList(){
    this.setState({ cardList: this.state.passItems.map((item, key) => {
      this.state.cardData[key] = {
        isOpen: !!this.state.cardData[key].isOpen,
        data: this.state.cardData[key].data,
        publicName: item.publicName,
      };
      return(this.makeOneCard(key));
    })
  });
  }

  removeItem(key){
    var _this = this;
    Alert.alert(
      'Hey',
      'Are you sure to want delete this item?',
      [
        {text: 'Yes, I\'m sure', onPress: () => _this.removeItemExecute(key)},
        {text: 'Oh, NO!'},
      ],
      {cancelable: true},
    );
  }

  removeItemExecute(key){

  }

  editItem(key){
    this.props.navigation.navigate('EditItem', {
      publicName: this.state.cardData[key].publicName,
      login: this.state.cardData[key].data.login,
      password: this.state.cardData[key].data.password,
      moreInfo: this.state.cardData[key].data.moreInfo,
    });
  }

  makeOneCard(key){
    return (
      <SwipeRow key={key} leftOpenValue={130} rightOpenValue={-150}>
        <View style={styles.standaloneRowBack}>
          <Button icon="edit" mode="contained" onPress={() => this.editItem(key)}>Edit</Button>
          <Button icon="delete" mode="contained" onPress={() => this.removeItem(key)}>Remove</Button>
        </View>
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
        </Card>
      </SwipeRow>
    );
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


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    // backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: 100,
  },
});