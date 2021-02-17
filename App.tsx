import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import Navigation from './navigation';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
