import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function NewsDetail({ navigation }) {
 
  const noticia_id = navigation.getParam('id');
  const [noticia, setNoticia] = useState([]);  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadNoticia() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/noticias/' + noticia_id
      );

      const data = await response.json();
      setNoticia(data);
      setLoading(false)
    }
    setLoading(true)
    loadNoticia();
  }, []);

  return (

    <View style={styles.container}>
      <FlatList
        data={noticia}
        keyExtractor={noticia => String(noticia._id)}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          
            <View style={styles.ItemImg}>
            <Text style={styles.textTitle}>{item.titulo}</Text>
              <View style={styles.containerGeral}>
                
                <View style={styles.txtContainer}>
                  <Text style={styles.textDesc}>{item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4)}</Text>
                  <View style={styles.imgContainer}>
                    <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
                  </View>
                  <Text style={styles.textDescNoticia}>{item.descr}</Text>
                </View>
              </View>
            </View>
          
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

  textDescNoticia: {
    fontSize: 14,
    paddingTop:5,
    marginRight:5,
    justifyContent:'center'
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
    width:screenWidth *0.95,
    height:screenWidth *0.25,
    borderRadius:5,
    borderColor:'#d3d3d3',
    borderWidth:3
  },

  txtContainer:{
    width:screenWidth *0.97,
    marginTop:5,
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