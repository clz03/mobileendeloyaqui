import React,{ useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Deals() {

  const [prodpromo, setProdpromo] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);

    async function loadProdpromo() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/produtos'
      );

      const data = await response.json();
      setProdpromo(data);
      setLoading(false);
    }
    loadProdpromo();
  }, []);

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>

            <FlatList
              data={prodpromo}
              keyExtractor={prodpromo => String(prodpromo._id)}
              ListHeaderComponent={
                loading ? (
                  <ActivityIndicator size="large" style={styles.LoadingIndicator} />
                ) : (
                  ""
                )
              }
              renderItem={({ item }) => (

                <View style={styles.ItemImg}>
                <Text style={styles.textTitle}>{item.idestabelecimento.nome}</Text>
                  <View style={styles.containerGeral}>
                  
                    <View style={styles.txtContainer}>
                    <Text style={styles.textDesc}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                      <Text style={styles.textDesc}>{item.nome} - {item.preco}</Text>
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
    paddingHorizontal: 0
  },

  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor:'#fff'
  },

  containerGeral:{
    flexDirection:'row',
  },

  menuItem:{
    width: screenWidth *0.40,
    height: screenHeight*0.25
  },

  ItemImg: {
    height:110,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingTop: 10,
    paddingLeft: 10,

  },

  txtContainer:{
    width:screenWidth *0.7,
    marginTop:5
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



  textMenuTitle: {
    fontSize:16,
    paddingTop:5,
    paddingLeft:5,
    color: '#000',
    fontWeight:'bold',
    width: screenWidth *0.95,
  },

  textMenu: {
    fontSize:14,
    paddingTop:5,
    paddingLeft:5,
    color: '#000',
    width: screenWidth *0.95,
  },

  textMenuDestaq: {
    fontSize:20,
    paddingTop:20,
    paddingLeft:5,
    color: '#000',
    width: screenWidth *0.95,
    textAlign:'center'
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

});