import React, { useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function AccountLogged({ navigation }) {

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  async function getStorageValue() {
    setEmail(await AsyncStorage.getItem('eloyuseremail'));
    setNome(await AsyncStorage.getItem('eloyusernome'));
  }

  async function handleLogout(){
      await AsyncStorage.removeItem('eloyuseremail');
      await AsyncStorage.removeItem('eloyusernome');
      navigation.navigate('Register');
  }

  useEffect(() => {
    getStorageValue();
  }, []);

  return (
    
        <View style={styles.backContainer}>
          
          <View style={styles.container}>
            <Text style={styles.txtTitle}>Seja Bem vindo</Text>
            <Text style={styles.txtTitleDesc}>{nome}</Text>
            <Text style={styles.txtTitleDesc}>Em breve teremos novidades para os inscritos no Eloy Aqui</Text>
            <TouchableHighlight style={styles.btnEntrar} onPress={handleLogout}>
                <Text style={styles.textoEntrar}>Logout</Text>
              </TouchableHighlight>
          </View>
        </View>
  );
}

var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },

  backHeader: {
    height: screenHeight*0.1,
    alignContent:'center',
    alignItems:'center',
    backgroundColor:'#471a88',
    },

  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'#fff'
  },

  textMenuTitleHeader: {
    fontSize:17,
    color: '#fff',
    paddingTop:10,
    textAlign:'center'
  },

  txtTitle:{
    color:'#000',
    fontSize:25,
    marginTop:20,
    textAlign:'center',
    fontWeight:'bold'
  },

  txtTitleDesc:{
    color:'#000',
    fontSize:20,
    marginTop:20,
    marginLeft:5,
    marginRight:5,
    textAlign:'center',
  },

  labelLogin:{
    color:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginTop:25,
  },

  inputLogin:{
    height: 40, 
    width:screenWidth * 0.90,
    marginLeft: screenWidth * 0.05,
    marginTop:2,
    borderColor: '#471a88', 
    borderWidth: 1,
    borderRadius:5
  },

  labelSenha:{
    color:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginTop:10,
  },

  inputSenha:{
    height: 40, 
    width:screenWidth * 0.90,
    marginLeft: screenWidth * 0.05,
    marginTop:2,
    borderColor: '#471a88', 
    borderWidth: 1,
    borderRadius:5
  },

  btnEntrar:{
    width: screenWidth * 0.50,
    backgroundColor:'#471a88',
    height:35,
    marginLeft: screenWidth * 0.05,
    marginTop: 15,
    borderRadius:6,
    alignSelf:'center'
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  }
  

});