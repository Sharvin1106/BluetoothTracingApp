import React from 'react';
import {StyleSheet, Button, TextInput, View, Text} from 'react-native';
import {Formik} from 'formik';
import {RadioButton} from 'react-native-paper';

export default function UserForm() {
  return (
    <View>
      <Formik
        initialValues={{Username: '', HpNo: '', Vacinnated: '', Status: ''}}
        onSubmit={values => {
          console.log(values);
        }}>
        {props => (
          <View>
            <TextInput
              //style={globalStyles.input}
              placeholder="Username"
              onChangeText={props.handleChange('Username')}
              value={props.values.Username}
            />

            <View>
              <RadioButton
                value="first"
                status={checked === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Yes')}
              />
              <RadioButton
                value="second"
                status={checked === 'No' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('No')}
              />
            </View>

            <TextInput
              //style={globalStyles.input}
              multiline
              placeholder="Handphone Number"
              onChangeText={props.handleChange('HpNo')}
              value={props.values.HpNo}
            />

            <TextInput
              //style={globalStyles.input}
              placeholder="Vac"
              onChangeText={props.handleChange('rating')}
              value={props.values.rating}
              keyboardType="numeric"
            />

            <Button
              color="maroon"
              title="Submit"
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}
