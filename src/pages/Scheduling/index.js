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
  TextInput,
  ActivityIndicator, 
  Platform } from 'react-native';

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

export default function Scheduling({ navigation }) {
  
  const [estab, setEstab] = useState([]);   
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    var query;
    if(totalCount && pageNumber > totalCount) return;

    if(search.length > 3){
      query = 'https://backendeloyaqui.herokuapp.com/estabelecimentos/com/agendamento/habilitado/busca/' + search + `?page=${pageNumber}`;
    } else {
      query = 'https://backendeloyaqui.herokuapp.com/estabelecimentos/com/agendamento/habilitado' + `?page=${pageNumber}`;
    }
    
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

  // async function handleSubmit() {
  //   if(search.length < 3){
  //     Alert.alert(
  //       'Busca inválida',
  //       'Digite mais caracteres para uma busca mais aprimorada'
  //     );
  //   } else {
  //     navigation.navigate('Search', { busca: search, title: search })
  //   }
  // };

  return (

    <View style={styles.container}>

      <View style={styles.containerGeral}>
        <TextInput 
          style={ styles.inputLogin } 
          autoCapitalize='none' 
          autoCorrect={false} 
          maxLength={40}
          value={search}
          onChangeText={setSearch}
          placeholder="Filtrar / Buscar"
        />

        <TouchableOpacity style={styles.labelLogin} onPress={refreshList}>
          <Text>Buscar</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={estab}
        keyExtractor={estab => String(estab._id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListEmptyComponent={loading == false &&
            <Text style={styles.textEmpty}>Não encontramos, tente outra busca !</Text>
          }
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('Detail', { idestab: item._id, schedule:true }) }}>
            <View style={styles.ItemImg}> 
            
              <View style={styles.containerGeral}>
                <View style={styles.imgContainer}>
                  <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
                </View>
                <View style={styles.txtContainer}>

                   
                    
                      <View style={styles.containerBadge}>
                        <View style={styles.viewBadge}>
                          <Text numberOfLines={1} style={styles.textTitle}>{item.nome}</Text>
                        </View>
                        <View style={styles.viewBadge2}>
                          <Text numberOfLines={1} style={styles.textDescBadge}>Agenda Online</Text>
                        </View>
                      </View>
                    

                    

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
    //height: isIphoneX() ? screenHeight*0.115 : isAndroid() ? screenHeight*0.175 : screenHeight*0.145,
    //paddingTop:1,
    //paddingBottom:1,
    backgroundColor:'#fff',
    borderRadius:5,
    marginTop:5,
    marginBottom:4,
    marginLeft:screenWidth*0.025,
    marginRight:screenWidth*0.025,
  },

  textEmpty: {
    fontSize:14,
    fontWeight:'300',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop:10,
    textAlign:'center'
  },

  direita:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#484848'
  },

  viewBadge: {
    width:screenWidth*0.52,
    flexDirection:'row',
  },

  viewBadge2: {
    width: screenWidth *0.22,
    alignItems:"center",
    backgroundColor:"#fff",
    borderColor:'#004c00',
    borderWidth:1,
    borderRadius:8
  },

  textDescBadge: {
    fontSize: 10,
    paddingTop:1,
    color:'#004c00',
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

  labelLogin:{
    width:screenWidth * 0.20,
    color:'#484848',
    marginTop:screenHeight*0.005,
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  },

  inputLogin:{
    width:screenWidth * 0.75,
    height:35,
    marginLeft: screenWidth * 0.025,
    marginTop:screenHeight*0.005,
    marginBottom:screenHeight*0.005,
    borderColor: '#d3d3d3', 
    backgroundColor:'#fff',
    borderWidth: 1,
    borderRadius:5,
    paddingLeft:3
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
})