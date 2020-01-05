import React, { useState, useEffect} from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    TouchableHighlight, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    Platform, 
    AsyncStorage 
} from 'react-native';
import {Container, Tab, Tabs, TabHeading } from 'native-base';

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
  const [usuario, setUsuario] = useState("");
  const [evento, setEvento] = useState([]);  
  const [cupom, setCupom] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [msginativo, setMsginativo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleLogout(){
    await AsyncStorage.removeItem('eloyuseremail');
    await AsyncStorage.removeItem('eloyusernome');
    await AsyncStorage.removeItem('eloyuserid');
    navigation.navigate('Login');
  }

  async function getStorageValue() {
    setNome(await AsyncStorage.getItem('eloyusernome'));
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
      'https://backendeloyaqui.herokuapp.com/eventos/' + idevento, {
        method: 'DELETE'
    });

    setLoading(true);
    loadEventos();
  }

  async function loadEventos() {
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/eventos/usuario/' + iduser
    );
    const data = await response.json();
    setLoading(false);
    setEvento(data);
  }

  async function loadCupons() {
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usercupons/usuario/' + iduser
    );
    const data = await response.json();

    setCupom(data);
    setLoading(false);
  }

  async function refreshList() {
    setRefreshing(true);
    await loadEventos();
    if (msginativo) checkUserAtivo();
    setRefreshing(false);
  }

  async function refreshList2() {
    setRefreshing(true);
    await loadCupons();
    if (msginativo) checkUserAtivo();
    setRefreshing(false);
  }
  
  async function checkUserAtivo(){
    const iduser = await AsyncStorage.getItem('eloyuserid');
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios/' + iduser
    );
    const data = await response.json();
    setUsuario(data);
    if (typeof data[0] === 'object'){
      data[0].validado === false ? setMsginativo(true) : setMsginativo(false);
    } else {
      handleLogout();
    }
  }

  useEffect(() => {
    setLoading(true);
    getStorageValue();
    loadEventos();
    loadCupons();
    checkUserAtivo();
  }, []);

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <Text style={styles.txtTitle} numberOfLines={1}>Seja Bem Vindo, {nome}</Text>

            <TouchableHighlight style={styles.btnEntrar} onPress={handleLogout}>
              <Text style={styles.textoEntrar}>Sair</Text>
            </TouchableHighlight>

            { msginativo &&
              <View style={styles.msguserinativo}>
                <Text style={styles.txtMsguserinativo}>Sua conta ainda não está ativa, verifique seu e-mail e ative seu cadastro para realizar agendamentos e utilizar cupons</Text>
              </View>
            }

            <Container>
                <Tabs initialPage={0} locked={true}>
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Agendamentos</Text></TabHeading>}>
                    <View style={styles.container}>
                      <FlatList
                      data={evento}
                      keyExtractor={evento => String(evento._id)}
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.LoadingIndicator}/>
                        ) : (
                          ""
                        )
                      }
                      onRefresh={refreshList}
                      refreshing={refreshing}
                      ListEmptyComponent={<Text style={styles.tabTitle}>Você não possuí agendamentos. Arraste para atualizar !</Text>}
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
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.LoadingIndicator}/>
                        ) : (
                          ""
                        )
                      }
                      onRefresh={refreshList2}
                      refreshing={refreshing}
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
                              <Text style={styles.dadosTextRegras}>*{item.idcupom.regra}</Text>
                              <Text style={styles.dadosTextRegras}>*Apresentar esse cupom no estabelecimento*</Text>
                            </View>
                          </View>
                       </View> )
                        )}            
                      />
                    </View>
                  </Tab>

                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meu Perfil</Text></TabHeading>}>
                    <View style={styles.container}>
                    <FlatList
                      data={usuario}
                      keyExtractor={usuario => String(usuario._id)}
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.LoadingIndicator}/>
                        ) : (
                          ""
                        )
                      }
                      renderItem={({ item }) => (                
                        <View style={styles.Item}>
                        <Text style={styles.textDescPrinc}>{item.nome}</Text>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                              <Text style={styles.textDesc}>{item.telefone}</Text>
                              <Text style={styles.textDesc}>{item.email}</Text>
                            </View>
                          </View>
                          <Text style={styles.textDescPrinc}>Endereço:</Text>
                          <Text style={styles.textDesc}>Atmosphera</Text>
                          <Text style={styles.textDesc}>Rua Chiara Lubich, 371</Text>
                          <Text style={styles.textDesc}>Torre Figueira - AP74</Text>
                        </View>
                        )}            
                      />
                    </View>
                  </Tab>
                </Tabs>
              </Container>
          </View>
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
    flex: 1,
    backgroundColor:'#fff'
  },

  containerGeral:{
    flexDirection:'row',
  },

  txtTitle:{
    color:'#000',
    fontSize:22,
    marginTop:screenHeight*0.015,
    textAlign:'center',
    fontWeight:'bold'
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

  LoadingIndicator:{
    justifyContent:"center",
    marginTop:25
  },

  textDesc: {
    fontSize: 13,
  },

  Item: {
    // height: isIphoneX() ? screenHeight*0.13 : isAndroid() ? screenHeight*0.21 : screenHeight*0.175,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    marginLeft: screenWidth*0.025
  },

  txtContainer:{
    width:screenWidth *0.95,
  },

  tabHeading: {
    backgroundColor: "#eaeaea"
  },

  btnEntrar:{
    width: screenWidth * 0.50,
    backgroundColor:'#471a88',
    height: isIphoneX() ? screenHeight * 0.04 : screenHeight * 0.05,
    marginTop: screenHeight*0.02,
    marginBottom: screenHeight*0.02,
    borderRadius:6,
    alignSelf:'center'
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:16,
    marginTop: isAndroid() ? screenHeight * 0.004 : screenHeight * 0.01,
  },


  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:0,
    fontSize:10
  },

  textoRemover:{
    color:'#fff',
    textAlign:'center',
    fontSize:16,
    marginTop: isAndroid() ? screenHeight * 0 : screenHeight * 0.003,
  },

  btnRemover:{
    width: screenWidth * 0.30,
    backgroundColor:'red',
    height: isIphoneX() ? screenHeight * 0.03 : screenHeight * 0.04,
    marginTop: screenHeight*0.008,
    borderRadius:4
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

});