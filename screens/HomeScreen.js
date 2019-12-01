import * as WebBrowser from 'expo-web-browser';
import colors from './../constants/Colors'
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  AsyncStorage,
  Alert,
  Keyboard,
  Dimensions,
} from 'react-native';
import {useNavigation} from 'react-navigation-hooks'
import {UseEventListener} from './../hooks/UseEventListener'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [inputText, setInputText] = useState('')
  // The idea here is that when it is first 99% for
  // small amount of time and then changes to 100%
  // copy pasting works. 
  // https://github.com/facebook/react-native/issues/18926
  const [inputWidth, setInputWidth] = useState('99%')
  useEffect(()=>{
    setTimeout(()=>{
      setInputWidth('100%')
    },100)
  },[])

  const [emailAddress, setEmailAddress] = useState('')
  const { navigate } = useNavigation()
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('email_address').then((ea)=>{
      if(ea == null){
        console.log("opensettings")
        useNavigation('Settings')
      }else{
        setEmailAddress(ea)
      }
    }).catch((e)=>console.log("error:",e))
    AsyncStorage.getItem('open_notes').then((notes) => {
      if(notes != null) setInputText(notes)
    })
  },[])

  keyboardDidShow = (event) => {
    setKeyboardHeight(event.endCoordinates.height)
  }

  keyboardDidHide = (event) => {
    setKeyboardHeight(0)
  }

  UseEventListener('keyboardDidShow',keyboardDidShow,Keyboard)
  UseEventListener('keyboardDidHide',keyboardDidHide,Keyboard)

  timeout = (ms, promise) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }  

  sendButtonPressed = () => {
    // Check input not empty
    if (inputText.length == 0) {
      Alert.alert("Error","You can't send an empty note.")
      return
    }
    // Check input is not too long
    if (inputText.length > 5000) {
      Alert.alert("Error","This is just for quick notes. Remove " + (inputText.length - 5000) + " characters to send this.")
      return
    }

    timeout(5000, fetch('https://quicknoteapp.000webhostapp.com/server.php', {
      method: "POST",
      headers: {
        "Accept": "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "email="+emailAddress+"&message="+inputText
    })).then(()=>{
      AsyncStorage.removeItem('open_notes')
      setInputText('')
      Alert.alert('Sent!','Your notes should soon arrive to your inbox.')
    })
    .catch((e)=>{
      console.log("error:",e)
      Alert.alert('Error',"Wasn't available to send the notes to your email. Please try again later and check your internet connection.")
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuBar}>
        <View style={Object.assign({},{alignItems:'flex-start'},styles.menuBarPart)}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={()=>{
            navigate('Settings')
          }}
        >
          <Text style={styles.settingsButtonText}>
              Settings
          </Text>
        </TouchableOpacity>
        </View>
        <View style={Object.assign({},{alignItems:'center'},styles.menuBarPart)}>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={()=>{
            if(inputText.length == 0) return
            Alert.alert(
              'Confirm',
              'Ready to throw your ideas to trash without sending them first?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Yes', onPress: () => {
                  AsyncStorage.removeItem('open_notes')
                  setInputText('')
                }},
              ],
              {cancelable: false},
            )
          }}
        >
          <Text style={styles.trashButtonText}>
              Delete
          </Text>
        </TouchableOpacity>
        </View>
        <View style={Object.assign({},{alignItems:'flex-end'},styles.menuBarPart)}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={this.sendButtonPressed}
        >
          <Text style={styles.sendButtonText}>
              Send
          </Text>
        </TouchableOpacity>
        </View>
      </View>
      <TextInput 
        style={Object.assign({},
          styles.mainInputField,
          keyboardHeight > 0 ? {
            height: Dimensions.get('window').height-keyboardHeight-90,
            top: '9%',
            width: inputWidth,
          } : {
            height:Dimensions.get('window').height*0.91-30,
            top: '9%',
            width: inputWidth,
          })}
        onChangeText={text => {
          setInputText(text)
          AsyncStorage.setItem('open_notes',text)
          .catch((e)=>console.log("error:",e))
        }}
        placeholder={"You can't wait for inspiration, you have to go after it with a club. - Jack London"}
        placeholderTextColor={"rgba(100,100,100,1)"}
        value={inputText}
        multiline={true}
        autoFocus={true}
        keyboardAppearance={'dark'}
      />
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maastrichtBlue,
  },
  // MENU BAR
  menuBar: {
    flexDirection: 'row',
    height: '9%',
  },
  menuBarPart: {
    width:'33.33%',
    height: '100%',
    justifyContent: 'center',
  },
  sendButton: {
    width: 75,
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.warmBlack,
  },
  sendButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  trashButton: {
    width: 75,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'darkred',
  },
  trashButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  settingsButton: {
    width: 75,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.warmBlack,
  },
  settingsButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  // INPUT FIELD
  mainInputField: {
    width: '100%',
    position: 'absolute',
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 18,
    backgroundColor: colors.maastrichtBlue,
    color: 'white',
  }
});
