import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);
var paginafrom;
var idestab

export default function Pedido({ navigation }) {
 
  idestab = navigation.getParam('idestab');
  const nomeestab = navigation.getParam('nomeestab');
  paginafrom = navigation.getParam('pagina');

  const [cardapio, setCardapio] = useState([]);  
  const [categorias, setCategorias] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState(false);
  const [valortotal, setValortotal] = useState(0);

  async function loadCardapio() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/cardapios/estabelecimento/' + idestab
    );
    const data = await response.json();
    const categorias = data.map(data => data.categoria);
    let unique = [...new Set(categorias)]; 
    setCategorias(unique);
    setCardapio(data);
    setLoading(false)
  };

  async function CheckPedido(){
    setPedido(false);
    for (i = 1; i <= 15; i++) {
      nome = await AsyncStorage.getItem('eloyitem'+i);
      if (nome !== null){
        setPedido(true);
        CarregaPedido();
        break;
      }
    }
  };

  async function CarregaPedido(){
    var vlTotal = 0;
    var vlAcumulado = 0;

    for (i = 1; i <= 15; i++) {
      vlTotal = await AsyncStorage.getItem('eloyvalortotal'+i);

      if(vlTotal !== null){
        vlTotal = vlTotal.replace(/"/g,''),
        vlAcumulado = parseFloat(vlTotal) + parseFloat(vlAcumulado);
      };
    }
    setValortotal(vlAcumulado.toFixed(2));
  };

  handleOnNavigateBack = () => {
    CheckPedido();
  }

  useEffect(() => {
    navigation.setParams({ 
      categoria: nomeestab
    }); 
    setLoading(true);
    loadCardapio();
    CheckPedido();
  }, []);

  return (

    <View style={styles.container}>

      <View style={styles.tempoentrega}>
        <Icon style={styles.iconeMoto} name='motorcycle' size={24} color='#484848' />
        <Text style={styles.textoPreto}>Tempo médio de entrega: 50-60 minutos</Text>
      </View>

      <View style={styles.pedminimo}>
        <Text style={styles.textoCinza}>* Pedido mínimo R$15,00</Text>
        <Text></Text>
      </View>

      <FlatList
        data={categorias}
        keyExtractor={categorias => categorias}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (

          <View style={styles.viewCardapio}>
            <Text style={styles.textDestaques}>{item}</Text>

            {cardapio.map(cardapio => 
              <View key={cardapio._id}>

              {item === cardapio.categoria &&
                <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('itemPedido', { idcardapio: cardapio._id, idestab: idestab, nomeestab: nomeestab, onNavigateBack: handleOnNavigateBack }) }}>
                  <View style={styles.ItemImg2}>
                      <Text style={styles.textItem}>{cardapio.item}</Text>
                      <Text style={styles.textItemDesc}>Arroz, Feijão, Farofa, Batata</Text>
                      <Text style={styles.textItemValor}>R${cardapio.valor}</Text> 
                  </View>
                </TouchableHighlight>
              }

              </View>
            )}
               
          </View>
        )}            
      />

    {pedido &&
      <TouchableOpacity style={styles.pedidoBottom} onPress={() => { navigation.navigate('Sacola', { idestab: idestab, nomeestab: nomeestab, onNavigateBack: handleOnNavigateBack  }) }}>
        <Icon style={styles.pedidoBottomContentIcon} name='shopping-basket' size={24} color='#fff' />
        <Text style={styles.pedidoBottomContent}>Finalizar Pedido</Text>
        <Text style={styles.pedidoBottomContentRight}>R${valortotal}</Text>
      </TouchableOpacity>
    }

  

    </View>
  );
}

Pedido.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>{navigation.getParam('categoria')}</Text>
    ),
    // headerLeft: () => (
    //   <Icon name={'chevron-left'} size={24} color='#fff' onPress={ () => { paginafrom === 'detail' ? navigation.navigate('Detail', { idestab: idestab }) : navigation.goBack(null) } }  />
    // ),
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

  viewCardapio:{
    marginTop:5
  },

  ItemImg2: {
    borderWidth:1,
    borderColor: '#d3d3d3',
    width: screenWidth * 0.95,
    marginLeft: screenWidth * 0.025,
    marginBottom:8
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

  tempoentrega:{
    width: screenWidth*0.95,
    marginLeft: screenWidth*0.025,
    marginTop:5,
    borderWidth:1,
    borderColor:'#c3c3c3',
    borderRadius:5,
    alignItems:'center',
    flexDirection:'row',
    height:40
  },

  pedminimo:{
    marginLeft:screenWidth*0.025,
    marginRight:screenWidth*0.025,
    marginTop:5,
  },

  textoCinza:{
    fontSize:12,
    color:'gray',
  },

  textoPreto:{
    fontSize:12,
    color:'#484848',
    marginLeft: screenWidth * 0.025
  },

  iconeMoto:{
    marginLeft: screenWidth * 0.025
  },

  textItem:{
    marginLeft:screenWidth*0.025,
    marginTop:4
  },

  textItemDesc:{
    marginLeft:screenWidth*0.025,
    fontSize:11,
    color:'#595959'
  },

  textItemValor:{
    marginLeft:screenWidth*0.025,
    fontSize:13,
    fontWeight:'bold',
    marginBottom:5,
    marginTop:5,
    color:'#595959',
  },

  textDestaques:{
    fontSize:16,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginBottom:10,
    marginTop: 5
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
    fontSize:17,
    fontWeight:'600',
    color:'#fff',
    marginHorizontal:16
  },
})