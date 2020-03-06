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
  Platform } from 'react-native';

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

export default function Delivery({ navigation }) {
   
  const [estab, setEstab] = useState([]);   
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState('');   

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    
    if(totalCount && pageNumber > totalCount) return;

    const query = 'https://backendeloyaqui.herokuapp.com/estabelecimentos/com/delivery/' + `?page=${pageNumber}`;
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

      <View style={styles.containerPedidos}>

        <TouchableOpacity onPress={() => navigation.navigate("MeusPedidos")} style={styles.buttonBack}>
          <Icon name='restore' size={24} color='#fff' />
          <Text style={styles.textbutton}>Meus Pedidos</Text>
        </TouchableOpacity>

        
        {/* <TouchableOpacity style={styles.buttonBackRight}>
          <Icon name='reorder' size={24} color='#12299B' />
          <Text style={styles.textbuttonRight}>Filtrar</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.containerBusca}>
        {/* <TextInput 
          style={ styles.inputLogin } 
          autoCapitalize='none' 
          autoCorrect={false} 
          keyboardType="web-search"
          maxLength={40}
          placeholder="Busca"
          value={busca}
          onChangeText={(text) => setBusca(text)}
        />
        <TouchableOpacity onPress={() => navigation.goBack(null)} style={styles.buttonBusca}>
          <Icon name='search' size={24} color='gray' />
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={estab}
        keyExtractor={estab => String(estab._id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListEmptyComponent={<><Text style={styles.textEmpty}>Nenhum restaurante online no momento</Text><Icon style={styles.iconCenter} name='restaurant' size={24} color='#484848' /></>}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('Pedido', { idestab: item._id, nomeestab: item.nome }) }}>
            <View style={styles.ItemImg}>
        
              <View style={styles.containerGeral}>
                <View style={styles.imgContainer}>
                  <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
                </View>
                <View style={styles.txtContainer}>
                <Text numberOfLines={1} style={styles.textTitle}>{item.nome}</Text>
                  <Text numberOfLines={1} style={styles.textDesc}>{item.tipo} / {item.subtipo}</Text>
                  <Text numberOfLines={1} style={styles.textDesc}>{item.rua}, {item.numero}</Text>
                  <Text numberOfLines={1} style={styles.textDescAberto}>{item.descr}</Text>
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

  textEmpty: {
    fontSize:14,
    fontWeight:'300',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop:10,
    textAlign:'center'
  },

  iconCenter:{
    marginTop:10,
    textAlign:'center'
  },

  ItemImg: {
    //height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
    //paddingTop:1,
    //paddingBottom:1,
    backgroundColor:'#fff',
    borderRadius:5,
    marginTop:8,
    //marginBottom:4,
    marginLeft:screenWidth*0.025,
    marginRight:screenWidth*0.025,
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
    color:'#fff',
    marginTop:4,
    marginLeft:3,
    fontWeight:'500',
  },
  
  textbuttonBack: {
    fontSize:16,
    color:'#fff',
  },

  buttonBack: {
    width:screenWidth*0.95,
    flexDirection: 'row',
    marginRight:10,
    borderWidth:1,
    borderColor:'#d3d3d3',
    backgroundColor:'#794F9B',
    borderRadius:5,
    justifyContent: 'center',
    paddingBottom:5,
    paddingTop:5
  },

  textbuttonRight: {
    fontSize:14,
    color:'#12299B',
    marginTop:4,
    marginLeft:3,
    fontWeight:'500',
  },

  buttonBackRight: {
    flexDirection: 'row',
    width:screenWidth*0.42,
    justifyContent: 'flex-end',
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
    marginLeft: screenWidth * 0.025,
    width:screenWidth,
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
    marginLeft: screenWidth * 0.025,
    marginTop:5,
    backgroundColor:'#fff',
    borderColor: 'green', 
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
  },
})