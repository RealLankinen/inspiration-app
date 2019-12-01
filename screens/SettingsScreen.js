import * as WebBrowser from 'expo-web-browser'
import colors from './../constants/Colors'
import React, {useState,useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  AsyncStorage,
} from 'react-native'
import {useNavigation} from 'react-navigation-hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function SettingsScreen() {
  const [emailInput, setEmailInput] = useState('')
  const { navigate } = useNavigation()

  useEffect(() => {
    AsyncStorage.getItem('email_address').then((emailAddress) => {
      if (emailAddress != null) {
        setEmailInput(emailAddress)
      }
    }).catch((e)=>console.log("error:",e))
  },[])

  saveButtonPressed = () => {
    if(!validate(emailInput)){
      Alert.alert('Error',"Your email address doesn't match with our criterias.")
      return
    }
    AsyncStorage.setItem('email_address',emailInput).then(() => {
      navigate('Home')
    }).catch((e)=>console.log("error:",e))
  }

  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase())
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={text => setEmailInput(text)}
        value={emailInput}
        multiline={false}
        autoFocus={true}
        keyboardType={"email-address"}
      />
      <View style={{width:'100%',alignItems:'center'}}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={this.saveButtonPressed}
        >
          <Text style={styles.saveButtonText}>
              Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maastrichtBlue,
    padding: 50,
  },
  label: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  saveButton: {
    width: 100,
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: colors.warmBlack,
  },

  saveButtonText: {
    textAlign: 'center',
    color: 'white',
  }
})
