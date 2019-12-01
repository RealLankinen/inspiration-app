import { AppLoading } from 'expo';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, SafeAreaView } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import colors from './constants/Colors';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </SafeAreaView>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    // Asset.loadAsync([
    // ]),
    // Font.loadAsync({
    //   // This is the font that we are using for our tab bar
    //   ...Ionicons.font,
    //   // We include SpaceMono because we use it in HomeScreen.js. Feel free to
    //   // remove this if you are not using it in your app
    //   'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    // }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maastrichtBlue,
    paddingTop: 30,
  },
});
