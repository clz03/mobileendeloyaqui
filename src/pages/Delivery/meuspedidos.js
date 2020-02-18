import React, { useState, useEffect }  from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  TouchableOpacity,
  Dimensions, 
  FlatList, 
  ActivityIndicator, 
  Platform,
  AsyncStorage } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphoneX() {
  return (
    Platform.OS === 'ios' && screenHeight >= 812
  );
}

export function isAndroid() {
  return (
    Platform.OS !== 'ios'
  );
}

export default function MeusPedidos({ navigation }) {
   
  const [estab, setEstab] = useState([]);   
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusArr = [
    { label: "Pedido enviado ao restaurante", value: "1" },
    { label: "Pedido em preparação e sairá para entrega em breve", value: "2" },
    { label: "Pedido em preparação e estará pronto para retirada em breve", value: "3" },
    { label: "Pedido saiu para entrega", value: "4" },
    { label: "Pedido pronto para ser retirado", value: "5" },
    { label: "Pedido cancelado", value: "6" },
    { label: "Pedido entregue", value: "7" }
  ];

  async function loadPage(pageNumber = page, shouldRefresh = false) {

    const iduser = await AsyncStorage.getItem('eloyuserid');
    if(iduser === null){
      setLoading(false);
      return;
    }
    if(totalCount && pageNumber > totalCount) return;

    const query = 'https://backendeloyaqui.herokuapp.com/pedidos/usuario/' + iduser + `?page=${pageNumber}`;
    const response = await fetch(
      query
    );

    const data = await response.json();
    setEstab(shouldRefresh ? data.result : [...estab, ...data.result]);
    setTotalCount(Math.ceil(data.totalRecords / 10));
    setPage(pageNumber + 1)
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
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
        data={estab}
        keyExtractor={estab => String(estab._id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListEmptyComponent={<><Text style={styles.textEmpty}>Estamos anciosos pelo seu primeiro pedido conosco !</Text><Icon style={styles.iconCenter} name='mood' size={48} color='#484848' /></>}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('MeuPedidoDet', { idpedido: item._id, nomeestab: item.idestabelecimento.nome, status: item.status }) }}>
            
            <View style={styles.ItemImg}>
                <View style={styles.txtContainer}>
                  <Text style={styles.textPrinc}>{item.idestabelecimento.nome}</Text>
                  <Text style={styles.textDescBold}>Data/Hora: <Text style={styles.textDesc}>{item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4) + ' - ' + item.data.substring(11,16)}</Text></Text>
                  <Text numberOfLines={1} style={styles.textDescBold}>Pedido: <Text style={styles.textDesc}>#{item.seq}</Text></Text>
                  {statusArr.map((statusArr) =>
                    statusArr.value === item.status && <Text key={statusArr.value} numberOfLines={1} style={styles.textDescBold}>Status: <Text style={styles.textDesc}>{statusArr.label}</Text></Text>
                  )}
                
                     {item.status < 5 &&
                    <Text style={styles.textoAdicionar}>Acompanhar pedido</Text>
                    }
                  
                </View>
            </View>

          </TouchableHighlight>
        )}            
      />
    </View>
  );
}

// Delivery.navigationOptions = ({ navigation }) => {
//   return {
//     headerRight: () => (
//       <TouchableOpacity onPress={() => navigation.navigate("Status")} style={styles.buttonBack}>
//         <Icon name='sync' size={24} color='#fff' />
//         <Text style={styles.textbuttonBack}>Pedidos</Text>
//       </TouchableOpacity>
//     ),
//   }
// }

MeusPedidos.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Delivery")} style={styles.buttonBack}>
        { /* variar android aqui */ }
        <Icon name='chevron-left' size={24} color='#fff' />
        {Platform.OS === 'ios' &&
          <Text style={styles.textbuttonBack}>Voltar</Text>
        }
      </TouchableOpacity>
    ),
  }
}

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor:'#e5e5e5'
  },

  containerBadge: {
    width:screenWidth,
    flexDirection: "row"
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

  ItemImg: {
    backgroundColor:'#fff',
    borderRadius:5,
    marginTop:5,
    marginLeft:8,
    marginRight:8,
    marginBottom:5,
    paddingBottom:8
  },

  textTitle: {
    fontSize:14,
    fontWeight:'bold',
    color:'#12299B',
  },

  textEmpty: {
    fontSize:14,
    fontWeight:'300',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop:10,
    textAlign:'center'
  },

  textDesc: {
    fontSize: 13,
    paddingTop:2,
    fontWeight:'300'
  },

  textDescBold: {
    fontSize: 13,
    paddingTop:2,
    fontWeight:'600'
  },

  textPrinc: {
    fontSize: 14,
    fontWeight:'600',
    marginBottom:5,
    marginTop:5
  },

  containerGeral:{
    flexDirection:'row',
  },

  imgContainer:{
    marginTop:8,
    marginLeft:8,
    width:screenWidth *0.8,
    height: screenWidth *0.1,
  },

  imagem:{
    width:screenWidth *0.1,
    height: screenWidth *0.1
  },

  txtContainer:{
    marginLeft: screenWidth*0.025,
    marginTop:2
  },

  btnAdicionar:{
    width: screenWidth * 0.80,

    borderRadius:6,
  },

  textoAdicionar:{
    color:'darkgreen',
    fontSize:16,
    marginTop: 5,
  },

  buttonBack: {
    flexDirection: 'row'
  },

  textbuttonBack: {
    fontSize:18,
    color:'#fff'
  },

  iconCenter:{
    marginTop:10,
    textAlign:'center'
  }

})