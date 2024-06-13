import React, {useState} from 'react';
import {TextInput, View, Button, ActivityIndicator} from 'react-native';

import {customFetch} from '../utils';
import useToken from '../features/useToken';
import {AuthContext} from '../features/AuthContext';

const url = '/login';

const LoginScreen = ({navigation, route}) => {
  //const {setToken, loading} = useToken();

  const {signIn} = React.useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (email, password) => {
    const data = {email, geslo: password};
    try {
      const response = await customFetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data,
      });
      console.log(response.data);
      const token = JSON.stringify(response.data);
      //setToken(token);
      signIn(token);
      return null;
    } catch (error) {
      if (error?.response?.status === 401) {
        console.log(error?.response?.data);
      } else if (error?.response?.data?.error?.message) {
        console.log(error?.response?.data?.error?.message);
      } else {
        console.log('There is error', error);
      }
      return null;
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => handleLogin(email, password)} />
    </View>
  );
};

export default LoginScreen;
