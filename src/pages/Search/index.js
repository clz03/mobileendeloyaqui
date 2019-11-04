import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphone5() {
  return (
    Platform.OS === 'ios' && screenWidth == 320
  );
};

export default function Search({ navigation }) {
 
  const cat_id = navigation.getParam('cat_id');
  const cat_nome = navigation.getParam('title');
  const busca = navigation.getParam('busca');

  const [estab, setEstab] = useState([]);   
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    
    if(totalCount && pageNumber > totalCount) return;

    const query = (busca == undefined ? 'https://backendeloyaqui.herokuapp.com/estabelecimentos/categoria/' + cat_id + `?page=${pageNumber}` : 'https://backendeloyaqui.herokuapp.com/estabelecimentos/busca/' + busca + `?page=${pageNumber}`);
    const response = await fetch(
      query
    );

    const data = await response.json();
    setEstab(shouldRefresh ? data.result : [...estab, ...data.result]);
    setTotalCount(Math.ceil(data.totalRecords / 10));
    setPage(pageNumber + 1)
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  return (

    <View style={styles.container}>
      <FlatList
        data={estab}
        keyExtractor={estab => String(estab._id)}
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
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('Detail', { idestab: item._id }) }}>
            <View style={styles.ItemImg}>
            <Text style={styles.textTitle}>{item.nome}</Text>
              <View style={styles.containerGeral}>
                <View style={styles.imgContainer}>
                  <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
                </View>
                <View style={styles.txtContainer}>
                  <Text style={styles.textDesc}>{item.tipo} / {item.subtipo}</Text>
                  <Text style={styles.textDesc}>{item.rua}, {item.numero}</Text>
                  <Text style={styles.textDescAberto}>Aberto agora</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        )}            
      />
    </View>
  );
}

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

  Item: {
    height:65,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingTop: 10,
    paddingLeft: 10,

  },

  ItemImg: {
    height:110,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingTop: 10,
    paddingLeft: 10,

  },

  textTitle: {
    fontSize:14,
    fontWeight:'bold',
    color:'#12299B'
  },

  textDesc: {
    fontSize: 12,
    paddingTop:5
  },

  textDescAberto: {
    fontSize: 12,
    paddingTop:5,
    color:'green'
  },

  textDescFechado: {
    fontSize: 12,
    paddingTop:5,
    color:'red'
  },

  containerGeral:{
    flexDirection:'row',
  },

  imgContainer:{
    width:screenWidth *0.2,
    marginTop:5
  },

  imagem:{
    width:screenWidth *0.19,
    height:screenWidth *0.19,
    borderRadius:5,
    borderColor:'#d3d3d3',
    borderWidth:3
  },

  txtContainer:{
    width:screenWidth *0.7,
    marginTop:5
  },

  viewPedido:{
    backgroundColor:'green',
    width:screenWidth *0.23,
    height:15,
    borderRadius:5,
    alignItems:'center'
  },

  viewTitle:{
    width:screenWidth *0.73,
  },

  txtPedido:{
    color:'#fff',
    fontSize:10,
    fontWeight:'bold'
  },
})