import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Text,
  View,
  Modal,
  Button,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';
import {AuthContext} from '../features/AuthContext';

import styles from '../styles';
import {
  formatDate,
  formatDateTime,
  formatFilterDateTime,
  formatFilterDate,
} from '../utils';

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
  const fetchWork = async (data, _) => {
    customFetch
      .get(url, {
        params: data,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(response => {
        if (response.data) {
          const responseData = response.data.result;
          setWorkData([...responseData].reverse());
          console.log(responseData);
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
    fetchWork({
      worker: user,
      project: '',
      workplace: '',
      starttime: '',
      endtime: '',
    });
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
    const t1 = new Date(data.zacetni_cas);
    const t2 = new Date(data.koncni_cas);
    const diff = t2.getTime() - t1.getTime();

    if (diff > 0 && diff < 86400000) {
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
            fetchWork({
              worker: user,
              project: '',
              workplace: '',
              starttime: '',
              endtime: '',
            });
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
    } else {
      console.log('Invalid datetime!');
      ToastAndroid.show('Invalid datetime!', ToastAndroid.SHORT);
    }
  };

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

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
          fetchWork({
            worker: user,
            project: '',
            workplace: '',
            starttime: '',
            endtime: '',
          });
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
    setDeleteModalVisible(false);
  };

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterProject, setFilterProject] = useState('');
  const [filterWorkplace, setFilterWorkplace] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  const [filterStartTimeOpen, setFilterStartTimeOpen] = useState(false);
  const [filterEndTimeOpen, setFilterEndTimeOpen] = useState(false);

  const handleFilter = async () => {
    const data = {
      worker: user,
      project: filterProject,
      workplace: filterWorkplace,
      starttime:
        filterStartTime === ''
          ? filterStartTime
          : formatFilterDateTime(filterStartTime),
      endtime:
        filterEndTime === ''
          ? filterEndTime
          : formatFilterDateTime(filterEndTime),
    };

    fetchWork(data);
    console.log(data);
    setFilterStartTime('');
    setFilterEndTime('');
    setFilterProject('');
    setFilterWorkplace('');
    setFilterModalVisible(false);
  };

  const handleCancelFilter = () => {
    setFilterStartTime('');
    setFilterEndTime('');
    setFilterProject('');
    setFilterWorkplace('');
    setFilterModalVisible(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchWork({
      worker: user,
      project: '',
      workplace: '',
      starttime: '',
      endtime: '',
    });
  }, []);

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
      <View style={styles.filterButtonContainer}>
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
              placeholder="Select Project"
              search={false}
            />
            <SelectList
              setSelected={val => setWorkplace(val)}
              data={workplaceData}
              save="value"
              boxStyles={styles.selectList}
              placeholder="Select Workplace"
              search={false}
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
                buttonColor="#deb887"
                dividerColor="#deb887"
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
                buttonColor="#deb887"
                dividerColor="#deb887"
              />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Edit" onPress={editWork} color="#deb887" />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Delete"
                  onPress={() => {
                    setDeleteModalVisible(true);
                  }}
                  color="#ff6347"
                />
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
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Warning</Text>
            <Text style={styles.deleteModalContent}>
              Are you sure you want to delete this work?
            </Text>
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Delete" color="#ff6347" onPress={deleteWork} />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setDeleteModalVisible(false);
                  }}
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
              placeholder="Select Project"
              search={false}
            />
            <SelectList
              setSelected={val => setFilterWorkplace(val)}
              data={workplaceData}
              save="value"
              boxStyles={styles.selectList}
              placeholder="Select Workplace"
              search={false}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setFilterStartTimeOpen(true)}>
                <Text>
                  {filterStartTime !== ''
                    ? formatFilterDate(filterStartTime)
                    : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={filterStartTimeOpen}
                date={startTime}
                onConfirm={date => {
                  setFilterStartTimeOpen(false);
                  setFilterStartTime(date);
                }}
                onCancel={() => {
                  setFilterStartTimeOpen(false);
                }}
                buttonColor="#deb887"
                dividerColor="#deb887"
              />
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setFilterEndTimeOpen(true)}>
                <Text>
                  {filterEndTime !== ''
                    ? formatFilterDate(filterEndTime)
                    : 'Select End Date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                mode="date"
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
                buttonColor="#deb887"
                dividerColor="#deb887"
              />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Filter" color="#deb887" onPress={handleFilter} />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={handleCancelFilter}
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
