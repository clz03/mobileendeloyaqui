import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, StyleSheet, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Tab, Tabs, TabHeading } from 'native-base';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphone5() {
  return (
    Platform.OS === 'ios' && screenWidth == 320
  );
}

export default function Detail({ navigation }) {
  
  const [estab, setEstab] = useState([]);
  const [plano, setPlano] = useState([]);
  const [pedonline, setPedonline] = useState([]);
  const [prod, setProd] = useState([]);
  const [cupom, setCupom] = useState([]);
  
  const idestab = navigation.getParam('idestab');

  useEffect(() => {
    async function loadEstab() {

      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/estabelecimentos/' + idestab
      );

      const data = await response.json();
      setEstab(data);
      setPlano(data[0].plano);
      setPlano(data[0].pedonline);
    }

     async function loadProd() {
       const response2 = await fetch(
         'https://backendeloyaqui.herokuapp.com/produtos/estabelecimento/' + idestab
       );
  
       const data2 = await response2.json();
       setProd(data2);
     }

     async function loadCupom() {
      const response3 = await fetch(
        'https://backendeloyaqui.herokuapp.com/cupons/estabelecimento/' + idestab
      );
 
      const data3 = await response3.json();
      setCupom(data3);
    }

    loadEstab();
    //if(plano > 0) {   
    loadProd();
    loadCupom();
    //}
  }, []);


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
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Informações</Text></TabHeading>}>

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
                              
                              <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=+55${estab.whatsapp}`)}>
                                <View style={styles.menuItem}>
                                  <Image style={styles.imgwhats} source={require('./assets/whatsapp-logo.png')} />
                                  <Text style={styles.tabSubRS}>Enviar Whatsapp</Text>
                                  <Text style={styles.tabSubRS}>{estab.whatsapp}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => Linking.openURL(`instagram://user?username=${estab.instagram}`)}>
                                <View style={styles.menuItem}>
                                  <Image style={styles.imginstagram} source={require('./assets/instagram-logo.png')} />
                                  <Text style={styles.tabSubRS}>Acompanhar</Text>
                                  <Text style={styles.tabSubRS}>{estab.instagram}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => Linking.openURL(`fb://page/${estab.facebook}`)}>
                                <View style={styles.menuItem}>
                                  <Image style={styles.imginstagram} source={require('./assets/facebook-logo.png')} />
                                  <Text style={styles.tabSubRS}>Acompanhar</Text>
                                  <Text style={styles.tabSubRS}>{estab.facebook}</Text>
                                </View>
                              </TouchableOpacity>
                          
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
                    </ScrollView>
                    
                  </Tab>
                }
             

                {plano > 0 && 
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Descontos</Text></TabHeading>}>
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

  textTitle: {
    marginTop: screenHeight * 0.05,
    color:'#fff',
    fontSize:20,
    paddingLeft:15
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
    height: isIphone5() ? screenHeight*0.20 : screenHeight*0.15,
    backgroundColor: '#fff',
    borderRadius:10,
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
    fontWeight:'bold',
    borderBottomWidth:2,
    borderColor:'#000'
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