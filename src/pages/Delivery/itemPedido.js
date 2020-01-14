import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function ItemPedido({ navigation }) {
 
  const idcardapio = navigation.getParam('idcardapio');
  const idestab = navigation.getParam('idestab');
  const nomeestab = navigation.getParam('nomeestab');

  const [cardapio, setCardapio] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState(false);
  const [obs, setObs] = useState('');
  const [qtdy, setQtdy] = useState(1);
  const [valorun, setValorun] = useState(0);
  const [valortotal, setValortotal] = useState(0);
  const [valorPedido, setValorPedido] = useState(0);

  async function loadCardapio() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/cardapios/' + idcardapio
    );

    const data = await response.json();
    const valor = parseFloat((data[0].valor.replace(',','.')));
    setCardapio(data);
    setValorun(valor);
    setValortotal((valor).toFixed(2));
    setLoading(false)
  };

  function aumentaqtdy(){
    if(qtdy < 10) setQtdy(qtdy + 1);
  };

  function diminuiqtdy(){
    if(qtdy > 1) setQtdy(qtdy - 1);
  };

  async function Limpapedido(){
    for (i = 1; i <= 20; i++) {
      await AsyncStorage.removeItem('eloypedido');
      await AsyncStorage.removeItem('eloyitem'+i);
      await AsyncStorage.removeItem('eloyqtdy'+i);
      await AsyncStorage.removeItem('eloyvalorun'+i);
      await AsyncStorage.removeItem('eloyvalortotal'+i);
    }
    navigation.state.params.onNavigateBack();
    navigation.goBack(null);
  }

  async function adicionaItem(itemcardapio){
    var i;
    var item;

    for (i = 1; i <= 20; i++) {
      item = await AsyncStorage.getItem('eloyitem'+i);
      if (item === null){
        await AsyncStorage.setItem('eloyitem'+i, JSON.stringify(itemcardapio));
        await AsyncStorage.setItem('eloyqtdy'+i, JSON.stringify(qtdy));
        await AsyncStorage.setItem('eloyitemobs'+i, JSON.stringify(obs));
        await AsyncStorage.setItem('eloyvalortotal'+i, JSON.stringify(valortotal));
        break;
      }
    }  
    await AsyncStorage.setItem('eloypedido', JSON.stringify(i));

    setPedido(true);
    navigation.state.params.onNavigateBack();
    navigation.goBack(null);
  };

  async function CarregaPedido(){
    var vlTotal = 0;
    var vlAcumulado = 0;

    for (i = 1; i <= 20; i++) {
      vlTotal = await AsyncStorage.getItem('eloyvalortotal'+i);

      if(vlTotal != null){
        vlTotal = vlTotal.replace('"','');
        vlTotal = vlTotal.replace('"','');
        vlAcumulado = parseFloat(vlTotal) + parseFloat(vlAcumulado);
      };
    }
    setValorPedido(vlAcumulado.toFixed(2));
  };


async function CheckPedido(){
  if (await AsyncStorage.getItem('eloyitem1') != null){
    setPedido(true);
    CarregaPedido();
  }
  else
    setPedido(false);
  }

  useEffect(() => {
    navigation.setParams({ 
      categoria: nomeestab
    }); 
    setLoading(true);
    CheckPedido();
    loadCardapio();
  }, []);

  useEffect(() => {
    setValortotal((valorun * qtdy).toFixed(2));
  }, [qtdy]);

  return (

    <View style={styles.container}>

      {cardapio.map(cardapio => 
        <ScrollView key={cardapio._id}>

          <View style={styles.viewCardapio}>
            {/* <Text style={styles.textDestaques}>{cardapio.categoria}</Text> */}

            <View style={styles.ItemImg2}>
              <Text style={styles.textItem}>{cardapio.item}</Text>
              <Text style={styles.textItemDesc}>Arroz, Feijão, Farofa, Batata</Text>
              <Text style={styles.textItemValor}>R${cardapio.valor}</Text> 
            </View>

            <Text style={styles.labelLogin}>Alguma observação ?</Text>
            <TextInput 
              style={ styles.inputLogin } 
              autoCorrect={true}
              maxLength={50}
              placeholder="ex: sem cebola"
              value={obs}
              onChangeText={(text) => setObs(text)}
            />
            <View style={styles.containerGeral}>
              <View style={styles.containerMaisMenos}>

                <TouchableOpacity onPress ={() => diminuiqtdy()} style={styles.botaomenos}>
                  <Icon style={styles.iconeMoto} name='remove' size={24} color='#817E9F' />
                </TouchableOpacity>

                <Text style={styles.textDesc}>{qtdy}</Text>

                <TouchableOpacity onPress ={() => aumentaqtdy()} style={styles.botaomais}>
                  <Icon style={styles.iconeMoto} name='add' size={24} color='#817E9F' />
                </TouchableOpacity>
            
              </View>

              <View style={styles.containerAdicionar}>

                <TouchableOpacity style={styles.botaoadicionar} onPress={() => adicionaItem(cardapio.item)}>
                  <Icon style={styles.iconeMoto} name='shopping-basket' size={24} color='#fff' />
                  <Text style={styles.textAdicionar}>Adicionar - R${valortotal}</Text>
                </TouchableOpacity>
              </View>

              </View>
              <TouchableOpacity style={styles.botaoadicionar} onPress={() => Limpapedido()}>
                  <Text>Limpar</Text>
                </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    
    {pedido &&
      <TouchableOpacity style={styles.pedidoBottom} onPress={() => { navigation.navigate('Sacola', { idestab: idestab, nomeestab: nomeestab }) }}>
        <Icon style={styles.pedidoBottomContentIcon} name='shopping-basket' size={24} color='#fff' />
        <Text style={styles.pedidoBottomContent}>Finalizar Pedido</Text>
        <Text style={styles.pedidoBottomContentRight}>R${valorPedido}</Text>
      </TouchableOpacity>
    }
    </View>
  );
}

ItemPedido.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>{navigation.getParam('categoria')}</Text>
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
    backgroundColor:'#794F9B',
    position: 'absolute',
    bottom:0
  },

  pedidoBottomContentIcon:{
    width: (screenWidth) /4,
    marginLeft: screenWidth * 0.05,
    marginTop:10,
    color:'#fff'
  },

  pedidoBottomContent:{
    width: (screenWidth) /3,
    marginTop:13,
    textAlign:'center',
    color:'#fff'
  },

  pedidoBottomContentRight:{
    width: (screenWidth) /3,
    marginTop:13,
    marginRight:10,
    textAlign:'right',
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
    fontSize: 14,   
    marginLeft:8,
    marginTop:2,
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
    backgroundColor:'#794F9B',
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

  txtPedido:{
    fontSize:17,
    fontWeight:'600',
    color:'#fff',
    marginHorizontal:16
  },
})