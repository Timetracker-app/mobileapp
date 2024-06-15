import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  columnHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 88,
  },
  columnHeaderTxt: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  columnRowTxt: {
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  workContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  homeContainer: {
    flex: 1,
    alignItems: 'down',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    justifyContent: 'flex-end',
  },
  startWorkButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 50,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  passwordButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginTop: 22,
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 10,
  },
  logoutButton: {
    backgroundColor: 'white',

    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  profileContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  profileRowContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  profileColumnRowLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  profileColumnRowValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
  },
  selectList: {
    width: '100%',
    marginBottom: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: 'white',
  },
  singleButton: {
    width: 80,
    marginHorizontal: 10,
  },
  buttonsProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 300,
  },
  singleProfileButton: {
    width: 160,
    marginHorizontal: 10,
  },
  loginContainer: {
    justifyContent: 'center',
  },
  appTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    marginTop: 150,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#deb887',
  },
  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  deleteModalContent: {
    marginBottom: 20,
  },
});

export default styles;
