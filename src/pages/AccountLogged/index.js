import React, { useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableHighlight, FlatList, ActivityIndicator } from 'react-native';
import {Container, Tab, Tabs, TabHeading } from 'native-base';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function AccountLogged({ navigation }) {

  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState([]);  
  const [cupom, setCupom] = useState([]);  
  const [loading, setLoading] = useState(false);

  async function handleLogout(){
    await AsyncStorage.removeItem('eloyuseremail');
    await AsyncStorage.removeItem('eloyusernome');
    await AsyncStorage.removeItem('eloyuserid');
    navigation.navigate('Login');
  }

  async function getStorageValue() {
    setNome(await AsyncStorage.getItem('eloyusernome'));
  }

  async function handleCancel(idevento) {
    const responseApi = await fetch(
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

  useEffect(() => {
    setLoading(true);
    getStorageValue();
    loadEventos();
    loadCupons();
  }, []);

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <Text style={styles.txtTitle}>Seja Bem Vindo, {nome}</Text>

            <TouchableHighlight style={styles.btnEntrar} onPress={handleLogout}>
              <Text style={styles.textoEntrar}>Sair</Text>
            </TouchableHighlight>

            <Container>
                <Tabs initialPage={0} locked={true}>
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meus Agendamentos</Text></TabHeading>}>
                    <View style={styles.container}>
                      <FlatList
                      data={evento}
                      keyExtractor={evento => String(evento._id)}
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.backImageHeader}/>
                        ) : (
                          ""
                        )
                      }
                      ListEmptyComponent={<Text style={styles.txtTitleDesc}>Você não tem agendamentos. Acesse os estabelecimentos e agende agora mesmo !</Text>}
                      renderItem={({ item }) => (                
                        <View style={styles.Item}>
                        <Text style={styles.textDescPrinc}>{item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4)}</Text>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                              <Text style={styles.textDesc}>{item.hora}:00</Text>
                              <Text style={styles.textDesc}>{item.idestabelecimento.nome}</Text>
                              <Text style={styles.textDesc}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                              <TouchableHighlight style={styles.btnRemover} onPress={() => { handleCancel(item._id) }}>
                                <Text style={styles.textoEntrar}>Cancelar</Text>
                              </TouchableHighlight>
                            </View>
                          </View>
                        </View>
                        )}            
                      />
                    </View>
                  </Tab>


                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meus Cupons</Text></TabHeading>}>
                    <View style={styles.container}>
                    <FlatList
                      data={cupom}
                      keyExtractor={cupom => String(cupom._id)}
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.backImageHeader}/>
                        ) : (
                          ""
                        )
                      }
                      ListEmptyComponent={<Text style={styles.txtTitleDesc}>Você não tem cupons.</Text>}
                      renderItem={({ item }) => (                
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
    fontSize:25,
    marginTop:10,
    textAlign:'center',
    fontWeight:'bold'
  },

  txtTitleDesc:{
    color:'#000',
    fontSize:14,
    marginTop:10,
    marginLeft:5
  },

  textDescPrinc: {
    fontSize: 14,
    fontWeight:'bold',
    marginTop:5
  },

  textDesc: {
    fontSize: 13,
  },

  Item: {
    height:screenHeight * 0.13,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingLeft: 10,
  },

  txtContainer:{
    width:screenWidth *0.7,
  },

  tabHeading: {
    backgroundColor: "#eaeaea"
  },

  btnEntrar:{
    width: screenWidth * 0.50,
    backgroundColor:'#471a88',
    height:35,
    marginTop: 15,
    marginBottom: 15,
    borderRadius:6,
    alignSelf:'center'
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  },

  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:0,
    fontSize:10
  },

  btnRemover:{
    width: screenWidth * 0.30,
    backgroundColor:'red',
    height:35,
    marginTop: 5,
    marginBottom: 5,
    borderRadius:6
  },
  

});