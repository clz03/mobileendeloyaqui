import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect, disconnect, subscribeToStatusPed } from '../../services/socket';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function Status({ navigation }) {
 
  const idusuario = AsyncStorage.getItem('eloyuserid');

  const [estab, setEstab] = useState([]);
  const [endereco, setEndereco] = useState([]);  
  const [itens, setItens] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("E");
  const [valortotal, setValortotal] = useState(0);
  const [valortaxaE, setValortaxaE] = useState(0);
  const [valorGrandTotal, setValorGrandTotal] = useState(0);
  const [tipoPag, setTipoPag] = useState("D"); // D=Debito - C=Credito - E=Especie

  async function loadPedido(){
    window.alert('pedido atualizado pelo restaurante');
    setLoading(false);
  }

  function setupWebsocket(idusuario) {
    disconnect();
    connect(0, idusuario);
  }

  useEffect(() => {
    setLoading(true);
    setupWebsocket(idusuario);
    subscribeToStatusPed(status => loadPedido());
  }, []);

  return (

    <View style={styles.container}>

      <ScrollView>

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>Status do pedido</Text>
          <Text style={styles.textItemDesc}>Previsão de entrega</Text>
          <Text style={styles.textBold}>12:50 / 13:00</Text>
          <View style={styles.containerGeral}>
            {
              loading && <ActivityIndicator size="small" style={styles.LoadingIndicator} />
            }
            <View style={styles.containerColumnStatus}>
              <Text numberOfLines={1} style={styles.textItemDesc}>Pedido enviado ao estabelecimento <Icon style={styles.icone} name='check-circle' size={12} color='green' /></Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>Aguardando confirmação do estabelecimento</Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>O pedido foi confirmado <Icon style={styles.icone} name='check-circle' size={12} color='green' /> </Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>O pedido está sendo preparado</Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>O pedido saiu para entrega</Text>
            </View>
          </View>
        </View>
        
        { tipoEntrega === "E" && (

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>Endereço de entrega</Text>
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
          <Text style={styles.textDestaques}>Detalhe do pedido</Text>

          <View style={styles.containerGeral}>
            <View style={styles.containerColumnComplemento}>
              <Text numberOfLines={1} style={styles.textDesc}>Danilo Picanha</Text>
            </View>
          </View>

          {/* {itens.map(item => 
              <View key={item.id}>

                <View>
                  <Text style={styles.textDestaquesCardapio}>{item.qtdy}x {item.item}</Text>
                  <Text style={styles.textDesc}>R${item.valortotal}</Text>
                  {item.obs.length > 2 &&
                  <Text style={styles.textItemDesc}>Obs: {item.obs}</Text>
                  }
                  <TouchableOpacity onPress={() => RemoveItemPedido(item.id)}><Text>Remover</Text></TouchableOpacity>
                </View>

              </View>
            )} */}


          
          { tipoEntrega == "E" &&
            <>
              <View style={styles.buttonContainerPag}>
                <View style={styles.containerColumn}>
                  <Text style={styles.textDesc}>SubTotal:</Text>
                </View>
                <Text>R${valortotal.toFixed(2)}</Text>
              </View>

              <View style={styles.buttonContainerPag}>
                <View style={styles.containerColumn}>
                  <Text style={styles.textDesc}>Taxa Entrega:</Text>
                </View>
                <Text>R${valortaxaE.toFixed(2)}</Text>
              </View>
            </>
          }

          <View style={styles.buttonContainerPag}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDescBold}>Total:</Text>
            </View>
            <Text style={styles.valorDireita}>R${valorGrandTotal.toFixed(2)}</Text>
          </View>


          

        </View>

        <View style={styles.secaoLast}>
          <Text style={styles.textDestaques}>Pagamento</Text>
          <Text style={styles.textItemDescMargin}>Cartão Débito/Crédito (Máquina)</Text>
        </View>

      </ScrollView>

    </View>
  );
}

Status.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Delivery")} style={styles.buttonBack}>
        <Icon name='chevron-left' size={24} color='#fff' />
        <Text style={styles.textbuttonBack}>Voltar</Text>
      </TouchableOpacity>
    ),
  }
}


var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor:'#ededed'
  },

  LoadingIndicator:{
    marginLeft:screenWidth * 0.025
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

  bordas:{
    borderBottomWidth:1,
    borderTopWidth:1,
    borderColor:'#d3d3d3',
    marginTop:10,
    marginBottom:10,
    marginLeft:15,
    marginRight:15
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

  textbuttonBack: {
    fontSize:18,
    color:'#fff'
  },

  buttonBack: {
    flexDirection: 'row'
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

  textBold: {
    fontSize: 18,
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
  },
  
  containerColumnComplemento:{
    flexDirection:'column',
    marginRight:35,
    marginBottom:10
  },

  containerColumnStatus:{
    flexDirection:'column',
    marginRight:35,
    marginBottom:15,
    marginTop: 15
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

  textItemDescMargin:{
    fontSize:12,
    marginLeft:screenWidth*0.025,
    color:'#595959',
    marginBottom:15
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
    marginLeft: screenWidth * 0.08,
    marginTop: 5,
    marginBottom:5,
    borderRadius:6,
  },

  textoAdicionar:{
    color:'#471a88',
    textAlign:'center',
    fontSize:16,
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

  txtPedido:{
    fontSize:17,
    fontWeight:'600',
    color:'#fff',
    marginHorizontal:16
  },

})