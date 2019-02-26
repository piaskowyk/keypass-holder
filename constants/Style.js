import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    textHd: {
      fontSize: 20,
      marginBottom: 20,
      color: '#333333',
    },
    textHdCenter: {
      marginTop: 10,
      fontSize: 20,
      marginBottom: 5,
      color: '#333333',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      width: '100%',
    },
    stdBrCard: {
      backgroundColor: '#ecf0f1',
      paddingBottom: 20,
    },
    containerNoCenter: {
      flex: 1,
      backgroundColor: '#ecf0f1',
      width: '100%',
    },
    scrollViewBr: {
      backgroundColor: '#ecf0f1',
      width: '100%',
    },
    input: {
      width: 300,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: '#333333',
      marginBottom: 10,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: '#333333',
      color: '#333333',
      marginTop: 20
    },
    textLink: {
      marginTop: 10,
      color: '#333333',
    },
    errorInfoShow: {
      color: '#dd0000',
      marginBottom: 10,
    },
    errorInfoHide: {
      color: '#dd0000',
      marginBottom: 10,
      display: 'none'
    },
    card: {
      marginTop: 20,
    },
    statusInfoShow: {
      color: 'green',
    },
    statusInfoHide: {
      display: 'none',
    },
    textArea: {
      width: 300,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 10,
      textAlignVertical: 'top',
      justifyContent: "flex-start"
    },
    statusInfoShow: {
      color: '#4fb63d',
      marginBottom: 10,
    },
    statusInfoHide: {
      marginBottom: 10,
      display: 'none'
    }
  });