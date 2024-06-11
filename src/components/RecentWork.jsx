import React from 'react';
import {FlatList, Text, View} from 'react-native';

import styles from '../styles';

const RecentWork = () => {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.rowContainer}>
        <FlatList
          data={[
            {
              key: '1',
              project: 'Intarzija',
              workplace: 'Brusilka',
              starttime: '06/09/2024 08:00',
              endtime: '06/09/2024 16:00',
            },
            {
              key: '2',
              project: 'Kant',
              workplace: 'Poravnalka',
              starttime: '06/07/2024 07:00',
              endtime: '06/07/2024 15:00',
            },
            {
              key: '3',
              project: 'Vezi',
              workplace: 'Cepilka',
              starttime: '06/08/2024 08:00',
              endtime: '06/08/2024 16:00',
            },
            {
              key: '4',
              project: 'Miza',
              workplace: 'Formatna žaga',
              starttime: '06/10/2024 08:00',
              endtime: '06/10/2024 16:00',
            },
            {
              key: '5',
              project: 'Stopnice',
              workplace: 'Sekular',
              starttime: '06/11/2024 08:00',
              endtime: '06/11/2024 16:00',
            },
          ]}
          renderItem={({item}) => {
            return (
              <View style={styles.rowContainer}>
                <Text style={styles.columnRowTxt}>{item.project}</Text>
                <Text style={styles.columnRowTxt}>{item.workplace}</Text>
                <Text style={styles.columnRowTxt}>{item.starttime}</Text>
                <Text style={styles.columnRowTxt}>{item.endtime}</Text>
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
