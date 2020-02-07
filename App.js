import React from 'react';
import Routes from './src/routes';
import { View, StatusBar, YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App(){
  return (
    <>
          <Routes />
          <View>
            <StatusBar barStyle='light-content'></StatusBar>
          </View>
    </>
  );
}