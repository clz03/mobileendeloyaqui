import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableHighlight, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Modal,
  AsyncStorage
 } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isAndroid() {
  return (
    Platform.OS !== 'ios'
  );
}

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroValidador, setErroValidador] = useState("");
  const [erroValidador2, setErroValidador2] = useState("");
  const [loading, setLoading] = useState(false);


  async function CheckRedirect(){
    setLoading(true);
    if (await AsyncStorage.getItem('eloyuseremail') != null){
      setLoading(false);
      navigation.navigate('AccountLogged');
    }
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
      await AsyncStorage.setItem('eloyuserestab', data.idestabelecimento === undefined ? "" : data.idestabelecimento);
      await AsyncStorage.setItem('eloyuserid', data._id);
      setLoading(false);
      navigation.navigate('AccountLogged')
    } else {
      setErroValidador2(data.error);
      setLoading(false);
    }

}

  useEffect(() => {
    CheckRedirect();
  }, []);

  
  

  return (
    
        <View style={styles.backContainer}>
          
          <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={70}>
            <Text style={styles.txtTitle}>Login</Text>
            <Text style={styles.txtTitleDesc}>Faça login e aproveite todos os serviços do nosso bairro !</Text>

            <View style={styles.formAuth}>

                <Text style={styles.labelLogin}>E-mail</Text>
                <TextInput 
                  style={ styles.inputLogin } 
                  autoCapitalize='none' 
                  autoCorrect={false} 
                  keyboardType="email-address"
                  maxLength={40}
                  placeholder="seu e-mail cadastrado"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <Text style={styles.labelError}>{erroValidador}</Text>

                <Text style={styles.labelLogin}>Senha</Text>
                <TextInput 
                  style={ styles.inputLogin } 
                  autoCapitalize='none' 
                  autoCorrect={false}
                  maxLength={20}
                  placeholder="sua senha"
                  secureTextEntry={true}
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

              <TouchableHighlight style={styles.btnEntrar2} onPress={handleRegistered}>
                <Text style={styles.textoEntrar2}>Ainda não tenho cadastro</Text>
              </TouchableHighlight>

              {
                loading && <Modal
                transparent={true}
                animationType={'none'}
                visible={loading}>
                <View style={styles.modalBackground}>
                  <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                      animating={loading} />
                      <Text style={styles.textMenuSmall}>processando</Text>
                  </View>
                </View>
              </Modal>
              }
            </View>
            </KeyboardAvoidingView>
          </ScrollView>
          
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

  formAuth: {
    marginTop:10
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000090'
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  textMenuSmall: {
    fontSize:10,
    color: '#000',
    alignItems: 'center',
  },

  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'#f0f0f0'
  },

  txtTitle:{
    color:'#000',
    fontSize:25,
    marginTop:screenHeight*0.008,
    textAlign:'center',
    fontWeight:'bold'
  },

  txtTitleDesc:{
    color:'#484848',
    fontSize:18,
    fontWeight:'300',
    marginTop:screenHeight*0.008,
    marginLeft:5,
    marginRight:5,
    textAlign:'center',
  },

  labelLogin:{
    color:'#484848',
    marginLeft: screenWidth * 0.06,
    marginTop:screenHeight*0.005,
  },

  labelError:{
    color:'#D92121',
    marginLeft: screenWidth * 0.06
  },

  inputLogin:{
    height: screenHeight*0.08,
    width:screenWidth * 0.90,
    marginLeft: screenWidth * 0.05,
    borderColor: '#a1a1a1', 
    backgroundColor:'#fff',
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3,
    fontSize:15
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