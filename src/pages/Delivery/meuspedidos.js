import React, { useState, useEffect }  from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  TouchableOpacity,
  Image, 
  Dimensions, 
  FlatList, 
  ActivityIndicator, 
  TextInput,
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
  const [busca, setBusca] = useState('');   


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
        ListEmptyComponent={<Text style={styles.textEmpty}>Estamos aguardando seu primeiro pedido aqui =)</Text>}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('MeuPedidoDet', { idpedido: item._id, idestab: item.idestabelecimento }) }}>
            <View style={styles.ItemImg}>
        
              <View style={styles.containerGeral}>
                <View style={styles.txtContainer}>
                  <Text numberOfLines={1} style={styles.textTitle}>{item.idestabelecimento.nome}</Text>
                  <Text numberOfLines={1} style={styles.textDesc}>Data: {item.data.substring(8,10) + "/" + item.data.substring(5,7) + "/" + item.data.substring(0,4)}</Text>
                  <Text numberOfLines={1} style={styles.textDesc}>Status: {item.status}</Text>
                  <Text numberOfLines={1} style={styles.textDesc}>Valor: {item.total.toFixed(2)}</Text>
                </View>
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
    height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
    backgroundColor:'#fff',
    borderRadius:5,
    marginTop:8,
    marginLeft:8,
    marginRight:8
  },

  viewBadge: {
      width: screenWidth *0.6,
  },

  viewBadge2: {
    width: screenWidth *0.3,
    alignItems:"center",
    backgroundColor:"#fff",
    borderColor:'#004c00',
    borderWidth:1,
    borderRadius:8
  },

  textbutton: {
    fontSize:14,
    color:'#12299B',
    marginTop:4,
    marginLeft:3,
    fontWeight:'500',
  },

  textbuttonBack: {
    fontSize:16,
    color:'#fff'
  },

  buttonBack: {
    flexDirection: 'row',
    marginRight:10
  },


  textDescBadge: {
    fontSize: 10,
    paddingTop:1,
    color:'#004c00'
  },

  textTitle: {
    fontSize:14,
    fontWeight:'bold',
    color:'#12299B',
  },

  textEmpty: {
    fontSize:13,
    fontWeight:'bold',
    color:'#585858',
    marginLeft:screenWidth*0.025,
    marginTop:10
  },

  textDesc: {
    fontSize: 12,
    paddingTop:5
  },

  textDescAberto: {
    fontSize: 12,
    paddingTop:5,
    color:'green'
  },

  containerGeral:{
    flexDirection:'row',
  },

  imgContainer:{
    width:screenWidth *0.2,
    borderTopLeftRadius:5,
    borderBottomLeftRadius:10,
    overflow: "hidden"
  },

  containerBusca:{
    flexDirection: 'row',
  },

  containerPedidos:{
    flexDirection: 'row',
    marginTop:5,
    marginLeft: screenWidth * 0.025
  },

  buttonBusca:{
    marginTop:8,
    marginLeft:8,
  },

  imagem:{
    width:screenWidth *0.19,
    height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
  },

  txtContainer:{
    width:screenWidth *0.7,
    marginLeft: screenWidth*0.025,
    marginTop:5
  },


  txtPedido:{
    fontSize:17,
    fontWeight:'600',
    color:'#fff',
    marginHorizontal:16
  },

  inputLogin:{
    height: screenHeight*0.04,
    width:screenWidth * 0.85,
    marginLeft: 8,
    marginTop:5,
    backgroundColor:'#fff',
    borderColor: '#fff', 
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
  },
})