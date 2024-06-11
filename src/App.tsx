import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkScreen from './screens/WorkScreen';

//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          //options={{title: 'Welcome'}}
        />
        <Tab.Screen
          name="Work"
          component={WorkScreen}
          //options={{title: 'Work'}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          //options={{title: 'Profile'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default App;
