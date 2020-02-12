import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Forgot({ navigation }) {

  const [email, setEmail] = useState("");  
  const [erroValidador, setErroValidador] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegistered(){
    navigation.navigate('Login');
  }

  async function handleSubmit() {

    if(email == '') {
      setErroValidador('preencha seu e-mail');
      return;
    }
    
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email) === false){
      setErroValidador('e-mail não está válido. Por favor verifique');
      return;
    } else {
      setErroValidador('');
    }

    setLoading(true);

    const responseApi = await fetch(
      'https://backendeloyaqui.herokuapp.com/forgotpwd', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email          
        }),
    });

    const data = await responseApi.json();

    if (responseApi.ok) {
        Alert.alert(
            'Esqueci minha senha',
            'Link de ativação da senha enviado para ' + email
          );
        setLoading(false);
        handleRegistered();
    } else {
      setLoading(false);
      setErroValidador(data.error);
    }
    

}

  return (
    
        <View style={styles.backContainer}>
          
          <View style={styles.container}>
            <Text style={styles.txtTitle}>Esqueci a senha !</Text>
            <Text style={styles.txtTitleDesc}>Sem problemas, preencha seu e-mail e enviaremos um novo link para acesso</Text>

            <View style={styles.formAuth}>


                <Text style={styles.labelLogin}>E-mail</Text>
                <TextInput 
                  style={ styles.inputLogin } 
                  autoCapitalize='none' 
                  autoCorrect={false} 
                  placeholder="seu e-mail cadastrado"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <Text style={styles.labelError}>{erroValidador}</Text>
              

              <TouchableHighlight style={styles.btnEntrar} onPress={handleSubmit}>
                <Text style={styles.textoEntrar}>Enviar nova senha</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.btnEntrar2} onPress={handleRegistered}>
                <Text style={styles.textoEntrar2}>Voltar</Text>
              </TouchableHighlight>

              {
                loading && <ActivityIndicator size="large" style={styles.LoadingIndicator} />
              }

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
    backgroundColor:'#f0f0f0'
  },

  LoadingIndicator:{
    justifyContent:"center",
    marginTop:25
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
    color:'#484848',
    fontSize:18,
    fontWeight:'300',
    marginTop:10,
    marginBottom:10,
    marginLeft:5,
    marginRight:5,
    textAlign:'center',
  },

  labelLogin:{
    color:'#484848',
    marginLeft: screenWidth * 0.05,
    marginTop:screenHeight*0.005,
  },

  labelError:{
    color:'#D92121',
    marginLeft: screenWidth * 0.06
  },

  inputLogin:{
    height: screenHeight*0.06,
    width:screenWidth * 0.90,
    marginLeft: screenWidth * 0.05,
    borderColor: '#a1a1a1', 
    backgroundColor:'#fff',
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
  },

  btnEntrar:{
    width: screenWidth * 0.90,
    backgroundColor:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginTop: 20,
    padding:8,
    borderRadius:20,
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
  },

  btnEntrar2:{
    width: screenWidth * 0.90,
    padding:8,
    marginLeft: screenWidth * 0.05,
    marginTop: 15,
    borderRadius:20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor:'#a1a1a1',
    backgroundColor:'#fff'
  },

  textoEntrar2:{
    color:'#484848',
    textAlign:'center',
    fontSize:15,
  },
  

});