import React, {useEffect} from 'react';
import Routes from './src/routes';
import { View, StatusBar, YellowBox } from 'react-native';
// import * as Notifications from 'expo';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App(){
  
  // useEffect(() => {
  //   const subscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     const url = response.notification.request.content.data.page;
  //     Linking.openUrl(url);
  //   });
  // }, []);

  return (
    <>
          <Routes />
          <View>
            <StatusBar barStyle='light-content'></StatusBar>
          </View>
    </>
  );
}