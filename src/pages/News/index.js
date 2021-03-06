import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, FlatList, ActivityIndicator, Image, Platform } from 'react-native';

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

export default function Search({ navigation }) {

  const [noticia, setNoticia] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false){
 
    if(totalCount && pageNumber > totalCount) return;
 
    const response = await fetch(
      `https://backendeloyaqui.herokuapp.com/noticias?page=${pageNumber}` 
    );

    const data = await response.json();
    setNoticia(shouldRefresh ? data.result : [...noticia, ...data.result]);
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

  return (

    <View style={styles.container}>
    <FlatList
      data={noticia}
      keyExtractor={noticia => String(noticia._id)}
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
        <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('NewsDetail', { id: item._id }) }}>

          <View style={styles.ItemImg}>
            <View style={styles.containerGeral}>
              <View style={styles.imgContainer}>
                <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
              </View>
              <View style={styles.txtContainer}>
                <Text style={styles.textTitle} numberOfLines={2}>{item.titulo}</Text>
                <Text style={styles.textDesc}>{item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4)}</Text>
                <Text style={styles.textDesc} numberOfLines={2} >{item.descr}</Text>
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
  backgroundColor:'#e5e5e5'
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

// ItemImg: {
//   height: isIphoneX() ? screenHeight*0.125 : isAndroid() ? screenHeight*0.175 : screenHeight*0.155,
//   backgroundColor:'#fff',
//   borderBottomColor:'#d5d5d5',
//   borderBottomWidth:1,
//   marginTop:8,
//   marginLeft:10,
// },

ItemImg: {
  //height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
  //paddingTop:1,
  //paddingBottom:1,
  backgroundColor:'#fff',
  borderRadius:5,
  marginTop:5,
  marginBottom:4,
  marginLeft:screenWidth*0.025,
  marginRight:screenWidth*0.025,
},

imgContainer:{
  width:screenWidth *0.2,
  borderTopLeftRadius:5,
  borderBottomLeftRadius:10,
  overflow: "hidden"
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

// imgContainer:{
//   width:screenWidth *0.2,
//   marginTop:5,
// },

// imagem:{
//   width:screenWidth *0.19,
//   height:screenWidth *0.19,
//   borderRadius:5,
//   borderColor:'#d3d3d3',
//   borderWidth:3,
// },

imagem:{
  width:screenWidth *0.19,
  height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
},

txtContainer:{
  width:screenWidth *0.7,
  marginTop:3
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