import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Text,
  View,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {AuthContext} from '../features/AuthContext';

import styles from '../styles';
import {formatDate} from '../utils';

import useToken from '../features/useToken';
import {customFetch} from '../utils';
const url = '/work';

const RecentWork = () => {
  const {userToken, user} = React.useContext(AuthContext);

  console.log(user);
  console.log(userToken);

  const [data, setData] = useState();

  const fetchWork = async () => {
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
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(response => {
        if (response.data) {
          const responseWork = response.data.result;
          const recentData = [...responseWork].reverse().slice(0, 5);
          console.log('here', recentData);
          setData(recentData);
        } else {
          ToastAndroid.show('No work found', ToastAndroid.SHORT);
          console.log('No work found...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('No work found', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    fetchWork();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchWork();
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default RecentWork;
