import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, FlatList, ActivityIndicator } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function Pedido({ navigation }) {
 
  const idestab = navigation.getParam('idestab');
  const nomeestab = navigation.getParam('nomeestab');

  const [cardapio, setCardapio] = useState([]);  
  const [loading, setLoading] = useState(false);

  async function loadCardapio() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/cardapios/estabelecimento/' + idestab
    );

    const data = await response.json();
    setCardapio(data);
    setLoading(false)
};

  useEffect(() => {
    navigation.setParams({ 
      nomeestab: nomeestab
    }); 
    setLoading(true)
    loadCardapio();
  }, []);

  return (

    <View style={styles.container}>
      <FlatList
        data={cardapio}
        keyExtractor={cardapio => String(cardapio._id)}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (

            <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('itemPedido', { idcardapio: item._id }) }}>
                <View style={styles.ItemImg} key={item._id}>
                    <View style={styles.containerGeral}>
                    <View style={styles.txtContainer}>
                    <Text style={styles.textDestaques}>{item.categoria}</Text>
                        <Text style={styles.textCardapio}>{item.item} - R${item.valor}</Text>
                    </View>
                    </View>
                </View>
            </TouchableHighlight>
          
        )}            
      />
    </View>
  );
}

Pedido.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>{navigation.getParam('nomeestab')}</Text>
    ),
  }
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

  ItemImg: {
    backgroundColor:'#fff',
    marginLeft: 8,
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