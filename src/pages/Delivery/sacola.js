import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function Sacola({ navigation }) {
 
  const [cardapio, setCardapio] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("E");
  const [tipoPag, setTipoPag] = useState("D"); // D=Debito - C=Credito - E=Especie

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

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>Entrega ou Retirada</Text>
          
          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Entrega</Text>
              <Text style={styles.textDesc}>50-60 minutos</Text>
              <Text style={styles.textItemDesc}>R$3,00</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoEntrega("E")}
            >
              { tipoEntrega === "E" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Retirada</Text>
              <Text style={styles.textDesc}>20-30 minutos</Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>Av. Benedito Castilho de Andrade, 368</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoEntrega("R")}
            >
              { tipoEntrega === "R" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

        </View>

        { tipoEntrega === "E" && (

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>Entregar em</Text>
          <View style={styles.containerGeral}>
            <Icon style={styles.icone} name='near-me' size={24} color='#817E9F' />
            <View style={styles.containerColumnComplemento}>
              <Text numberOfLines={1} style={styles.textDesc}>Rua Chiara Lubich, 371</Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>Torre Figueira, AP 74 - Residencial Atmospheraasd</Text>
            </View>
          </View>
        </View>

        )}

        <View style={styles.secao}>
          <Text style={styles.textDestaquesValores}>O que será preparado</Text>

          <View>
            <Text style={styles.textDestaquesCardapio}>Parmegiana de Frango</Text>
            <Text style={styles.textDesc}>R$39.90</Text>
            <Text style={styles.textItemDesc}>Obs: Sem cebola</Text>
          </View>

          <View>
            <Text style={styles.textDestaquesCardapio}>Parmegiana de Carne</Text>
            <Text style={styles.textDesc}>R$39.90</Text>
          </View>

          <View>
          <TouchableOpacity style={styles.btnAdicionar} onPress={() => { navigation.goBack(null) }}>
            <Text style={styles.textoAdicionar}>Adicionar mais itens</Text>
          </TouchableOpacity>
          </View>



          <View style={styles.buttonContainerPag}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>SubTotal:</Text>
            </View>
            <Text>R$39,90</Text>
          </View>

          <View style={styles.buttonContainerPag}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Taxa Entrega:</Text>
            </View>
            <Text>R$3,00</Text>
          </View>

          <View style={styles.buttonContainerPag}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDescBold}>Total:</Text>
            </View>
            <Text style={styles.valorDireita}>R$42,90</Text>
          </View>


          

        </View>

        <View style={styles.secaoLast}>
          <Text style={styles.textDestaques}>Pagamento</Text>
          {/* <Text style={styles.textItemDesc}>*Pague no recebimento</Text> */}

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Cartão Débito/Crédito</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoPag("D")}
            >
              { tipoPag === "D" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Dinheiro</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoPag("E")}
            >
              { tipoPag === "E" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnEntrar}>
            <Text style={styles.textoEntrar}>Fazer Pedido</Text>
          </TouchableOpacity>
          
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
    backgroundColor:'#ededed'
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

  icone:{
    marginLeft: screenWidth * 0.025,
    marginBottom:20
  },

  secao:{
    backgroundColor:'#fff',
    width: screenWidth * 0.95,
    marginTop:5,
    marginLeft: screenWidth * 0.025,
    borderWidth:1,
    borderColor:'#d3d3d3',
    borderRadius:5
  },

  secaoLast:{
    backgroundColor:'#fff',
    width: screenWidth * 0.95,
    marginTop:5,
    marginBottom:20,
    marginLeft: screenWidth * 0.025,
    borderWidth:1,
    borderColor:'#d3d3d3',
    borderRadius:5
  },

  valores:{
    flexDirection:'column',
    backgroundColor:'#d3d3d3',
    marginTop:10,
    marginLeft: screenWidth * 0.025,
    marginBottom:10
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
    marginLeft: screenWidth * 0.025
  },

  textDescBold: {
    fontSize: 15,
    marginLeft: screenWidth * 0.025,
    fontWeight:'bold'
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

  containerColumn:{
    flexDirection:'column',
    marginLeft: screenWidth * 0.025,
  },
  
  containerColumnComplemento:{
    flexDirection:'column',
    marginLeft: screenWidth * 0.025,
    marginRight:35
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
    marginLeft:screenWidth*0.025,
    color:'#595959'
  },

  textItemSubValor:{
    fontSize:15,
    color:'#808080',
    marginBottom:3
  },

  textItemSubValorRight:{
    fontSize:15,
    color:'#808080',
    marginBottom:3,
    textAlign: 'right'
  },

  viewDireita:{
    flexDirection:'row',
    width:'50%',
    alignItems:'flex-end',
  },

  viewEsquerda:{
    flexDirection:'row',
    width:'50%',
    alignItems:'flex-start',
  },

  textItemValor:{
    fontSize:16,
    fontWeight:'bold',
    color:'#595959',
  },

  textDestaques:{
    fontSize:16,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginBottom:10,
    marginTop: 10
  },

  textDestaquesValores:{
    fontSize:16,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop: 10
  },

  textDestaquesCardapio:{
    fontSize:15,
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop: 10,
  },

  buttonContainerPag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginRight:15
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginRight:30
  },

  circle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ACACAC',
      alignItems: 'center',
      justifyContent: 'center',
  },

  checkedCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#794F9B',
  },

  valorDireita: {
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:'bold'
},

  btnAdicionar:{
    width: screenWidth * 0.80,
    height:35,
    marginLeft: screenWidth * 0.08,
    marginTop: 15,
    marginBottom:10,
    borderRadius:6,
  },

  textoAdicionar:{
    color:'#471a88',
    textAlign:'center',
    fontSize:16,
    marginTop:5
  },

  btnEntrar:{
    width: screenWidth * 0.80,
    backgroundColor:'#471a88',
    height:35,
    marginLeft: screenWidth * 0.08,
    marginTop: 15,
    marginBottom:10,
    borderRadius:6,
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  },

})