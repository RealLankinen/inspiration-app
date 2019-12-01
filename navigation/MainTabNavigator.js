import { Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
)

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
)

const tabNavigator = createDrawerNavigator({
  HomeStack,
  SettingsStack,
})

export default tabNavigator
