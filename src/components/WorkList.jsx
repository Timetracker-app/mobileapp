import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  Modal,
  Button,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';
import {AuthContext} from '../features/AuthContext';

import styles from '../styles';
import {formatDate, formatDateTime} from '../utils';

import {customFetch} from '../utils';
const url = '/work';

const WorkList = () => {
  const {userToken, user} = React.useContext(AuthContext);

  const [workData, setWorkData] = useState();
  const [projectData, setProjectData] = useState();
  const [workplaceData, setWorkplaceData] = useState();

  const fetchProjects = async () => {
    customFetch
      .get('/project', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(response => {
        if (response.data) {
          const projectResponse = response.data.result;
          const filteredProjects = [
            ...new Set(
              projectResponse
                .filter(item => item.status === 1)
                .map(item => item.projekt),
            ),
          ];
          setProjectData(filteredProjects);
          console.log(filteredProjects);
        } else {
          ToastAndroid.show('No projects found', ToastAndroid.SHORT);
          console.log('No projects found...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('No projects found', ToastAndroid.SHORT);
      });
  };

  const fetchWorkplaces = async () => {
    customFetch
      .get('/workplace', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(response => {
        if (response.data) {
          const workplaceResponse = response.data.result;
          const filteredWorkplaces = [
            ...new Set(
              workplaceResponse
                .filter(item => item.status === 1)
                .map(item => item.stroj),
            ),
          ];
          setWorkplaceData(filteredWorkplaces);
          console.log(filteredWorkplaces);
        } else {
          ToastAndroid.show('No workplaces found', ToastAndroid.SHORT);
          console.log('No workplaces found...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('No workplaces found', ToastAndroid.SHORT);
      });
  };
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
          const responseData = response.data.result;
          setWorkData([...responseData].reverse());
          console.log('HERE', responseData);
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
    fetchProjects();
    fetchWorkplaces();
    fetchWork();
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [workID, setWorkID] = useState(0);
  const [project, setProject] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const openModal = item => {
    setWorkID(item.IDdela);
    setProject(item.projekt);
    setWorkplace(item.stroj);
    setStartTime(new Date(item.zacetni_cas));
    setEndTime(new Date(item.koncni_cas));
    setModalVisible(true);
  };

  const editWork = () => {
    const data = {
      ime: user,
      projekt: project,
      stroj: workplace,
      zacetni_cas: formatDateTime(startTime),
      koncni_cas: formatDateTime(endTime),
    };
    console.log(workID);
    customFetch(`work/${workID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Work was successfully edited!');
          ToastAndroid.show(
            'Work was successfully edited!',
            ToastAndroid.SHORT,
          );
          fetchWork();
        } else {
          ToastAndroid.show('Failed to edit work', ToastAndroid.SHORT);
          console.log('Failed to edit work...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Failed to edit work', ToastAndroid.SHORT);
      });

    console.log(data);
    setModalVisible(false);
  };

  const deleteWork = () => {
    console.log(workID);
    customFetch(`work/${workID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Work was successfully deleted!');
          ToastAndroid.show(
            'Work was successfully deleted!',
            ToastAndroid.SHORT,
          );
          fetchWork();
        } else {
          ToastAndroid.show('Failed to delete work', ToastAndroid.SHORT);
          console.log('Failed to delete work...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Failed to delete work', ToastAndroid.SHORT);
      });

    setModalVisible(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchData();
  }, []);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterProject, setFilterProject] = useState('');
  const [filterWorkplace, setFilterWorkplace] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  const [filterStartTimeOpen, setFilterStartTimeOpen] = useState(false);
  const [filterEndTimeOpen, setFilterEndTimeOpen] = useState(false);

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

  return (
    <>
      <View style={styles.buttonsContainer}>
        <View style={styles.singleButton}>
          <Button
            title="Filter"
            onPress={() => {
              setFilterModalVisible(true);
            }}
            color="#deb887"
          />
        </View>
      </View>

      <View style={styles.workContainer}>
        <View style={styles.rowContainer}>
          <FlatList
            data={workData}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => openModal(item)}>
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
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader}
            keyExtractor={item => item.key}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
            <Text style={styles.modalTitle}>Edit Work</Text>
            <SelectList
              setSelected={val => setProject(val)}
              data={projectData}
              save="value"
              boxStyles={styles.selectList}
            />
            <SelectList
              setSelected={val => setWorkplace(val)}
              data={workplaceData}
              save="value"
              boxStyles={styles.selectList}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setStartTimeOpen(true)}>
                <Text>
                  {startTime ? formatDate(startTime) : 'Select Start DateTime'}
                </Text>
              </TouchableOpacity>
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
                onPress={() => setEndTimeOpen(true)}>
                <Text>
                  {endTime ? formatDate(endTime) : 'Select End DateTime'}
                </Text>
              </TouchableOpacity>
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
              <View style={styles.singleButton}>
                <Button title="Edit" onPress={editWork} color="#deb887" />
              </View>
              <View style={styles.singleButton}>
                <Button title="Delete" onPress={deleteWork} color="#ff6347" />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#c0c0c0"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Work</Text>
            <SelectList
              setSelected={val => setFilterProject(val)}
              data={projectData}
              save="value"
              boxStyles={styles.selectList}
            />
            <SelectList
              setSelected={val => setFilterWorkplace(val)}
              data={workplaceData}
              save="value"
              boxStyles={styles.selectList}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setFilterStartTimeOpen(true)}>
                <Text>Select Start DateTime</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={filterStartTimeOpen}
                date={startTime}
                onConfirm={date => {
                  setFilterStartTimeOpen(false);
                  setFilterStartTime(date);
                }}
                onCancel={() => {
                  setFilterStartTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setFilterEndTimeOpen(true)}>
                <Text>Select End DateTime</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={filterEndTimeOpen}
                date={endTime}
                onConfirm={date => {
                  setFilterEndTimeOpen(false);
                  setFilterEndTime(date);
                }}
                onCancel={() => {
                  setFilterEndTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Filter" color="#deb887" />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => setFilterModalVisible(false)}
                  color="#c0c0c0"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WorkList;
