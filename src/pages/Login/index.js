import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroValidador, setErroValidador] = useState("");
  const [erroValidador2, setErroValidador2] = useState("");
  const [loading, setLoading] = useState(false);

  async function CheckRedirect(){
    if (await AsyncStorage.getItem('eloyuseremail') != null)
      navigation.navigate('AccountLogged');
  }

  function handleForgotPwd(){
    navigation.navigate('ForgotPwd');
  }

  function handleRegistered(){
    navigation.navigate('Register');
  }

  async function handleSubmit() {

    if(email == '') {
      setErroValidador('preencha seu e-mail');
      return;
    }

    if(senha == '') {
      setErroValidador2('preencha sua senha');
      return;
    } else {
      setErroValidador2('');
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
      'https://backendeloyaqui.herokuapp.com/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        }),
    });

    const data = await responseApi.json();

    if (responseApi.ok) {
      await AsyncStorage.setItem('eloyuseremail', email);
      await AsyncStorage.setItem('eloyusernome', data.nome);
      await AsyncStorage.setItem('eloyuserid', data._id);
      setLoading(false);
      navigation.navigate('AccountLogged')
    } else {
      setErroValidador2(data.error);
      setLoading(false);
    }


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
                <Text style={styles.labelError}>{erroValidador2}</Text>

              <TouchableOpacity style={styles.labelLogin} onPress={handleForgotPwd}>
                <Text>Esqueci minha senha</Text>
              </TouchableOpacity>

              <TouchableHighlight style={styles.btnEntrar} onPress={handleSubmit}>
                <Text style={styles.textoEntrar}>Entrar</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.btnEntrar} onPress={handleRegistered}>
                <Text style={styles.textoEntrar}>Não tenho cadastro</Text>
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
  
  LoadingIndicator:{
    justifyContent:"center",
    marginTop:25
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