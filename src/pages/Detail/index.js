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
  Modal } 
from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Tab, Tabs, TabHeading } from 'native-base';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import 'moment/locale/pt-br';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Detail({ navigation }) {
  
  const [estab, setEstab] = useState([]);
  const [plano, setPlano] = useState([]);
  const [pedonline, setPedonline] = useState([]);
  const [prod, setProd] = useState([]);
  const [cupom, setCupom] = useState([]);
  const [evento, setEvento] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const idestab = navigation.getParam('idestab');

  async function loadEvento(date) {
    setLoading(true);
     const response4 = await fetch(
       'https://backendeloyaqui.herokuapp.com/eventos/dia/' + date + '/' + idestab
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
      setEstab(data);
      setPlano(data[0].plano);
      setPedonline(data[0].pedonline);
    };

    async function loadProd() {
      const response2 = await fetch(
        'https://backendeloyaqui.herokuapp.com/produtos/estabelecimento/' + idestab
      );
      const data2 = await response2.json();
      setProd(data2);
    };

    async function loadCupom() {
     const response3 = await fetch(
       'https://backendeloyaqui.herokuapp.com/cupons/estabelecimento/' + idestab
     );

     const data3 = await response3.json();
     setCupom(data3);
   };

  useEffect(() => {
    loadEstab();
    loadProd();
    loadCupom();
    loadEvento(moment().format("YYYY-MM-DD"));
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
            {text: 'Sim', onPress: () => confirmAgendamento(data, hora, useremail)}
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

  async function confirmAgendamento(data, hora, useremail) {

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
            idusuario: iduser
          }),
      });

      if(responseApi.ok)
        loadEvento(data);

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
                            {/* {estab.facebook.length > 0 &&

                              <TouchableOpacity onPress={() => Linking.openURL(`fb://page/${estab.facebook}`)}>
                                <View style={styles.menuItem}>
                                  <Image style={styles.imginstagram} source={require('./assets/facebook-logo.png')} />
                                  <Text style={styles.tabSubRS}>Acompanhar</Text>
                                  <Text style={styles.tabSubRS}>{estab.facebook}</Text>
                                </View>
                              </TouchableOpacity>
                              
                            } */}
                            </View>
                          </>
                        }

                      </ScrollView>
                    )}
                </Tab>
      
                {plano > 0 &&
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Destaque/Cupom</Text></TabHeading>}>
                                       
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

                      {cupom.length > 0 ? cupom.map(cupom => 
                          <View style={styles.cupomItem} key={cupom._id}>
                            <View style={styles.barraLateralVerde}></View>
                            <View style={styles.ticket}>
                              <Text style={styles.ticketText}>{cupom.premio}</Text>
                              <Text style={styles.dadosTextRegras}>*Obtenha esse cupom no menu Cupons.</Text>
                              <Text style={styles.dadosTextRegras}>*Válido até {cupom.validade.substring(8,10) + "/" + cupom.validade.substring(5,7) + "/" + cupom.validade.substring(0,4)}*</Text>
                            </View>
                          </View>
                        ) : <Text style={styles.txtNoData}>Em breve novos Cupons. Fique de olho !</Text>
                      }

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

                {plano > 0 && pedonline == 0 &&
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Cardápio</Text></TabHeading>}>
                    <ScrollView style={[ styles.container ]}>
                      
                      {cupom.length > 0 ? cupom.map(cupom => 
                        <View style={styles.cupomItem} key={cupom._id}>
                          <View style={styles.barraLateralVerde}></View>
                          <View style={styles.ticket}>
                            <Text style={styles.ticketText}>{cupom.premio}</Text>
                            <Text style={styles.dadosTextRegras}>*Apresentar o cupom no estabelecimento*</Text>
                            <Text style={styles.dadosTextRegras}>*Válido até {cupom.validade}*</Text>
                          </View>   
                        </View>
                      ) : <Text style={styles.txtNoData}>Em breve novos Cupons. Fique de olho !</Text>
                    }
                      
                    </ScrollView>
                  </Tab>
                }

                {pedonline == 1 && 

                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Agendar</Text></TabHeading>}>

                    <View style={styles.backContainer}>               
                  
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
                      maxDate={moment().add(30, 'days') }
                      minDate={moment()}
                      iconContainer={{flex: 0.1}}
                      onDateSelected={date => loadEvento(moment(date).format("YYYY-MM-DD"))}
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
                    ListEmptyComponent={<Text style={styles.tabTitle}>Desculpe, o estabelecimento não possuí atendimento nesse dia.</Text>}
                    renderItem={({ item }) => (
                      <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { handleAgendamento(item.data,item.hora,item.status) }}>
                        <View style={styles.ItemAgenda}>
                          <Text style={styles.textMenu}>Agendar para {item.hora}:00</Text>
                          { 
                            item.status == 'D' ? <Text style={styles.textMenuGreen}>Disponível</Text> : <Text style={styles.textMenuRed}>Indisponível</Text>
                          }
                        </View>
                      </TouchableHighlight>
                    )}            
                  />

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
    height:screenHeight * 0.30,
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

  textDestaques:{
    color:'#000',
    padding:10,
    fontSize:13,
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