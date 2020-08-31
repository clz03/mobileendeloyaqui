import React, { useState, useEffect }  from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight, 
  Image, 
  Dimensions, 
  FlatList, 
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

export default function Search({ navigation }) {
 
  const cat_id = navigation.getParam('cat_id');
  const busca = navigation.getParam('busca');
  const cat_nome = navigation.getParam('title');
  
  const [estab, setEstab] = useState([]);   
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    
    if(totalCount && pageNumber > totalCount) return;

    const query = (busca == undefined ? 'https://backendeloyaqui.herokuapp.com/estabelecimentos/categoria/' + cat_id + `?page=${pageNumber}` : 'https://backendeloyaqui.herokuapp.com/estabelecimentos/busca/' + busca + `?page=${pageNumber}`);
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
    navigation.setParams({ 
      categoria: cat_nome
    }); 
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
        ListEmptyComponent={loading == false &&
          <>
            <Text style={styles.textEmpty}>Não encontramos, tente outra busca !</Text>
          </>

          }
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.LoadingIndicator} />
          ) : (
            ""
          )
        }
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('Detail', { idestab: item._id }) }}>
            <View style={styles.ItemImg}> 
            
              <View style={styles.containerGeral}>
                <View style={styles.imgContainer}>
                  <Image style={styles.imagem} source={{uri: item.imagem }}></Image>
                </View>
                <View style={styles.txtContainer}>

                    {item.delivery &&
                      <View style={styles.containerBadge}>
                        <View style={styles.viewBadge}>
                          <Text numberOfLines={1} style={styles.textTitle}>{item.nome}</Text>
                        </View>
                        <View style={styles.viewBadge2}>
                          <Text numberOfLines={1} style={styles.textDescBadge}>Cardápio Online</Text>
                        </View>
                      </View>
                    }

                    {item.agendamento &&
                      <View style={styles.containerBadge}>
                        <View style={styles.viewBadge}>
                          <Text numberOfLines={1} style={styles.textTitle}>{item.nome}</Text>
                        </View>
                        <View style={styles.viewBadge2}>
                          <Text numberOfLines={1} style={styles.textDescBadge}>Agenda Online</Text>
                        </View>
                      </View>
                    }

                    {!item.delivery && !item.agendamento &&
                        <Text numberOfLines={1} style={styles.textTitle}>{item.nome}</Text>
                    }

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

Search.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>{navigation.getParam('categoria')}</Text>
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

  textEmpty: {
    fontSize:14,
    fontWeight:'300',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop:10,
    textAlign:'center'
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
    fontSize: 9,
    paddingTop:1,
    color:'#004c00',
  },

  textTitle: {
    fontSize:13,
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