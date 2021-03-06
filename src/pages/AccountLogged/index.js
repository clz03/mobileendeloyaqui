import React, { useState, useEffect} from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    TouchableHighlight, 
    FlatList, 
    ScrollView,
    Alert, 
    Platform, 
    TextInput,
    AsyncStorage,
    Modal
} from 'react-native';
import {Container, Tab, Tabs, TabHeading } from 'native-base';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import Icon from 'react-native-vector-icons/MaterialIcons';

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

export default function AccountLogged({ navigation }) {

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState([]);
  const [apelido, setApelido] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [compl, setCompl] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  //const [usuario, setUsuario] = useState("");
  const [evento, setEvento] = useState([]);
  const [cupom, setCupom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msginativo, setMsginativo] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  const [erroValidador2, setErroValidador2] = useState("");
  const [cadNome, setCadNome] = useState(false);
  const [cadEnd, setCadEnd] = useState(false);
  const [cadEmail, setCadEmail] = useState(false);
  const [cadTel, setCadTel] = useState(false);
  const [showEnd, setShowEnd] = useState(false);


  async function registerForPushNotificationsAsync() {
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // only asks if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    // On Android, permissions are granted on app installation, so
    // `askAsync` will never prompt the user
  
    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      //alert('Não obtivemos permissão para enviar notificações');
      return;
    }
  
    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    //console.log(token);
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch('https://backendeloyaqui.herokuapp.com/usuarios/' + iduser , {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pushToken: token
      }),
    });
  }

  function handlelogoutfromButton(){
    Alert.alert(
      'Confirmação',
      'Deseja sair do seu perfil ?',
      [
        {text: 'Não'},
        {text: 'Sim', onPress: () => handleLogout()}
      ]
    );
  };

  async function handleLogout(){
    //await AsyncStorage.removeItem('eloyuseremail');
    //await AsyncStorage.removeItem('eloyusernome');
    //await AsyncStorage.removeItem('eloyuserestab');
    //await AsyncStorage.removeItem('eloyuserid');
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  async function getStorageValue() {
    setNome(await AsyncStorage.getItem('eloyusernome'));
  }

  function handleDeleteEnd(idend) {
    Alert.alert(
      'Confirmação',
      'Deseja remover esse endereço ?',
      [
        {text: 'Não'},
        {text: 'Sim', onPress: () => confirmDeleteEnd(idend)}
      ]
    );
  };

  async function confirmDeleteEnd(idend) {
    await fetch(
      'https://backendeloyaqui.herokuapp.com/enderecos/' + idend, {
        method: 'DELETE'
    });

    setLoading(true);
    loadEndereco();
  }

  function handleCancel(idevento) {
    Alert.alert(
      'Confirmação',
      'Deseja remover o agendamento ?',
      [
        {text: 'Não'},
        {text: 'Sim', onPress: () => confirmCancel(idevento)}
      ]
    );
  };

  async function confirmCancel(idevento) {

    await fetch(
      //'http://192.168.0.8:8080/eventos/' + idevento, {
      'https://backendeloyaqui.herokuapp.com/eventos/' + idevento, {
        method: 'DELETE'
    });

    loadEventos();
  }

  async function loadEventos() {
    setLoading(true);
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/eventos/usuario/' + iduser
    );
    const data = await response.json();
    setLoading(false);
    setEvento(data);
  }

  async function loadCupons() {
    setLoading(true);
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usercupons/usuario/' + iduser
    );
    const data = await response.json();

    setCupom(data);
    setLoading(false);
  }

  async function loadEndereco() {
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/enderecos/usuario/' + iduser
    );
    const data = await response.json();
    setEndereco(data);
    setLoading(false);
  };


  async function refreshList() {
    //setRefreshing(true);
    setLoading(true);
    await loadEventos();
    if (msginativo) checkUserAtivo();
    //setRefreshing(false);
    setLoading(false);
  }

  async function refreshList2() {
    //setRefreshing(true);
    setLoading(true);
    await loadCupons();
    if (msginativo) checkUserAtivo();
    setLoading(false);
    //setRefreshing(false);
  }
  
  async function checkUserAtivo(){
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios/' + iduser
    );
    const data = await response.json();
    //setUsuario(data);

    if (typeof data[0] === 'object'){
      data[0].validado === false ? setMsginativo(true) : setMsginativo(false);
      setEmail(data[0].email);
      setTelefone(data[0].telefone);
    } else {
      handleLogout();
    }
  }

  function handleEndereco(){
    setShowEnd(true);
  };

  function handleNome(){
    setCadNome(true);
  };

  function handleTelefone(){
    setCadTel(true);
  };

  function handleEmail(){
    setCadEmail(true);
  };

  async function SubmitEndereco(){

    const iduser = await AsyncStorage.getItem('eloyuserid');
    var cError = false;

    if(cep == '') {
      setErroValidador2('cep não pode ser vazio');
      cError = true;
    }

    if(bairro == '') {
      setErroValidador2('bairro não pode ser vazio');
      cError = true;
    }

    if(numero == '') {
      setErroValidador2('numero não pode ser vazio');
      cError = true;
    }

    if(rua == '') {
      setErroValidador2('rua não pode ser vazio');
      cError = true;
    }

    if(apelido == '') {
      setErroValidador2('apelido não pode ser vazio');
      cError = true;
    }
   
    if(cError) return;
    setLoading(true);

    const apireturn = await fetch(
       'https://backendeloyaqui.herokuapp.com/enderecos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apelido,
          rua,
          numero,
          bairro,
          cep,
          complemento:compl,
          idusuario:iduser
        }),
    });

    const responseJson = await apireturn.json();
    
    if (apireturn.ok) {
      setErroValidador2('');
      setLoading(false);
      setCadEnd(false);
      loadEndereco();
    } else {
      setErroValidador2(responseJson.error);
      setLoading(false);
    }

};

  async function handleSubmitUser() {
    const iduser = await AsyncStorage.getItem('eloyuserid');

    setLoading(true);

    const responseApi = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios/'+iduser, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          telefone: telefone,
          email: email
        }),
    });

    const data = await responseApi.json();

    if (responseApi.ok) {
      setLoading(false);
      await AsyncStorage.setItem('eloyusernome', nome);
      await AsyncStorage.setItem('eloyuseremail', email);
      checkUserAtivo();
      setCadNome(false);
      setCadEmail(false);
      setCadTel(false);
    } else {
      setErroValidador2(data.error);
      setLoading(false);
    }
}

  useEffect(() => {
    //setLoading(true);
    getStorageValue();
    loadEventos();
    loadCupons();
    loadEndereco();
    checkUserAtivo();
    registerForPushNotificationsAsync()
  }, []);

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>
          <Icon style={styles.Iconcenter} name='account-circle' size={48} color='#585858' />
            <Text style={styles.txtTitle} numberOfLines={1}>Seja Bem Vindo, {nome}</Text>


            { msginativo &&
              <View style={styles.msguserinativo}>
                <Text style={styles.txtMsguserinativo}>Sua conta ainda não está ativa, verifique seu e-mail e ative seu cadastro para utilizar agendamentos, cupons e delivery</Text>
              </View>
            }

            <Container>
                <Tabs initialPage={0} locked={true}>
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Agendamentos</Text></TabHeading>}>
                    <View style={styles.container}>
                      <FlatList
                      data={evento}
                      keyExtractor={evento => String(evento._id)}
                      
                      onRefresh={refreshList}
                      refreshing={loading}
                      ListEmptyComponent={loading == false &&
                          <Text style={styles.textEmpty}>Nenhum agendamento. Arraste para atualizar !</Text>
                      }
                      
                      renderItem={({ item }) => (                
                        <View style={styles.Item}>
                        <Text style={styles.textDescPrinc}>{item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4)}</Text>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                              <Text style={styles.textDesc}>{item.hora}:00</Text>
                              <Text style={styles.textDesc}>{item.idestabelecimento.nome}</Text>
                              <Text style={styles.textDesc} numberOfLines={1}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                              <TouchableHighlight style={styles.btnRemover} onPress={() => { handleCancel(item._id) }}>
                                <Text style={styles.textoRemover}>Cancelar</Text>
                              </TouchableHighlight>
                            </View>
                          </View>
                        </View>
                        )}            
                      />
                    </View>
                  </Tab>


                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Cupons</Text></TabHeading>}>
                    <View style={styles.container}>
                    <FlatList
                      data={cupom}
                      keyExtractor={cupom => String(cupom._id)}
                     
                      onRefresh={refreshList2}
                      refreshing={loading}
                      ListEmptyComponent={<Text style={styles.tabTitle}>Você não possuí cupons válidos. Arraste para atualizar !</Text>}
                      renderItem={({ item }) => (  
                       (item.idcupom != null &&              
                        <View style={styles.Item}>
                        <Text style={styles.textDescPrinc}>{item.idcupom.premio}</Text>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                              <Text style={styles.textDesc}>Valido até: {item.idcupom.validade.substring(8,10) + "/" + item.idcupom.validade.substring(5,7) + "/" + item.idcupom.validade.substring(0,4)}</Text>
                              <Text style={styles.textDesc}>{item.idestabelecimento.nome}</Text>
                              <Text style={styles.textDesc}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                              {item.utilizado === true &&
                                <Text style={styles.textDescUtilizado}>Cupom utilizado</Text>
                              }
                              <Text style={styles.dadosTextRegras}>*{item.idcupom.regra}</Text>
                              <Text style={styles.dadosTextRegras}>*Apresentar esse cupom no estabelecimento*</Text>
                            </View>
                          </View>
                       </View> )
                        )}            
                      />
                    </View>
                  </Tab>

                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meus Dados</Text></TabHeading>}>
                    <View style={styles.container}>

                      <ScrollView style={styles.Item}>
                          
                          <View style={styles.containerGeralForm}>

                          <TouchableHighlight underlayColor={"#fff"} onPress={handleNome}>
                            <View style={styles.buttonContainer}>
                            <View style={styles.containerColumn}>
                              <Text style={styles.textDesc}>Meu Nome:</Text>
                            </View>
                            <Text style={styles.textGray}>{nome} <Icon name='chevron-right' size={16} color='#585858' /></Text>
                            </View>
                            </TouchableHighlight>
                          </View>

                          <TouchableHighlight underlayColor={"#fff"} onPress={handleTelefone}>
                            <View style={styles.containerGeralForm}>
                              <View style={styles.buttonContainer}>
                                <View style={styles.containerColumn}>
                                  <Text style={styles.textDesc}>Meu Telefone:</Text>
                                </View>
                                <Text style={styles.textGray}>{telefone} <Icon name='chevron-right' size={16} color='#585858' /></Text>
                                </View>
                            </View>
                          </TouchableHighlight>

                          <TouchableHighlight underlayColor={"#fff"} onPress={handleEmail}>
                          <View style={styles.containerGeralForm}>
                          <View style={styles.buttonContainer}>
                              <View style={styles.containerColumn}>
                                <Text style={styles.textDesc}>Meu E-mail:</Text>
                              </View>
                              <Text style={styles.textGray}>{email} <Icon name='chevron-right' size={16} color='#585858' /></Text>
                              </View>
                          </View>
                          </TouchableHighlight>

                          <TouchableHighlight underlayColor={"#fff"} onPress={handleEndereco}>
                          <View style={styles.containerGeralForm}>
                          <View style={styles.buttonContainer}>
                              <View style={styles.containerColumn}>
                                <Text style={styles.textDesc}>Meus Endereços</Text>
                              </View>
                              <Text style={styles.textGray}>visualizar <Icon name='chevron-right' size={16} color='#585858' /></Text>
                              </View>
                          </View>
                          </TouchableHighlight>

                          <TouchableHighlight underlayColor={"#fff"} onPress={handlelogoutfromButton}>
                          <View style={styles.containerGeralForm}>
                          <View style={styles.buttonContainer}>
                              <View style={styles.containerColumn}>
                                <Text style={styles.textDesc}>Logout</Text>
                              </View>
                              <Text style={styles.textGray}>aperte para sair <Icon name='chevron-right' size={16} color='#585858' /></Text>
                              </View>
                          </View>
                          </TouchableHighlight>

                        </ScrollView>
                    
                    </View>
                  </Tab>
                </Tabs>
              </Container>
          </View>

          {/* {
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
              } */}

              {cadNome && <Modal
                transparent={true}
                animationType={'none'}
                visible={cadNome}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Alterar Nome</Text>
                    <Text></Text>
                    <Text style={styles.labelLogin}>Nome</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Seu Nome"
                      value={nome}
                      onChangeText={(text) => setNome(text)}
                    />

                     <Text style={styles.labelError}>{erroValidador2}</Text>
                     <TouchableHighlight style={styles.btnEntrarModal} onPress={handleSubmitUser}>
                       <Text style={styles.textoEntrar}>Alterar Nome</Text>
                     </TouchableHighlight>
                     
                     <TouchableHighlight style={styles.btnEntrarModal2} onPress={() => setCadNome(false)}>
                      <Text style={styles.textoEntrar2}>Cancelar</Text>
                     </TouchableHighlight>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }

              {cadTel && <Modal
                transparent={true}
                animationType={'none'}
                visible={cadTel}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Alterar Telefone</Text>
                    <Text></Text>
                    <Text style={styles.labelLogin}>Telefone</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Seu Telefone"
                      value={telefone}
                      onChangeText={(text) => setTelefone(text)}
                    />

                     <Text style={styles.labelError}>{erroValidador2}</Text>
                     <TouchableHighlight style={styles.btnEntrarModal} onPress={handleSubmitUser}>
                      <Text style={styles.textoEntrar}>Alterar Telefone</Text>
                     </TouchableHighlight>
                     
                     <TouchableHighlight style={styles.btnEntrarModal2} onPress={() => setCadTel(false)}>
                      <Text style={styles.textoEntrar2}>Cancelar</Text>
                     </TouchableHighlight>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }

              {cadEmail && <Modal
                transparent={true}
                animationType={'none'}
                visible={cadEmail}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Alterar E-mail</Text>
                    <Text></Text>
                    <Text style={styles.labelLogin}>E-mail</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Seu E-mail"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    />

                     <Text style={styles.labelError}>{erroValidador2}</Text>
                     <TouchableHighlight style={styles.btnEntrarModal} onPress={handleSubmitUser}>
                      <Text style={styles.textoEntrar}>Alterar E-mail</Text>
                     </TouchableHighlight>
                     
                     <TouchableHighlight style={styles.btnEntrarModal2} onPress={() => setCadEmail(false)}>
                      <Text style={styles.textoEntrar2}>Cancelar</Text>
                     </TouchableHighlight>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }

              {showEnd && <Modal
                transparent={true}
                animationType={'none'}
                visible={showEnd}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Meu(s) Endereço(s)</Text>
                    <Text></Text>
                    {endereco.map(endereco => 
                      <View key={endereco._id}>
                        <Text style={styles.textDescPrinc2}>Apelido: <Text style={styles.textDesc}>{endereco.apelido}</Text></Text>
                        <Text style={styles.textDescPrinc2}>End: <Text style={styles.textDesc}>{endereco.rua}, {endereco.numero}</Text></Text>
                        <Text style={styles.textDescPrinc2}>Bairro: <Text style={styles.textDesc}>{endereco.bairro}</Text></Text>
                        {endereco.complemento !== '' && 
                          <Text style={styles.textDescPrinc2}>Complemento: <Text style={styles.textDesc}>{endereco.complemento}</Text></Text>
                        }
                        <Text style={styles.textDescPrinc2}>CEP: <Text style={styles.textDesc}>{endereco.cep}</Text></Text>
                        <TouchableHighlight onPress={() => handleDeleteEnd(endereco._id)}>
                          <Text style={styles.textoRemoverEnd}>( Remover )</Text>
                        </TouchableHighlight>
                        <Text></Text>
                      </View>
                    )}
                   

                     <Text style={styles.labelError}>{erroValidador2}</Text>
                     <TouchableHighlight style={styles.btnEntrarModal} onPress={() => { setShowEnd(false);setCadEnd(true) }}>
                      <Text style={styles.textoEntrar}>Cadastrar Novo</Text>
                     </TouchableHighlight>
                     
                     <TouchableHighlight style={styles.btnEntrarModal2} onPress={() => setShowEnd(false)}>
                      <Text style={styles.textoEntrar2}>Cancelar</Text>
                     </TouchableHighlight>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }

              

              {cadEnd && <Modal
                transparent={true}
                animationType={'none'}
                visible={cadEnd}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Novo Endereço</Text>
                    <Text style={styles.labelLogin}>Apelido</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Apelido para identificar"
                      value={apelido}
                      onChangeText={(text) => setApelido(text)}
                    />
                      <Text style={styles.labelLogin}>Rua</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Rua/Av do seu Endereço"
                      value={rua}
                      onChangeText={(text) => setRua(text)}
                    />
                      <Text style={styles.labelLogin}>Número</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: 856"
                      value={numero}
                      onChangeText={(text) => setNumero(text)}
                    />
                      <Text style={styles.labelLogin}>Bairro</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: Jd Ermida I"
                      value={bairro}
                      onChangeText={(text) => setBairro(text)}
                    />
                      <Text style={styles.labelLogin}>Complemento</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: Torre Lest - AP 85"
                      value={compl}
                      onChangeText={(text) => setCompl(text)}
                    />
                      <Text style={styles.labelLogin}>CEP</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: 13212-070"
                      value={cep}
                      onChangeText={(text) => setCep(text)}
                    />

                     <Text style={styles.labelError}>{erroValidador2}</Text>
                     <TouchableHighlight style={styles.btnEntrarModal} onPress={SubmitEndereco}>
                      <Text style={styles.textoEntrar}>Cadastrar Endereço</Text>
                     </TouchableHighlight>
                     
                     <TouchableHighlight style={styles.btnEntrarModal2} onPress={() => setCadEnd(false)}>
                      <Text style={styles.textoEntrar2}>Cancelar</Text>
                     </TouchableHighlight>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }

        </View>
  );
}



var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor:'#e5e5e5'
  },

  container: {
    flexDirection: 'column',
    flex: 1,
  },

  containerGeral:{
    flexDirection:'row',
  },

  containerGeralForm:{
    borderBottomWidth:0.25,
    borderColor:'#585858',
    paddingTop:14,
  },

  containerGeralForm2:{
    flexDirection:'row',
    paddingTop:2,
    paddingBottom:2

  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000080'
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

  ModalFormEnd: {
    backgroundColor: '#FFFFFF',
    width: screenWidth * 0.9,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft:screenWidth*0.05,
    paddingTop:10,
  },

  textEmpty: {
    fontSize:14,
    fontWeight:'300',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop:10,
    textAlign:'center'
  },

  txtTitle:{
    color:'#000',
    fontSize:22,
    marginTop:screenHeight*0.01,
    marginBottom:screenHeight*0.01,
    textAlign:'center',
    fontWeight:'bold'
  },

  Iconcenter:{
    marginTop:5,
    textAlign:'center',
  },

  txtTitleDesc:{
    color:'#000',
    fontSize:14,
    marginTop:screenHeight*0.01,
    marginLeft:screenHeight*0.01,
  },

  textDescPrinc: {
    fontSize: 14,
    fontWeight:'bold',
    marginTop:screenHeight*0.005,
  },

  textDescPrinc2: {
    fontSize: 14,
    fontWeight:'bold',
  },

  textDescPrincEnd: {
    fontSize: 16,
    fontWeight:'bold',
    marginTop:15
  },

  LoadingIndicator:{
    justifyContent:"center",
    marginTop:25
  },

  textDesc: {
    fontSize: 13,
    fontWeight:'normal',
  },

  textDescUtilizado: {
    fontSize: 13,
    fontWeight:'normal',
    color:'red'
  },

  textPadrao: {
    fontSize: 14,
    fontWeight:'normal',
  },

  Item: {
    // height: isIphoneX() ? screenHeight*0.13 : isAndroid() ? screenHeight*0.21 : screenHeight*0.175,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    marginLeft: screenWidth*0.025,
    paddingBottom:5,
    paddingTop:5
  },

  txtContainer:{
    width:screenWidth *0.95,
  },

  tabHeading: {
    backgroundColor: "#eaeaea"
  },

  btnEntrar:{
    width: screenWidth * 0.95,
    backgroundColor:'#e5e5e5',
    borderWidth:1,
    borderColor:'#585858',
    borderRadius:5,
    padding:5,
    marginTop:15,
    borderRadius:6,
    alignSelf:'flex-start',
    alignItems:'center'
  },

  btnEntrar2:{
    width: screenWidth * 0.95,
    borderWidth:1,
    backgroundColor:'#794F9B',
    borderColor:'#fff',
    height:35,
    marginTop: 10,
    borderRadius:6,
    marginBottom: 5
  },

  btnEntrarModal:{
    width: screenWidth * 0.8,
    backgroundColor:'#471a88',
    padding:6,
    marginTop: 10,
    borderRadius:20,
    marginBottom: 5
  },

  btnEntrarModal2:{
    width: screenWidth * 0.8,
    borderWidth:1,
    backgroundColor:'#fff',
    borderColor:'#a1a1a1',
    padding:6,
    marginTop: 2,
    borderRadius:20,
    marginBottom: 5
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:16,
  },

  textoEntrar2:{
    color:'#484848',
    textAlign:'center',
    fontSize:16,
  },

  textoSair:{
    color:'#585858',
    textAlign:'center',
    fontSize:16,
  },



  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:0,
    fontSize:10
  },

  textoRemover:{
    color:'#fff',
    textAlign:'center',
    fontSize:16
  },

  textoRemoverEnd:{
    color:'red',
    fontSize:13,
  },

  btnRemover:{
    width: screenWidth * 0.30,
    backgroundColor:'red',
    padding:4,
    marginTop: 5,
    borderRadius:4
  },

  btnRemoverEnd:{
    marginLeft:10,
  },

  tabTitle: {
    paddingLeft: 10,
    paddingTop:10,
    color:'#707070'
  },

  msguserinativo: {
    marginBottom:screenHeight*0.01,
    marginLeft: screenWidth*0.025,
    marginRight: screenWidth*0.02,
    backgroundColor: "#fff7dc",
    borderRadius: 5
  },

  txtMsguserinativo: {
    textAlign:'center'
  },
  
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    width: 18,
  },

  badgeContainer: {
    position: 'absolute',
  },

  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },

  labelLogin:{
    color:'#484848',
    marginTop:screenHeight*0.005,
  },

  labelError:{
    color:'#D92121',
    marginLeft: screenWidth * 0.06
  },

  inputLogin:{
    width:screenWidth * 0.95,
    borderColor: '#471a88', 
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3,
    paddingBottom:5,
    paddingTop: 5
  },

  inputLoginDisabled:{
    width:screenWidth * 0.95,
    color:'gray',
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3,
    paddingBottom:5,
    paddingTop: 5
  },

  inputLoginModal:{
    width:screenWidth * 0.8,
    paddingBottom:5,
    paddingTop: 5,
    borderColor: '#a1a1a1', 
    backgroundColor:'#fff',
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight:10,
    marginBottom:5
  },

  containerColumn:{
    flexDirection:'column',
  },

  textGray:{
    color:'#808080',
    fontSize:14,
  },

});