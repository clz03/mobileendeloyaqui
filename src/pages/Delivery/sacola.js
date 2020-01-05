import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function Sacola({ navigation }) {
 
  const [cardapio, setCardapio] = useState([]);  
  const [loading, setLoading] = useState(false);

  function aumentaqtdy(){
    if(qtdy < 10) setQtdy(qtdy + 1);
  };

  function diminuiqtdy(){
    if(qtdy > 1) setQtdy(qtdy - 1);
  };

  useEffect(() => {

  }, []);


  return (

    <View style={styles.container}>

      <ScrollView>

        <View>
          <Text>Entrega em:</Text>
          <Icon style={styles.iconeMoto} name='near-me' size={24} color='#817E9F' />
          <Text>Rua Chiara Lubich, 371</Text>
          <Text>Torre Figueira, AP 74 - Residencial Atmosphera</Text>
        </View>

        <View>
          <Text>Entrega Padrão</Text>
          <Text>50-60 minutos - R$3,00</Text>
          <TouchableOpacity><Text>Trocar</Text></TouchableOpacity>
        </View>

        <View>
          <Text>Danilo Picanha</Text>
          <View>
            <Text>Parmegiana de Frango</Text>
            <Text>R$39.90</Text>
            <Text>Mais ou Menos Botao</Text>
            <TouchableOpacity><Text>Adicionar mais itens</Text></TouchableOpacity>
          </View>

          <View>
            <Text>Subtotal: R$39.90</Text>
            <Text>Taxa entrega: R$3.00</Text>
            <Text>Total: R$42.90</Text>
          </View>

        </View>

        <View>
          <Text>Pague ao receber</Text>
          <Text>Dinheiro</Text>
          <Text>Cartão Débito/Crédito</Text>

          <TouchableOpacity><Text>Fazer Pedido</Text></TouchableOpacity>
          {/* Redirecionar para Status Pedidos */}
        </View>

      </ScrollView>

    </View>
  );
}


Sacola.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>{navigation.getParam('nomeestab')}</Text>
    ),
  }
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

  pedidoBottom:{
    flexDirection:'row',
    width: screenWidth,
    height: 45,
    backgroundColor:'#700353',
    position: 'absolute',
    bottom:0
  },

  pedidoBottomContentIcon:{
    width: (screenWidth - 0.1) /3,
    marginLeft: screenWidth * 0.05,
    marginTop:10,
    color:'#fff'
  },

  pedidoBottomContent:{
    width: (screenWidth - 0.1) /3,
    marginTop:13,
    color:'#fff'
  },

  Item: {
    height:65,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingTop: 10,
    paddingLeft: 10,
  },

  viewCardapio:{

  },

  ItemImg: {
    backgroundColor:'#fff',
    marginLeft: 8,
  },

  inputLogin:{
    height: 40,
    width:screenWidth * 0.90,
    marginLeft: screenWidth * 0.05,
    borderColor: '#471a88', 
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
  },

  labelLogin:{
    color:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginBottom:3,
  },

  textTitle: {
    fontSize:16,
    marginTop:10,
    fontWeight:'bold',
    color:'#12299B'
  },

  textDesc: {
    fontSize: 15,
    marginTop:10,
    marginLeft:8,
    marginRight:8
  },

  textAdicionar: {
    fontSize: 16,
    marginLeft:8,
    color:'#fff',
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

  containerMaisMenos:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#471a88',
    borderRadius:5,
    width:screenWidth*0.3,
    height:40,
    marginLeft: screenWidth * 0.05,
    marginTop:15
  },

  containerAdicionar:{
    backgroundColor:'#700353',
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#fff',
    borderRadius:5,
    width:screenWidth*0.575,
    height:40,
    marginLeft: screenWidth * 0.025,
    marginTop:15
  },

  containerGeral:{
    flexDirection:'row',
  },

  botaomais:{
    marginLeft:10,
    marginTop:8,
  },

  botaomenos:{
    marginLeft:10,
    marginRight:8,
    marginTop:8,
  },

  botaoadicionar:{
    marginLeft:10,
    marginTop:8,
    flexDirection:'row',
    width:'100%'
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

  textItem:{
    fontSize:18,
    marginLeft:screenWidth*0.05,
    marginTop:10,
    marginBottom:5
  },

  textItemDesc:{
    fontSize:12,
    marginLeft:screenWidth*0.055,
    color:'#595959'
  },

  textItemValor:{
    marginLeft:screenWidth*0.05,
    fontSize:16,
    fontWeight:'bold',
    marginBottom:20,
    marginTop:15,
    color:'#595959',
    borderColor: '#c3c3c3',
    borderBottomWidth: 1,
  },

  textDestaques:{
    fontSize:18,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.05,
    marginBottom:15,
    marginTop: 10
  },
})