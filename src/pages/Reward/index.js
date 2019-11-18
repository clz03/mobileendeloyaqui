import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Platform, ActivityIndicator, Image, TouchableHighlight } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphone5() {
  return (
    Platform.OS === 'ios' && screenWidth == 320
  );
}

export default function Reward() {

  const [cupom, setCupom] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false){

    if(totalCount && pageNumber > totalCount) return;
 
    const response = await fetch(
      `https://backendeloyaqui.herokuapp.com/cupons?page=${pageNumber}` 
    );

    const data = await response.json();
    setCupom(shouldRefresh ? data.result : [...cupom, ...data.result]);
    setTotalCount(Math.ceil(data.totalRecords / 10));
    setPage(pageNumber + 1)
    setLoading(false)
  };

  useEffect(() => {
    setLoading(true)
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  function handleCupom(){

  };

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>

          <FlatList
            data={cupom}
            keyExtractor={cupom => String(cupom._id)}
            onEndReached={() => loadPage()}
            onEndReachedThreshold={0.1}
            onRefresh={refreshList}
            refreshing={refreshing}
            ListHeaderComponent={
              loading ? (
                <ActivityIndicator size="large" style={styles.LoadingIndicator} />
              ) : (
                ""
              )
            }
            renderItem={({ item }) => (
          
              <View style={styles.menuItem}>
                <View style={styles.barraLateralVerde}></View>

                <View style={styles.dados}>
                  <Text numberOfLines={1} style={styles.ticketText}>{item.premio}</Text>
                  <View style={styles.containerGeral}>
                    <View style={styles.imgContainer}>
                      <Image style={styles.imagem} source={{uri: item.idestabelecimento.imagem }}></Image>
                    </View>
                    <View style={styles.txtContainer}>
                      <Text style={styles.dadosTextTitle}>Estabelecimento:</Text>
                      <Text numberOfLines={1} style={styles.dadosText}>{item.idestabelecimento.nome} ({item.idestabelecimento.tipo}-{item.idestabelecimento.subtipo})</Text>
                      <Text numberOfLines={1} style={styles.dadosTextSub}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                      {/* <Text style={styles.dadosTextRegras}>*Apresentar o cupom no estabelecimento*</Text> */}
                      <Text style={styles.dadosTextRegras}>*Válido até {item.validade.substring(8,10) + "/" + item.validade.substring(5,7) + "/" + item.validade.substring(0,4)}*</Text>
                      <TouchableHighlight style={styles.btnEntrar} onPress={handleCupom}>
                        <Text style={styles.textoEntrar}>Eu Quero !</Text>
                      </TouchableHighlight>
                    </View>

                  </View>
                </View>

              </View>

              
            )}  
          />
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
    flexDirection: 'row',
    flex: 1,
    backgroundColor:'#e5e5e5'
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

  menuItem:{
    flexDirection: 'row',
    width: screenWidth *0.93,
    height: isIphone5() ? screenHeight*0.35 : screenHeight*0.20,
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


  ticketText:{
    color:'#5d5d5d',
    marginTop:8,
    marginLeft:5,
    fontWeight:'bold',
    textAlign:"center",
    fontSize:16
  },

  dados:{
    width: screenWidth *0.90,
  },

  dadosText:{
    color:'#5d5d5d',
    marginLeft:10,
  },

  dadosTextSub:{
    color:'#5d5d5d',
    marginLeft:10,
    fontSize:12,
    marginBottom:15
  },

  dadosTextTitle:{
    color:'#5d5d5d',
    marginLeft:10,
    marginTop:10,
    fontWeight:'bold'
  },

  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:10,
    fontSize:10
  },

  containerGeral:{
    flexDirection:'row',
  },

  imgContainer:{
    width:screenWidth *0.2,
    marginTop:15
  },

  imagem:{
    width:screenWidth *0.18,
    height:screenWidth *0.18,
    borderRadius:5,
    borderColor:'#d3d3d3',
    borderWidth:3,
    marginLeft:5
  },

  txtContainer:{
    width:screenWidth *0.69,
  },

  btnEntrar:{
    width: screenWidth * 0.30,
    backgroundColor:'green',
    height:30,
    marginTop: 10,
    marginRight:8,
    borderRadius:6,
    alignSelf:'flex-end'
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:16,
    marginTop:5
  }

});