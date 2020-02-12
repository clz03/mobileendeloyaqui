import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableHighlight, 
  ScrollView, 
  KeyboardAvoidingView ,
  ActivityIndicator,
  Platform,
  Modal } from 'react-native';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphoneX() {
  return (
    Platform.OS === 'ios' && screenHeight >= 736
  );
}

export function isAndroid() {
  return (
    Platform.OS !== 'ios'
  );
}

export default function Register({ navigation }) {

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroValidador, setErroValidador] = useState("");
  const [erroValidador2, setErroValidador2] = useState("");
  const [erroValidador3, setErroValidador3] = useState("");
  const [erroValidador4, setErroValidador4] = useState("");
  const [loading, setLoading] = useState(false); 

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

    if(telefone == '') {
      setErroValidador4('celular não pode ser vazio');
      cError = true;
    } else {
      setErroValidador4('');
    }

    if(senha == '') {
      setErroValidador3('senha não pode ser vazio');
      cError = true;
    } else {
      setErroValidador3('');
    }
    
    if(cError) return;
    setLoading(true);

    const apireturn = await fetch(
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
          nome: nome,
          telefone: telefone
        }),
    });

    const responseJson = await apireturn.json();
    
    if (!apireturn.ok) {
      setErroValidador(responseJson.error);
      setLoading(false);
      return;
    } else {
      setErroValidador('');
    }

    await AsyncStorage.setItem('eloyuseremail', email);
    await AsyncStorage.setItem('eloyusernome', nome);
    await AsyncStorage.setItem('eloyuserid', responseJson._id);
    setLoading(false);
    navigation.navigate('AccountLogged');
}

useEffect(() => {
  CheckRedirect();
}, []);

  
  return (
    
        <View style={styles.backContainer}>
          <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
          <Text style={styles.txtTitle}>Cadastre-se</Text>
            <Text style={styles.txtTitleDesc}>Em breve teremos novidades para os inscritos no Eloy Aqui</Text>
            <View>
              <Text style={styles.labelLogin}>Nome</Text>
              <TextInput 
                style={ styles.inputLogin } 
                maxLength={40}
                autoCorrect={true} 
                placeholder="seu nome"
                value={nome}
                onChangeText={(text) => setNome(text)}
              />
              <Text style={styles.labelError}>{erroValidador2}</Text>

              <Text style={styles.labelLogin}>Celular</Text>
              <TextInput 
                style={ styles.inputLogin } 
                maxLength={30}
                placeholder="(11) 9999-9999"
                value={telefone}
                keyboardType="numeric"
                onChangeText={(text) => setTelefone(text)}
              />
              <Text style={styles.labelError}>{erroValidador4}</Text>

              <Text style={styles.labelLogin}>E-mail</Text>
              <TextInput 
                style={ styles.inputLogin } 
                maxLength={40}
                autoCapitalize='none' 
                autoCorrect={false} 
                placeholder="seu e-mail"
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
                placeholder="sua senha"
                autoCorrect={false} 
                value={senha}
                onChangeText={(text) => setSenha(text)}
              />
              <Text style={styles.labelError}>{erroValidador3}</Text>

              <TouchableHighlight style={styles.btnEntrar} onPress={handleSubmit}>
                <Text style={styles.textoEntrar}>Cadastrar</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.btnEntrar2} onPress={handleRegistered}>
                <Text style={styles.textoEntrar2}>Já tenho cadastro</Text>
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

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
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