import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createDrawerNavigator, } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome";
import LoginScreen from './screens/LoginScreen';
import LogOutScreen from './screens/LogOutScreen';
import RegisterScreen from './screens/RegisterScreen';
import PinPanelScreen from './screens/PinPanelScreen';
import HomeScreen from './screens/HomeScreen';
import InfoScreen from './screens/InfoScreen';
import AddSecretScreen from './screens/AddSecretScreen';
import EditSecretScreen from './screens/EditSecretScreen';

import TmpScreen from './screens/TmpScreen';
import AuthScreen from './screens/AuthScreen';

const AccountStack = createStackNavigator({ 
  Login: LoginScreen, 
  Register: RegisterScreen,
});

const AppStack = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="home"
        color={tintColor}
        size={25}
        />
      ),
    },
  },
  AddSecret: {
    screen: AddSecretScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="plus"
        color={tintColor}
        size={25}
        />
      ),
    },
  },
  Info: {
    screen: createStackNavigator({ Info: InfoScreen }),
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="info"
        color={tintColor}
        size={25}
        />
      ),
    },
  },
  LotOut: {
    screen: LogOutScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="arrow-circle-o-left"
        color={tintColor}
        size={25}
        />
      ),
    },
  }
},
{
  initialRouteName: 'Home',
  drawerWidth: 300,
  contentOptions: {
    activeTintColor :'#909090',
    inactiveTintColor :'#333333',
    // activeBackgroundColor :'#333333',
    // inactiveBackgroundColor :'#cecece',
  }
}
);


export default createAppContainer(createSwitchNavigator(
  {
    AccountNavigator: AccountStack,
    PinPanel: PinPanelScreen,
    App: AppStack,
    Auth: AuthScreen,
    Tmp: TmpScreen,
    EditItem: EditSecretScreen,
  },
  {
    initialRouteName: 'Auth',
  }
));
