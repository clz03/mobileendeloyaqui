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
  TouchableHighlight,
  Linking, 
  FlatList,
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Modal,
  Platform } 
from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Tab, Tabs, TabHeading } from 'native-base';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import 'moment/locale/pt-br';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

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
  const [categorias, setCategorias] = useState([]);  
  const [prod, setProd] = useState([]);
  const [servico, setServico] = useState([]);
  const [servicoid, setServicoid] = useState([]);
  const [nomeagenda, setNomeagenda] = useState('');
  //const [diasemanaState, setDiasemanaState] = useState([]);
  const [blackdates, setBlackdates] = useState([]);  
  const [startdate, setStartdate] = useState('');  
  const [seldate, setSeldate] = useState('');  
  // const [cupom, setCupom] = useState([]);
  const [evento, setEvento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  
  const idestab = navigation.getParam('idestab');

  let datesWhitelist = [{
    start: moment(),
    end: moment().add(30,'days')
  }];

  //Blacklist, tudo que nao for 1 e 3

  function gotoCalendar(nome, dias, idservico){
    let datesBlacklist = [];
    var curDate;
    var checkStart = false;
    var loadDate;

    //Current Date
    curDate = moment().day();
    if(!dias.includes(curDate.toString())){
      datesBlacklist.push(moment())
    }

    // Next 30 days
    for (let i = 1; i <= 30; ++i){
      curDate = moment().add(i,'days').day()
      if(!dias.includes(curDate.toString())){
        datesBlacklist.push(moment().add(i,'days'))
      } else {
        if(!checkStart){
          setStartdate(moment().add(i,'days'));
          setSeldate(moment().add(i,'days'));
          loadDate = moment().add(i,'days');
          checkStart = true;
        }
      }
    }
    setServicoid(idservico);
    setBlackdates(datesBlacklist);
    setNomeagenda(nome);
    loadEvento(moment(loadDate).format("YYYY-MM-DD"),idservico)
    setPagina(2);
  }

  const weekday = [
   "Domingo",
   "Segunda-Feira", 
   "Terça-Feira", 
   "Quarta-Feira", 
   "Quinta-Feira", 
   "Sexta-Feira",
   "Sábado"
  ]

  async function loadEvento(date, idservico) {
    setLoading(true);
     const response4 = await fetch(
        'https://backendeloyaqui.herokuapp.com/eventos/dia/' + date + '/' + idservico
      );

     const data4 = await response4.json();
     setEvento(data4);
     setLoading(false);
  };

  async function loadEstab() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/estabelecimentos/' + idestab
      );

      const data = await response.json();
      const plano = data[0].plano;
      const agendaonline = data[0].agendamento;
      const cardapionline = data[0].cardapio;
      setEstab(data);
      setPlano(plano);
      setAgendaonline(agendaonline);
      setCardapioonline(cardapionline);
      if (plano > 0) {
        loadProd();
        loadServico();
        //loadCupom();
        // if (agendaonline) {
        //   if(startdate !== '') loadEvento(startdate);
        // }
        if (cardapionline) loadCardapio();
      }
    };

    async function loadProd() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/produtos/estabelecimento/' + idestab
      );
      const data = await response.json();
      setProd(data);
    };

    async function loadServico() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/servicos/estabelecimento/' + idestab
      );
      const data = await response.json();
      setServico(data);
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
  }, []);

  async function handleAgendamento(data, hora, status) {

    const useremail = await AsyncStorage.getItem('eloyuseremail');

    if (useremail != null){
      if(status == 'I'){
        Alert.alert(
          'Horário Indisponível',
          'por favor selecione outro horário'
        );
      } else {
        Alert.alert(
          'Confirmação',
          'Agendar para ' + data.substring(8,10) + "/" + data.substring(5,7) + "/" + data.substring(0,4) + ' - ' + hora + ':00 ?',
          [
            {text: 'Não'},
            {text: 'Sim', onPress: () => confirmAgendamento(data, hora)}
          ]
        );
      }
    } else {
      Alert.alert(
        'Login',
        'Para agendar é preciso fazer login',
        [
          {text: 'OK'},
          {text: 'Ir para Login', onPress: () => navigation.navigate('Login')}
        ]
      );
    }
  }

  async function confirmAgendamento(data, hora) {

      const iduser = await AsyncStorage.getItem('eloyuserid');

      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/usuarios/'+ iduser
      );
  
      const datareturn = await response.json();
      
      if(!datareturn[0].validado){
        Alert.alert(
          'Seu cadastro ainda não está validado',
          'Por favor ative seu cadastro, verifique o e-mail recebido para ativar sua conta.'
        );
        return;
      }

      setLoading(true);

      const responseApi = await fetch(
        'https://backendeloyaqui.herokuapp.com/eventos', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: data,
            hora: hora,
            comentario: datareturn[0].telefone,
            idestabelecimento: idestab,
            idservico: servicoid,
            idusuario: iduser
          }),
      });

      if(responseApi.ok)
        loadEvento(data, servicoid);

      setLoading(false);

      setTimeout(() => Alert.alert('Agendamento realizado!', 'Gerencie seus agendamentos na aba Meu Perfil'), 800);
  }


  return (    
            <View style={styles.backContainer}>  

              {estab.map(estab => 
                <View key={estab._id}>
                  <ImageBackground source={{uri: estab.imagemcapa }} style={styles.backImageHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)} style={styles.buttonBack}>
                      <Icon name='chevron-left' size={24} color='#fff' />
                      <Text style={styles.textbuttonBack}>Voltar</Text>
                    </TouchableOpacity>
                
                    <Text style={styles.textTitle}>{estab.nome}</Text>
                    <Text style={styles.textDesc}>{estab.tipo} / {estab.subtipo}</Text>
                
                  </ImageBackground> 
                </View>
              )}

              <Container>
                <Tabs initialPage={0} locked={true}>
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Sobre</Text></TabHeading>}>

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
                            <Text style={styles.tabSub}>{estab.fone2}</Text>
                            <Text style={styles.tabTitle}></Text>
                            <Text style={styles.tabSub}>"{estab.descr}"</Text>
                            <Text style={styles.tabTitle}></Text>
                            
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
                            {cardapioonline &&
                             
                             <TouchableOpacity onPress={() => { navigation.navigate('Pedido', { idestab: idestab, nomeestab: estab.nome }) }}>
                                <View style={styles.menuItem}>
                                  <Icon name='restaurant' size={24} color='#794F9B' />
                                  <Text style={styles.tabSubRS}>Fazer pedido</Text>
                                  <Text style={styles.tabSubRS}>Online</Text>
                                </View>
                              </TouchableOpacity>

                            }
                             {agendaonline &&
                             
                             <TouchableOpacity onPress={() => { go }}>
                                <View style={styles.menuItem}>
                                  <Icon name='event' size={24} color='#794F9B' />
                                  <Text style={styles.tabSubRS}>Agendamento</Text>
                                  <Text style={styles.tabSubRS}>Online</Text>
                                </View>
                              </TouchableOpacity>

                            }
                            </View>
                          </>
                        }

                      </ScrollView>
                    )}
                </Tab>
      
                {plano > 0 &&
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Destaques</Text></TabHeading>}>
                                       
                    <ScrollView>

                      {prod.length > 0 ? prod.map(prod => 
                          <View key={prod._id} style={styles.container2}>
                            <ImageBackground source={{uri: prod.imagem }} style={styles.backImageDestaq}>
                              <Text style={styles.textDestaq}>{prod.nome}</Text>
                              <Text style={styles.textDesc}>{prod.descr}</Text>
                              <Text style={styles.textDesc}>{prod.preco}</Text>
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
             
               {/* {plano > 0 && pedonline ==  0 &&
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Destaques</Text></TabHeading>}>
                                       
                    <ScrollView>

                      {prod.length > 0 ? prod.map(prod => 
                          <View key={prod._id} style={styles.container2}>
                            <ImageBackground source={{uri: prod.imagem }} style={styles.backImageDestaq}>
                              <Text style={styles.textDestaq}>{prod.nome}</Text>
                              <Text style={styles.textDesc}>{prod.descr}</Text>
                              <Text style={styles.textDesc}>{prod.preco}</Text>
                            </ImageBackground>
                          </View>
                        ) : <Text style={styles.txtNoData}>Em breve novos Destaques. Fique de olho !</Text>
                      }

                    </ScrollView>
                    
                  </Tab>
                } */}

                {plano > 0 && cardapioonline == 1 &&
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Cardápio</Text></TabHeading>}>
                    <ScrollView style={styles.container}>
                      
                      {/* {catcardapio.length > 0 && catcardapio.map(catcardapio => 
                        <Text style={styles.textDestaques} key={catcardapio}>{catcardapio}</Text>
                       
                       
       
                      )} */}

                      
                        <TouchableHighlight style={styles.pedidoOnline} onPress={() => { navigation.navigate('Pedido', { idestab: idestab, nomeestab: estab.nome, pagina:'detail' }) }}>
                          <Text style={styles.textoEntrar}>Peça Online Aqui</Text>
                        </TouchableHighlight>
                   

                      {/* {cardapio.length > 0 && cardapio.map(cardapio => 
                        <View style={styles.ItemImg} key={cardapio._id}>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                            <Text style={styles.textDestaques}>{cardapio.categoria}</Text>
                              <Text style={styles.textCardapio}>{cardapio.item} - R${cardapio.valor}</Text>
                            </View>
                          </View>
                        </View>
                      )} */}

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

                    </ScrollView>
                  </Tab>
                }

                {plano > 0 && agendaonline == 1 && 

                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Agendar</Text></TabHeading>}>

                    
                  {pagina === 1 &&
                      <ScrollView style={styles.container} visible='false'>
                        <Text style={styles.tabTitle}>Selecione o serviço a ser agendado:</Text>
                    
                    {/* // 0 DOMINGO
                        // 1 SEGUNDA
                        // 2 TERCA
                        // 3 QUARTA
                        // 4 QUINTA
                        // 5 SEXTA
                        // 6 SABADO */}

                          <FlatList
                            data={servico}
                            keyExtractor={servico => servico._id}
                            ListHeaderComponent={
                              loading ? (
                                <ActivityIndicator size="large" style={styles.LoadingIndicator} />
                              ) : (
                                ""
                              )
                            }
                            renderItem={({ item }) => (

                              <View style={styles.viewCardapio}>

                                  <TouchableHighlight style={styles.ItemImg2} onPress={() => { gotoCalendar(item.nome, item.diasemana, item._id) }}>
                                    <View>
                                      <Text style={styles.textItem}>{item.nome}</Text>
                                      <Text style={styles.textItemDesc}>{item.descr}</Text>
                                      <View style={styles.containersemana}>
                                        {item.diasemana.map(diasemana => 
                                          <Text style={styles.textItemDesc} key={diasemana}>{weekday[parseInt(diasemana)]}</Text>
                                        )}
                                      </View>
                                      <Text style={styles.textItemValor}>R${item.preco}</Text> 
                                      </View>
                                  </TouchableHighlight>
                                
                              </View>
                              
                                
                            )}                      
                          />
                      </ScrollView>

                    
                }                         
                        
                      {pagina === 2 &&
                     


                    <View style={styles.backContainer}>        
                      <TouchableOpacity style={styles.buttonBack2} onPress={() => {setPagina(1); setEvento('')}}>
                        <Icon name='chevron-left' size={24} color='#484848' />
                        <Text style={styles.textback}>Voltar</Text>
                      </TouchableOpacity>
                      <Text style={styles.tabTitle}>Agendar: {nomeagenda}</Text>
                      <Text></Text>

                    
            
                    <CalendarStrip
                      calendarAnimation={{type: 'sequence', duration: 30}}
                      daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
                      style={{height: 90, paddingTop: 8, paddingBottom: 10}}
                      calendarHeaderStyle={{color: 'black'}}
                      calendarColor={'#eaeaea'}
                      dateNumberStyle={{color: 'black'}}
                      dateNameStyle={{color: 'black'}}
                      highlightDateNumberStyle={{color: 'purple'}}
                      highlightDateNameStyle={{color: 'purple'}}
                      disabledDateNameStyle={{color: 'grey'}}
                      disabledDateNumberStyle={{color: 'grey'}}
                      startingDate={startdate}
                      selectedDate={seldate}
                      maxDate={moment().add(30, 'days') }
                      minDate={moment()}
                      updateWeek={false}
                      datesWhitelist={datesWhitelist}
                      datesBlacklist={blackdates}
                      iconContainer={{flex: 0.1}}
                      onDateSelected={date => loadEvento(moment(date).format("YYYY-MM-DD"), servicoid)}
                    />
                   
                   <FlatList
                    scrollEnabled={true}
                    data={evento}
                    keyExtractor={evento => String(evento.id)}
                    ListHeaderComponent={
                      loading ? ( 
                        <Modal
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
                      ) : (
                        ""
                      )
                    }
                    ListEmptyComponent={<Text style={styles.tabTitle}>Desculpe, o estabelecimento não possuí atendimento disponível nesse dia.</Text>}
                    renderItem={({ item }) => (
                      <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { handleAgendamento(item.data,item.hora,item.status) }}>
                        <View style={styles.ItemAgenda}>
                          <Text style={styles.textMenu}>Agendar para {item.hora}:00</Text>
                          { 
                            item.status == 'D' ? <Text style={styles.textMenuGreen}>Disponível</Text> : <Text style={styles.textMenuRed}>Agendado</Text>
                          }
                        </View>
                      </TouchableHighlight>
                    )}            
                  />
                
                    </View>  
                  }
                  

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
    paddingHorizontal: 0,
    marginBottom:20
  },

  backImageHeader: {
    height:screenHeight * 0.30,
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
    flexDirection:'row'
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
    borderRadius:5,
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
    fontSize:18
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


});