import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ImageBackground, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Linking, 
  FlatList,
  ActivityIndicator,
  Platform } 
from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Tab, Tabs } from 'native-base';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
var apiLocal = 'http://192.168.0.8/';
var apiCloud = 'https://backendeloyaqui.herokuapp.com/';
 
export function isIphoneX() {
  return (
    Platform.OS === 'ios' && screenHeight >= 812
  );
};

export function isAndroid() {
  return (
    Platform.OS !== 'ios'
  );
};

export default function Detail({ navigation }) {
  
  const [estab, setEstab] = useState([]);
  const [plano, setPlano] = useState([]);
  const [agendaonline, setAgendaonline] = useState([]);
  const [cardapio, setCardapio] = useState("");
  const [cardapioonline, setCardapioonline] = useState(false);
  //const [delivery, setDelivery] = useState(false);
  const [categorias, setCategorias] = useState([]);  
  const [prod, setProd] = useState([]);
  //const [nomeagenda, setNomeagenda] = useState('');
  //const [diasemanaState, setDiasemanaState] = useState([]);
  // const [cupom, setCupom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initPage, setInitPage] = useState(0);
  
  const idestab = navigation.getParam('idestab');
  const schedule = navigation.getParam('schedule');
 
  const weekday = [
    "Domingo",
    "Segunda", 
    "Terça", 
    "Quarta", 
    "Quinta", 
    "Sexta",
    "Sábado"
   ]

  async function loadEstab() {
      const response = await fetch(
        //'http://192.168.0.8:8080/estabelecimentos/' + idestab
        'https://backendeloyaqui.herokuapp.com/estabelecimentos/' + idestab
      );

      const data = await response.json();
      const plano = data[0].plano;
      const agendaonline = data[0].agendamento;
      const cardapionline = data[0].cardapio;
      //const deliveryonline = data[0].delivery
      setEstab(data);
      setPlano(plano);
      setAgendaonline(agendaonline);
      setCardapioonline(cardapionline);
      //setDelivery(deliveryonline);

      if (plano > 0) {
        loadProd();

        //loadCupom();
        // if (agendaonline) {
        //   if(startdate !== '') loadEvento(startdate);
        // }
        if (cardapionline) loadCardapio();
        //if (agendaonline) {
        //  loadFeriados();
        //  setupWebsocket();
        //  subscribeToNewAgenda(status => loadEvento('', profid));
        //}
      }
    };

    async function loadProd() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/produtos/estabelecimento/' + idestab
      );
      const data = await response.json();
      setProd(data);
    };

  //   async function loadCupom() {
  //    const response3 = await fetch(
  //      'https://backendeloyaqui.herokuapp.com/cupons/estabelecimento/' + idestab
  //    );

  //    const data3 = await response3.json();
  //    setCupom(data3);
  //  };


  async function loadCardapio() {
    const response5 = await fetch(
      'https://backendeloyaqui.herokuapp.com/cardapios/estabelecimento/' + idestab
    );
    const data5 = await response5.json();
    const categorias = data5.map(data5 => data5.categoria);
    let unique = [...new Set(categorias)]; 
    setCategorias(unique);
    setCardapio(data5);
    setLoading(false)
  };


  useEffect(() => {
    loadEstab();

    if(schedule){
      setTimeout(() => {
        setInitPage(2);
      }, 1500);
    };

  }, []);


  return (    
            <View style={styles.backContainer}>  

              {estab.map(estab => 
                <View key={estab._id}>
                  <ImageBackground source={{uri: estab.imagemcapa }} style={styles.backImageHeader}>
                  <View style={styles.layer}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)} style={styles.buttonBack}>
                      <Icon name='chevron-left' size={24} color='#fff' />
                      <Text style={styles.textbuttonBack}>Voltar</Text>
                    </TouchableOpacity>
                
                    <Text style={styles.textTitle}>{estab.nome}</Text>
                    <Text style={styles.textDesc}>{estab.tipo} / {estab.subtipo}</Text>
                </View>
                  </ImageBackground> 
                </View>
              )}

              <Container>

            
                    <Tabs initialPage={0} page={initPage} onChangeTab={({ i }) => setInitPage(i)}>
                  <Tab heading="Sobre">
                    {estab.map(estab => 
                        <ScrollView key={estab._id} style={[ styles.container2 ]}>
                          <Text style={styles.tabTitle}>Endereço</Text>
                          <Text style={styles.tabSub}>{estab.rua}, {estab.numero}</Text>
                          <Text style={styles.tabSub}>{estab.bairro}</Text>
                          <Text style={styles.tabSub}>{estab.cep}</Text>

                          <Text style={styles.tabTitle}>Telefone</Text>
                          <Text style={styles.tabSub}>{estab.fone1}</Text>
                          
                          {plano > 0 && 
                            <>
                              {estab.fone2.length > 0 &&
                                <Text style={styles.tabSub}>{estab.fone2}</Text>
                              }
                              <Text style={styles.tabSub}></Text>
                              <Text style={styles.tabSub}>"{estab.descr}"</Text>
                              
                              <View style={[ styles.container ]}>
                              
                              {estab.whatsapp.length > 0 &&

                                <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=+55${estab.whatsapp}`)}>
                                  <View style={styles.menuItem}>
                                    <Image style={styles.imgwhats} source={require('./assets/whatsapp-logo.png')} />
                                    <Text style={styles.tabSubRS}>Enviar Whatsapp</Text>
                                    <Text style={styles.tabSubRS}>{estab.whatsapp}</Text>
                                  </View>
                                </TouchableOpacity>

                              }
                              {estab.instagram.length > 0 &&
                              
                              <TouchableOpacity onPress={() => Linking.openURL(`instagram://user?username=${estab.instagram}`)}>
                                  <View style={styles.menuItem}>
                                    <Image style={styles.imginstagram} source={require('./assets/instagram-logo.png')} />
                                    <Text style={styles.tabSubRS}>Acompanhar</Text>
                                    <Text style={styles.tabSubRS}>{estab.instagram}</Text>
                                  </View>
                                </TouchableOpacity>

                              }
                            
                              <TouchableOpacity onPress={() => Linking.openURL(`tel:${estab.fone1}`)}>
                                  <View style={styles.menuItem}>
                                    <Icon name='phone' size={24} color='#794F9B' />
                                    <Text style={styles.tabSubRS}>Ligar</Text>
                                    <Text style={styles.tabSubRS}>{estab.fone1}</Text>
                                  </View>
                                </TouchableOpacity>

                            
                              {/* {delivery &&
                              
                              <TouchableOpacity onPress={() => { setInitPage(3) }}>
                                  <View style={styles.menuItem}>
                                    <Icon name='restaurant' size={24} color='#794F9B' />
                                    <Text style={styles.tabSubRS}>Fazer pedido</Text>
                                    <Text style={styles.tabSubRS}>Online</Text>
                                  </View>
                                </TouchableOpacity>

                              } 
                              {agendaonline &&
                              
                              <TouchableOpacity onPress={() => { setInitPage(3) }}>
                                  <View style={styles.menuItem}>
                                    <Icon name='event' size={24} color='#794F9B' />
                                    <Text style={styles.tabSubRS}>Agendamento</Text>
                                    <Text style={styles.tabSubRS}>Online</Text>
                                  </View>
                                </TouchableOpacity>

                              }*/}
                              </View>
                            </>
                          }

                        </ScrollView>
                      )}
                  </Tab>
        
                  {plano > 0 &&
                    // <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Destaques</Text></TabHeading>}>
                      <Tab heading="Destaques">
                                        
                      <ScrollView>

                        {prod.length > 0 ? prod.map(prod => 
                            <View key={prod._id} style={styles.container2}>
                              <ImageBackground source={{uri: prod.imagem }} style={styles.backImageDestaq}>
                              <View style={styles.layer}>
                                <Text style={styles.textDestaq}>{prod.nome}</Text>
                                <Text style={styles.textDesc}>{prod.descr}</Text>
                                <Text style={styles.textDesc}>{prod.preco}</Text>
                              </View>
                              </ImageBackground>
                            </View>
                          ) : <Text style={styles.txtNoData}>Em breve novos Destaques. Fique de olho !</Text>
                        }

                        {/* {cupom.length > 0 ? cupom.map(cupom => 
                            <View style={styles.cupomItem} key={cupom._id}>
                              <View style={styles.barraLateralVerde}></View>
                              <View style={styles.ticket}>
                                <Text style={styles.ticketText}>{cupom.premio}</Text>
                                <Text style={styles.dadosTextRegras}>*Obtenha esse cupom no menu Cupons.</Text>
                                <Text style={styles.dadosTextRegras}>*Válido até {cupom.validade.substring(8,10) + "/" + cupom.validade.substring(5,7) + "/" + cupom.validade.substring(0,4)}*</Text>
                              </View>
                            </View>
                          ) : <Text style={styles.txtNoData}>Em breve novos Cupons. Fique de olho !</Text>
                        } */}

                      </ScrollView>
                      
                    </Tab>
                  }
              

                  {plano > 0 && cardapioonline == 1 &&
                    // <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Cardápio</Text></TabHeading>}>
                      <Tab heading="Cardápio">
                      <View style={styles.container}>

                        <FlatList
                          data={categorias}
                          keyExtractor={categorias => categorias}
                          ListHeaderComponent={
                            loading ? (
                              <ActivityIndicator size="large" style={styles.LoadingIndicator} />
                            ) : (
                              ""
                            )
                          }
                          renderItem={({ item }) => (

                            <View style={styles.viewCardapio}>
                              <Text style={styles.textDestaques}>{item}</Text>

                              {cardapio.map(cardapio => 
                                <View key={cardapio._id}>

                                {item === cardapio.categoria &&
                                    <View style={styles.ItemImg2}>
                                        <Text style={styles.textItem}>{cardapio.item}</Text>
                                        <Text style={styles.textItemDesc}>Arroz, Feijão, Farofa, Batata</Text>
                                        <Text style={styles.textItemValor}>R${cardapio.valor}</Text> 
                                    </View>
                                }

                                </View>
                              )}
                                
                            </View>
                          )}            
                        />

                      </View>
                    </Tab>
                  }

                  {plano > 0 && agendaonline == 1 && 

                    // <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Agendar</Text></TabHeading>}>
                      <Tab heading="Agendar">

                    
                        <View style={styles.container2}>

                          <TouchableOpacity style={styles.btnEntrar} onPress={() => { navigation.navigate('Book', { idestab: idestab }) }}>
                            <Text style={styles.textoEntrar}>Agendar Serviço</Text>
                          </TouchableOpacity>
                           
                        </View>

                    
                    </Tab>
                  }

                </Tabs>
                
              </Container>
             </View> 
  
          );
}


var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0
  },

  backImageHeader: {
    height:screenHeight * 0.30
  },

  layer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },  

  viewCardapio:{
    marginTop:5
  },

  pedidoOnline:{
    marginTop:10,
    marginBottom:5,
    marginLeft:screenWidth* 0.025,
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor:'#794F9B',
    borderRadius:5,
    alignItems:'center'
  },

  ItemImg: {
    width: screenWidth,
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    marginTop:10
  },

  ItemImg2: {
    borderWidth:1,
    borderColor: '#d3d3d3',
    width: screenWidth * 0.95,
    marginLeft: screenWidth * 0.025,
    marginBottom:8
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

  textTitle: {
    marginTop: screenHeight * 0.05,
    color:'#fff',
    fontSize:20,
    paddingLeft:15
  },

  textMenu: {
    fontSize:13,
    color: '#000'
  },

  textMenuSmall: {
    fontSize:10,
    color: '#000',
    alignItems: 'center',
  },

  textMenuGreen: {
    fontSize:13,
    color: 'green'
  },

  textMenuRed: {
    fontSize:13,
    color: 'red'
  },

  textItem:{
    marginLeft:screenWidth*0.025,
    marginTop:4
  },

  textItemDesc:{
    marginLeft:screenWidth*0.025,
    fontSize:11,
    color:'#595959'
  },

  textItemDesc2:{
    marginLeft:screenWidth*0.025,
    marginTop:8,
    fontSize:11,
    color:'#595959'
  },


  textItemValor:{
    marginLeft:screenWidth*0.025,
    fontSize:13,
    fontWeight:'bold',
    marginBottom:5,
    marginTop:5,
    color:'#595959',
    borderColor: '#c3c3c3',
  },

  textoEntrar:{
    marginLeft:5,
    marginTop:3,
    marginBottom:3
  },

  tabTitleLink: {
    paddingTop:10,
    color:'#484848',
    fontWeight:'500'
  },

  tabTitle: {
    paddingLeft: 10,
    paddingTop:10,
    color:'#707070'
  },
  
  tabSub: {
    paddingLeft: 10,
    color:'#000'
  },

  tabSubRS: {
    paddingLeft: 0,
    color:'#000',
    fontSize:11
  },
  
  textDesc: {
    color:'#fff',
    fontSize:13,
    paddingLeft:15,
  },

  textCardapio: {
    color:'#000',
    fontSize:13,
    marginLeft:10,
    marginBottom:5
  },

  textDestaq: {
    color:'#fff',
    fontSize:18,
    marginLeft:15,
    marginTop:10
  },

  txtNoData: {
    marginLeft: 10,
    marginTop: 20,
    color:'#000',
    fontSize:11
  },

  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
    backgroundColor:'#fff',
    fontSize: 10,
  },

  containersemana:{
    flexDirection: 'row'
  },

  container2: {
    flexWrap: 'wrap',
    backgroundColor:'#fff',
    fontSize: 10
  },

  scene: {
    flex:1,
  },

  tabHeading: {
    backgroundColor: "#eaeaea"
  },

  menuItem:{
    width: screenWidth *0.31,
    height: screenHeight*0.12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    textAlign:'center',
    borderRadius:15,
    borderWidth:1,
    borderColor:'#d3d3d3',
    marginTop:10,
    marginLeft:6
  },

  ItemAgenda:{
    width: screenWidth *0.95,
    height: screenHeight*0.10,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    textAlign:'center',
    borderRadius:10,
    borderWidth:1,
    borderColor:'#d3d3d3',
    marginTop:10,
    marginLeft:8
  },

  menuItemDestaq:{
    width: screenWidth *0.95,
    height: screenHeight*0.18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    textAlign:'center',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#d3d3d3',
    marginTop:10,
    marginLeft:8
  },

  backImageDestaq: {
    height:screenHeight * 0.15,
    width: screenWidth,
    marginTop:10
  },

  textbuttonBack: {
    color:'#fff',
    fontSize:18,
  },

  buttonBack: {
    color:'#000',
    paddingLeft: 10,
    marginTop: screenHeight * 0.07,
    flexDirection: 'row'
  },

  buttonBack2: {
    color:'#484848',
    paddingTop:10,
    flexDirection: 'row'
  },

  textback: {
    paddingTop:5,
  },

  textDestaques:{
    color:'#000',
    marginLeft:10,
    marginBottom:5,
    fontSize:13,
    fontWeight:'bold',
    width: screenWidth * 0.95
  },

  cupomItem:{
    flexDirection: 'row',
    width: screenWidth *0.93,
    height: screenHeight*0.15,
    backgroundColor: '#fff',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#a5a5a5',
    marginTop:10,
    marginLeft:screenWidth *0.03,
  },

  barraLateralVerde:{
    backgroundColor:'green',
    width:screenWidth *0.03,
    height:'100%',
    borderTopLeftRadius:15,
    borderBottomLeftRadius:15
  },

  barraLateralCinza:{
    backgroundColor:'gray',
    width:screenWidth *0.03,
    height:'100%',
    borderTopLeftRadius:15,
    borderBottomLeftRadius:15
  },

  ticket:{
    borderRightColor:'#e5e5e5',
    borderRightWidth:2,
    width: screenWidth *0.95,
  },

  ticketText:{
    color:'#5d5d5d',
    marginTop:5,
    marginLeft:10,
    fontWeight:'bold'
  },

  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:3,
    marginTop:screenHeight*0.02,
    fontSize:10
  },

  imgwhats: {
    width:screenWidth * 0.09,
    height:screenWidth * 0.09,
    marginBottom:5,
  },

  imginstagram: {
    width:screenWidth * 0.06,
    height:screenWidth * 0.06,
    marginBottom:5,
  },

  btnEntrar:{
    width: screenWidth * 0.90,
    backgroundColor:'green',
    marginLeft: screenWidth * 0.05,
    marginTop: 20,
    padding:16,
    borderRadius:5,
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:15
  }


});