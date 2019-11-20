import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Register({ navigation }) {

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erroValidador, setErroValidador] = useState("");
  const [erroValidador2, setErroValidador2] = useState("");
  const [erroValidador3, setErroValidador3] = useState("");

  async function CheckRedirect(){
    if (await AsyncStorage.getItem('eloyuseremail') != null)
      navigation.navigate('AccountLogged');
  }

  function handleRegistered(){
    navigation.navigate('Login');
  }

  async function handleSubmit() {

    var cError = false;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email) === false){
      setErroValidador('e-mail não está válido. Por favor verifique');
      cError = true;
    } else {
      setErroValidador('');
    }

    if(nome == '') {
      setErroValidador2('nome não pode ser vazio');
      cError = true;
    } else {
      setErroValidador2('');
    }

    if(senha == '') {
      setErroValidador3('nome não pode ser vazio');
      cError = true;
    } else {
      setErroValidador3('');
    }
    
    if(cError) return;

    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios/email/'+email 
    );

    if(await response.json() > 0){
      setErroValidador('e-mail já cadastrado. Por favor verifique');
      return;
    } else {
      setErroValidador('');
    }

    await fetch(
       'https://backendeloyaqui.herokuapp.com/usuarios', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pwd: senha,
          validado: false,
          nome: nome
        }),
    });

    await AsyncStorage.setItem('eloyuseremail', email);
    await AsyncStorage.setItem('eloyusernome', nome);
    await AsyncStorage.setItem('eloyuserid', data._id);
    navigation.navigate('AccountLogged')
}

useEffect(() => {
  CheckRedirect();
}, []);

  
  return (
    
        <View style={styles.backContainer}>
          <KeyboardAvoidingView style={styles.container} behavior="position">
          <Text style={styles.txtTitle}>Cadastre-se</Text>
            <Text style={styles.txtTitleDesc}>Em breve teremos novidades para os inscritos no Eloy Aqui</Text>
            <View>
              <Text style={styles.labelLogin}>Nome</Text>
              <TextInput 
                style={ styles.inputLogin } 
                maxLength={35}
                autoCorrect={true} 
                value={nome}
                onChangeText={(text) => setNome(text)}
              />
              <Text style={styles.labelError}>{erroValidador2}</Text>

              <Text style={styles.labelLogin}>E-mail</Text>
              <TextInput 
                style={ styles.inputLogin } 
                maxLength={35}
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
                maxLength={20}
                autoCapitalize='none'
                secureTextEntry={true}
                autoCorrect={false} 
                value={senha}
                onChangeText={(text) => setSenha(text)}
              />
              <Text style={styles.labelError}>{erroValidador3}</Text>

              <TouchableHighlight style={styles.btnEntrar} onPress={handleSubmit}>
                <Text style={styles.textoEntrar}>Cadastrar</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.btnEntrar} onPress={handleRegistered}>
                <Text style={styles.textoEntrar}>Já tenho cadastro</Text>
              </TouchableHighlight>
            </View>

          </KeyboardAvoidingView>
        </View>
  );
}

var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },

  container: {
    flexDirection: 'column',
    backgroundColor:'#fff'
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
    marginTop:0,
    borderColor: '#471a88', 
    borderWidth: 1,
    borderRadius:5
  },

  btnEntrar:{
    width: screenWidth * 0.90,
    backgroundColor:'#471a88',
    height:35,
    marginLeft: screenWidth * 0.05,
    marginTop: 10,
    borderRadius:6,

  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  }
  

});