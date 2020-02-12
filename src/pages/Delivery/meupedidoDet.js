import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect, disconnect, subscribeToStatusPed } from '../../services/socket';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function MeuPedidoDet({ navigation }) {
 
  const [rua, setRua] = useState('');  
  const [numero, setNumero] = useState('');  
  const [complemento, setComplemento] = useState('');  
  const [itens, setItens] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState('');
  const [seq, setSeq] = useState('');
  const [status, setStatus] = useState(1);
  const [tipoEntrega, setTipoEntrega] = useState('');
  const [dataPedido, setDataPedido] = useState('2020-01-01');
  const [previsao1, setPrevisao1] = useState('');
  const [previsao2, setPrevisao2] = useState('');
  const [valortotal, setValortotal] = useState(0);
  const [valortaxaE, setValortaxaE] = useState(0);
  const [valorGrandTotal, setValorGrandTotal] = useState(0);

  const idpedido = navigation.getParam('idpedido');
  const statusParam = parseInt(navigation.getParam('status'));
  const nomeestab = navigation.getParam('nomeestab');

  async function loadPedido() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/pedidos/' + idpedido
    );
    const data = await response.json();
    setStatus(data[0].status);
    setRua(data[0].rua);
    setNumero(data[0].numero);
    setComplemento(data[0].complemento);
    setSeq(data[0].seq);
    setTipoEntrega(data[0].tipoentrega);
    setDataPedido(data[0].data);
    setValortotal(data[0].subtotal);
    setValorGrandTotal(data[0].total);
    setValortaxaE(data[0].taxaentrega);
    setPedido(data);
    setLoading(false);
  };

  async function loadItensPedido() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/itenspedido/pedido/' + idpedido
    );
    const data = await response.json();
    setItens(data);
    setLoading(false);
  };

  async function setupWebsocket() {
    disconnect();
    const idusuario = await AsyncStorage.getItem('eloyuserid');
    connect(0, idusuario);
  }

  function calculaPrevisao(){
    let prev1 = new Date(dataPedido);
    let prev2 = new Date(dataPedido);

    if(tipoEntrega === 'E'){
      prev1.setMinutes(prev1.getMinutes()+60);
      prev2.setMinutes(prev2.getMinutes()+70);
    } else {
      prev1.setMinutes(prev1.getMinutes()+30);
      prev2.setMinutes(prev2.getMinutes()+40);
    }

    setPrevisao1(prev1.getUTCHours() + ':' + prev1.getMinutes());
    setPrevisao2(prev2.getUTCHours() + ':' + prev2.getMinutes());
  }

  useEffect(() => {
    setLoading(true);
    if(statusParam < 5) {
      setupWebsocket();
      subscribeToStatusPed(status => loadPedido());
    }
    loadPedido();
    loadItensPedido();
  }, []);

  useEffect(() => {
    calculaPrevisao()
  }, [pedido]);

  return (

    <View style={styles.container}>

      <ScrollView>

        <View style={styles.secao}>
          {
            loading && <ActivityIndicator size="small" style={styles.LoadingIndicator} />
          }
          
          <Text style={styles.textDestaques}>{nomeestab}</Text>
          <Text style={styles.textItemDesc}>Pedido: #{seq}</Text>
          <Text style={styles.textItemDesc}>Realizado às {dataPedido.substring(11,16)} - {dataPedido.substring(8,10) + "/" + dataPedido.substring(5,7) + "/" + dataPedido.substring(0,4)}</Text>
          {/* {statusArr.map((statusArr) =>
            statusArr.value == status && <Text key={statusArr.value} style={styles.textItemDesc}>{statusArr.label}</Text>
          )} */}

          {status < 6 &&
            <>
              { tipoEntrega === "E" &&
                <>
                  <Text style={styles.textItemDescPadding}>Previsão de entrega</Text>
                  <Text style={styles.textBold}>{previsao1} / {previsao2}</Text>
                </>
              }
              { tipoEntrega !== "E" &&
                <>
                  <Text style={styles.textItemDescPadding}>Previsão para retirada</Text>
                  <Text style={styles.textBold}>{previsao1} / {previsao2}</Text>
                </>
              }
            </>
          }
          <View style={styles.containerGeral}>
           
            <View style={styles.containerColumnStatus}>
              <Text style={styles.textDestaques}>Acompanhar Status</Text>

              { status > 0 &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  Pedido enviado ao estabelecimento&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' />
                </Text>
              }
              { status > 0 &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  Aguardando confirmação do estabelecimento&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' />
                </Text>
              }
              { status > 1 &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  O pedido foi confirmado&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' /> 
                </Text>
              }
              { status > 1 &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  O pedido está sendo preparado&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' />
                </Text>
              }
              { status > 3 && tipoEntrega === "E" &&
              <Text numberOfLines={1} style={styles.textItemDesc}>
                O pedido saiu para entrega&nbsp;
                <Icon style={styles.icone} name='check-circle' size={12} color='green' />
              </Text>
              }
              { status > 3 && tipoEntrega !== "E" &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  O pedido está pronto para retirada&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' />
                </Text>
              }
              { status > 6 && tipoEntrega === "E" &&
              <Text numberOfLines={1} style={styles.textItemDesc}>
                O pedido foi entregue&nbsp;
                <Icon style={styles.icone} name='check-circle' size={12} color='green' />
              </Text>
              }
              { status > 6 && tipoEntrega !== "E" &&
                <Text numberOfLines={1} style={styles.textItemDesc}>
                  O pedido foi recebido pelo cliente&nbsp;
                  <Icon style={styles.icone} name='check-circle' size={12} color='green' />
                </Text>
              }
              { status === 6 && 
              <Text numberOfLines={1} style={styles.textItemDesc}>
                O pedido foi cancelado&nbsp;
                <Icon style={styles.icone} name='check-circle' size={12} color='green' />
              </Text>
              }

            </View>
          </View>
        </View>
        
        { tipoEntrega === "E" &&

          <View style={styles.secao}>
            <Text style={styles.textDestaques}>Endereço de entrega</Text>
            <View style={styles.containerGeral}>
              <Icon style={styles.icone} name='near-me' size={24} color='#817E9F' />
              <View style={styles.containerColumnComplemento}>
                <Text numberOfLines={1} style={styles.textDesc}>{rua}, {numero}</Text>
                <Text numberOfLines={1} style={styles.textItemDesc}>{complemento}</Text>
              </View>
            </View>
          </View>

        }

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>Detalhe do pedido</Text>


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


            {itens.map(item => 
              <View key={item._id}>

                <View style={styles.buttonContainer}>
                  <View style={styles.containerColumn}>
                    <Text style={styles.textDestaquesCardapio}>{item.qtde}x {item.item}</Text>
                    <Text style={styles.textDesc}>R${item.valortotal}</Text>
                    {item.obs.length > 2 &&
                      <Text style={styles.textItemDesc}>Obs: {item.obs}</Text>
                    }
                  </View>
                </View>
              </View>
            )}

          
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

// Status.navigationOptions = ({ navigation }) => {
//   return {
//     headerLeft: () => (
//       <TouchableOpacity onPress={() => navigation.navigate("Delivery")} style={styles.buttonBack}>
//         <Icon name='chevron-left' size={24} color='#fff' />
//         <Text style={styles.textbuttonBack}>Voltar</Text>
//       </TouchableOpacity>
//     ),
//   }
// }


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
    marginTop: 5
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

  textItemDescPadding:{
    fontSize:12,
    marginLeft:screenWidth*0.025,
    marginTop:10,
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
    marginBottom:5,
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
    marginTop: 5,
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