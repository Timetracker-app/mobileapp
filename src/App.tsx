import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as Keychain from 'react-native-keychain';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkScreen from './screens/WorkScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import {AuthContext} from './features/AuthContext';

export default function App() {
  function MainTabNavigator() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Work" component={WorkScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log(action.user);
          return {
            ...prevState,
            userToken: action.token,
            user: action.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let user;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          userToken = credentials.password;
          user = credentials.username;
        }
      } catch (e) {
        console.log('Restoring token failed..');
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken, user: user});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        const parsedData = JSON.parse(data);

        const token = parsedData.token;
        const user = parsedData.user;

        console.log(token);
        console.log(user);

        await Keychain.setGenericPassword(user, token);
        dispatch({type: 'SIGN_IN', token, user});
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        dispatch({type: 'SIGN_OUT'});
      },
      userToken: state.userToken,
      user: state.user,
    }),
    [state.userToken],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {state.userToken === null || state.userToken === undefined ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
