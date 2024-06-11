import React, {useState} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  Modal,
  Button,
  TouchableOpacity,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';

import {formatDate} from '../utils';

import styles from '../styles';

const WorkList = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [project, setProject] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const openModal = item => {
    setProject(item.project);
    setWorkplace(item.workplace);
    setStartTime(item.starttime);
    setEndTime(item.endtime);
    setModalVisible(true);
  };

  const editWork = () => {
    // Save changes logic here (e.g., update the item in the state or send it to a server)
    setModalVisible(false);
  };

  const deleteWork = () => {
    // Save changes logic here (e.g., update the item in the state or send it to a server)
    setModalVisible(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={styles.columnHeaderTxt}>Project</Text>
        <Text style={styles.columnHeaderTxt}>Workplace</Text>
        <Text style={styles.columnHeaderTxt}>Start Time</Text>
        <Text style={styles.columnHeaderTxt}>End Time</Text>
      </View>
    );
  };

  const projects = [
    {key: '1', value: 'Intarzija', disabled: true},
    {key: '2', value: 'Kant'},
    {key: '3', value: 'Vezi'},
    {key: '4', value: 'Miza', disabled: true},
  ];
  const workplaces = [
    {key: '1', value: 'Brusilka', disabled: true},
    {key: '2', value: 'Cepilka'},
    {key: '3', value: 'Sekular'},
    {key: '4', value: 'Formatna žaga', disabled: true},
  ];

  return (
    <>
      <View style={styles.workContainer}>
        <View style={styles.rowContainer}>
          <FlatList
            data={[
              {
                key: '1',
                project: 'Intarzija',
                workplace: 'Brusilka',
                starttime: '06/09/2024 08:00',
                endtime: '06/09/2024T16:00',
              },
              {
                key: '2',
                project: 'Kant',
                workplace: 'Poravnalka',
                starttime: '06/07/2024 07:00',
                endtime: '06/07/2024T15:00',
              },
              {
                key: '3',
                project: 'Vezi',
                workplace: 'Cepilka',
                starttime: '06/08/2024 08:00',
                endtime: '06/08/2024T16:00',
              },
            ]}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={styles.rowContainer}>
                  <Text style={styles.columnRowTxt}>{item.project}</Text>
                  <Text style={styles.columnRowTxt}>{item.workplace}</Text>
                  <Text style={styles.columnRowTxt}>{item.starttime}</Text>
                  <Text style={styles.columnRowTxt}>{item.endtime}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader}
            keyExtractor={item => item.key}
          />
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Work</Text>
            <SelectList
              setSelected={val => setProject(val)}
              data={projects}
              save="value"
              boxStyles={styles.selectList}
            />
            <SelectList
              setSelected={val => setWorkplace(val)}
              data={workplaces}
              save="value"
              boxStyles={styles.selectList}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setStartTimeOpen(true)}></TouchableOpacity>
              <DatePicker
                modal
                open={startTimeOpen}
                date={startTime}
                onConfirm={date => {
                  setStartTimeOpen(false);
                  setStartTime(date);
                }}
                onCancel={() => {
                  setStartTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setEndTimeOpen(true)}></TouchableOpacity>
              <DatePicker
                modal
                open={endTimeOpen}
                date={endTime}
                onConfirm={date => {
                  setEndTimeOpen(false);
                  setEndTime(date);
                }}
                onCancel={() => {
                  setEndTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Button title="Edit" onPress={editWork} color="#deb887" />
              <Button title="Delete" onPress={deleteWork} color="#ff6347" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WorkList;
