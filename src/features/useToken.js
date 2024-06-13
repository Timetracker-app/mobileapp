import React, {useState, useEffect} from 'react';
import * as Keychain from 'react-native-keychain';

export default function useToken() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        setToken(credentials.password); // Assuming the token is stored as the password
        setUser(credentials.username);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      //setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const saveToken = async userToken => {
    try {
      const data = JSON.parse(userToken);
      await Keychain.setGenericPassword(data.user, data.token); // Assuming 'user' is the username
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const deleteToken = async () => {
    try {
      await Keychain.resetGenericPassword();
      setToken(null);
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  return {
    setToken: saveToken,
    removeToken: deleteToken,
    token,
    loading,
    user,
  };
}
