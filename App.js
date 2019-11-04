import React from 'react';
import Routes from './src/routes';
import { View, StatusBar } from 'react-native';

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