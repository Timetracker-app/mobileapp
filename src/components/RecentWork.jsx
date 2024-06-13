import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import styles from '../styles';
import {formatDate} from '../utils';

import useToken from '../features/useToken';
import {customFetch} from '../utils';
const url = '/work';

const RecentWork = () => {
  const {token, user, loading} = useToken();

  console.log(user);
  console.log(token);

  const [data, setData] = useState();

  useEffect(() => {
    customFetch
      .get(url, {
        params: {
          worker: user,
          project: '',
          workplace: '',
          starttime: '',
          endtime: '',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.data) {
          setData(response.data.result);
        } else {
          ToastAndroid.show('No work found', ToastAndroid.SHORT);
          console.log('No work found...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('No work found', ToastAndroid.SHORT);
      });
  }, []);

  return (
    <View style={styles.homeContainer}>
      <View style={styles.rowContainer}>
        <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <View style={styles.rowContainer}>
                <Text style={styles.columnRowTxt}>{item.projekt}</Text>
                <Text style={styles.columnRowTxt}>{item.stroj}</Text>
                <Text style={styles.columnRowTxt}>
                  {formatDate(item.zacetni_cas)}
                </Text>
                <Text style={styles.columnRowTxt}>
                  {formatDate(item.koncni_cas)}
                </Text>
              </View>
            );
          }}
          keyExtractor={item => item.key}
        />
      </View>
    </View>
  );
};

export default RecentWork;
