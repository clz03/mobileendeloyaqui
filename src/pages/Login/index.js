import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight } from 'react-native';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroValidador, setErroValidador] = useState("");

  async function CheckRedirect(){
    const remove = false;

    if (remove) {
      await AsyncStorage.removeItem('useremail');
    } else {
      const Svalue = await AsyncStorage.getItem('useremail');
      if (Svalue != null) {
        navigation.navigate('AccountLogged', { email: Svalue });
      }
    }
  }

  async function handleRegistered(){
    navigation.navigate('AccountLogged');
  }

  async function handleSubmit() {

    if(email == '') {
      setErroValidador('e-mail não pode ser vazio');
      return;
    } else {
      setErroValidador('');
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email) === false){
      setErroValidador('e-mail não está válido. Por favor verifique');
      return;
    } else {
      setErroValidador('');
    }

    const responseApi = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
    });

    await AsyncStorage.setItem('useremail', email);
    navigation.navigate('AccountLogged')
}

  CheckRedirect();

  return (
    
        <View style={styles.backContainer}>
          
          <View style={styles.container}>
            <Text style={styles.txtTitle}>Login</Text>
            <Text style={styles.txtTitleDesc}>Em breve teremos novidades para os inscritos no Eloy Aqui</Text>

            <View style={styles.formAuth}>


                <Text style={styles.labelLogin}>E-mail</Text>
                <TextInput 
                  style={ styles.inputLogin } 
                  autoCapitalize='none' 
                  autoCorrect={false} 
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <Text style={styles.labelError}>{erroValidador}</Text>

                <Text style={styles.labelLogin}>Senha</Text>
                <TextInput 
                  style={ styles.inputLogin } 
                  autoCapitalize='none' 
                  autoCorrect={false} 
                  value={senha}
                  onChangeText={(text) => setSenha(text)}
                />
                <Text style={styles.labelError}>{erroValidador}</Text>


              <TouchableHighlight style={styles.btnEntrar} onPress={handleSubmit}>
                <Text style={styles.textoEntrar}>Entrar</Text>
              </TouchableHighlight>

            </View>

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
    marginTop:10,
    textAlign:'center',
    fontWeight:'bold'
  },

  txtTitleDesc:{
    color:'#000',
    fontSize:20,
    marginTop:10,
    marginLeft:5,
    marginRight:5,
    textAlign:'center',
  },

  labelLogin:{
    color:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginTop:5,
  },

  labelError:{
    color:'#D92121',
    marginLeft: screenWidth * 0.06
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
    width: screenWidth * 0.90,
    backgroundColor:'#471a88',
    height:35,
    marginLeft: screenWidth * 0.05,
    marginTop: 15,
    borderRadius:6,

  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  }
  

});