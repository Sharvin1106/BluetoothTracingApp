import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
} from 'react-native';
import {useFormik} from 'formik';
import {RadioButton} from 'react-native-paper';
import {getUserId, requestUserPermission} from '../utils/Auth';
import {createUser} from '../api';
import messaging from '@react-native-firebase/messaging';
import {storeData} from '../utils/storage';

export default function UserForm() {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState('first');
  const formik = useFormik({
    initialValues: {username: '', HpNo: '', vaccinated: ''},
    onSubmit: async values => {
      const token = await requestUserPermission();
      const userId = getUserId();
      const userDetails = await createUser({
        ...values,
        uid: userId,
        deviceToken: token,
      });
      console.log(userDetails);
      storeData('my_bluetooth_uuid', userDetails);
      navigation.replace('Tabs');
    },
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titleText}>Let us know{'\n'}more about you.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          //style={globalStyles.input}
          placeholder="username"
          onChangeText={formik.handleChange('username')}
          value={formik.values.username}
        />

        <TextInput
          style={styles.input}
          multiline
          placeholder="Handphone Number"
          onChangeText={formik.handleChange('HpNo')}
          value={formik.values.HpNo}
        />

        <Text style={styles.formText}>Vaccinated?</Text>
        <View>
          <RadioButton.Group
            onValueChange={formik.handleChange('vaccinated')}
            value={formik.values.vaccinated}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <RadioButton value="Y"></RadioButton>
              <Text style={styles.optionText}>Yes (At least 2 doses)</Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <RadioButton value="N"></RadioButton>
              <Text style={styles.optionText}>No</Text>
            </View>
          </RadioButton.Group>
        </View>

        <TouchableOpacity onPress={formik.handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    width: '80%',
    marginVertical: '5%',
  },

  titleText: {
    fontFamily: 'Inter',
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0D4930',
    top: '3%',
    margin: '5%',
    marginBottom: '10%',
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#D5FFE3',
    paddingHorizontal: 15,
    paddingVertical: '4%',
    borderRadius: 10,
    marginTop: '5%',
    marginBottom: '5%',
  },
  buttonContainer: {
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: '6%',
  },
  button: {
    backgroundColor: '#1AEBA4',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: '8%',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#1AEBA4',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#1AEBA4',
    fontWeight: '700',
    fontSize: 16,
  },

  formText: {
    fontFamily: 'SF Pro Display',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D4930',
    marginVertical: '5%',
  },

  optionText: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    color: '#0D4930',
    margin: 5,
  },
});
