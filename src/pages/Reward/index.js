import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Platform, 
  ActivityIndicator, 
  Image, 
  TouchableHighlight, 
  Alert, 
  AsyncStorage,
  Modal} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export function isIphoneX() {
  return (
    Platform.OS === 'ios' && screenHeight >= 812
  );
};

export function isAndroid() {
  return (
    Platform.OS !== 'ios'
  );
};

export default function Reward({navigation}) {

  const [cupom, setCupom] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [page, setPage] = useState(1);   
  const [totalCount, setTotalCount] = useState(0);   
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false){

    if(totalCount && pageNumber > totalCount) return;
 
    const response = await fetch(
      `https://backendeloyaqui.herokuapp.com/cupons?page=${pageNumber}` 
    );

    const data = await response.json();
    setCupom(shouldRefresh ? data.result : [...cupom, ...data.result]);
    setTotalCount(Math.ceil(data.totalRecords / 10));
    setPage(pageNumber + 1)
    setLoading(false)
  };

  useEffect(() => {
    setLoading(true)
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  async function handleCupom(idcupom, idestabelecimento){

    const iduser = await AsyncStorage.getItem('eloyuserid');

    if (iduser != null){
        Alert.alert(
          'Confirmação',
          'O cupom pode ser utilizado somente uma vez. Ele ficará disponível no seu perfil',
          [
            {text: 'Voltar'},
            {text: 'Confirmar', onPress: () => confirmCupom(idcupom, iduser, idestabelecimento)}
          ]
        );
    } else {
      Alert.alert(
        'Login',
        'Para utilizar cupons é preciso fazer login',
        [
          {text: 'OK'},
          {text: 'Ir para Login', onPress: () => navigation.navigate('Login')}
        ]
      );
    }
  };

  async function confirmCupom(idcupom, iduser, idestabelecimento) {
    
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/usuarios/'+ iduser
    );

    const datareturn = await response.json();

    if(!datareturn[0].validado){
      Alert.alert(
        'Seu cadastro ainda não está validado',
        'Por favor ative seu cadastro, verifique o e-mail recebido para ativar sua conta.'
      );
      return;
    }

    setLoading2(true);

    const responseApi = await fetch(
       'https://backendeloyaqui.herokuapp.com/usercupons', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idusuario: iduser,
          idcupom: idcupom,
          idestabelecimento: idestabelecimento,
          utilizado: false
        }),
    });

    setLoading2(false);

    if(responseApi.ok){
      setTimeout(() => Alert.alert('Confirmação', 'Parabéns, seu cupom está disponível no seu Perfil para ser utilizado.'), 800);
    }  else {
      setTimeout(() => Alert.alert('=(', 'Algum problema impediu a solicitação. Por favor tente novamente.'), 800);
    }

}


  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>

          <FlatList
            data={cupom}
            keyExtractor={cupom => String(cupom._id)}
            onEndReached={() => loadPage()}
            onEndReachedThreshold={0.1}
            onRefresh={refreshList}
            ListEmptyComponent={loading == false &&
                                <Text style={styles.tabTitle}>Em breve novos cupons disponíveis.</Text>
                               }
            refreshing={refreshing}
            ListHeaderComponent={
              loading ? (
                <ActivityIndicator size="large" style={styles.LoadingIndicator} />
              ) : (
                ""
              )
            }
            renderItem={({ item }) => (
          
              <View style={styles.menuItem}>
                <View style={styles.dados}>
                  <Text style={styles.ticketText}>{item.premio}</Text>
                  <View style={styles.containerGeral}>
                    <View style={styles.imgContainer}>
                      <Image style={styles.imagem} source={{uri: item.idestabelecimento.imagem }}></Image>
                    </View>
                    <View style={styles.txtContainer}>
                      <Text numberOfLines={1} style={styles.dadosText}>{item.idestabelecimento.nome}</Text>
                      <Text numberOfLines={1} style={styles.dadosText}>{item.idestabelecimento.tipo}/{item.idestabelecimento.subtipo}</Text>
                      <Text numberOfLines={1} style={styles.dadosText}>{item.idestabelecimento.rua}, {item.idestabelecimento.numero}</Text>
                      <Text style={styles.dadosTextRegras}>*{item.regra}</Text>
                      <Text style={styles.dadosTextRegras}>*Válido até {item.validade.substring(8,10) + "/" + item.validade.substring(5,7) + "/" + item.validade.substring(0,4)}*</Text>
                      <TouchableHighlight style={styles.btnEntrar} onPress={() => { handleCupom(item._id, item.idestabelecimento) }}>
                        <Text style={styles.textoEntrar}>Obter Cupom</Text>
                      </TouchableHighlight>
                    </View>

                  </View>
                </View>

              </View>

              
            )}  
          />
          </View>
          {
                loading2 && <Modal
                transparent={true}
                animationType={'none'}
                visible={loading2}>
                <View style={styles.modalBackground}>
                  <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                      animating={loading2} />
                      <Text style={styles.textMenuSmall}>processando</Text>
                  </View>
                </View>
              </Modal>
          }
        </View>
  );
}

var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },

  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor:'#e5e5e5'
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },

  tabTitle: {
    paddingLeft: 10,
    paddingTop:10,
    color:'#707070',
    textAlign:'center'
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  textMenuSmall: {
    fontSize:10,
    color: '#000',
    alignItems: 'center',
  },

  menuItem:{
    flexDirection: 'row',
    width: screenWidth *0.95,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor: '#fff',
    borderRadius:6,
    borderWidth:1,
    borderColor:'#a1a1a1',
    marginTop:8,
    marginLeft:screenWidth *0.025,
  },

  barraLateralVerde:{
    backgroundColor:'#006400',
    width:screenWidth *0.01,
    height:'100%',
  },

  barraLateralCinza:{
    backgroundColor:'gray',
    width:screenWidth *0.03,
    height:'100%',
    borderTopLeftRadius:15,
    borderBottomLeftRadius:15
  },


  ticketText:{
    color:'#5d5d5d',
    marginBottom:5,
    fontWeight:'300',
    textAlign:"center",
    fontSize:15,
  },

  dados:{
    width: screenWidth *0.90,
  },

  dadosText:{
    color:'#5d5d5d',
    fontSize:14,
    marginLeft:screenWidth*0.01,
  },

  dadosTextTitle:{
    color:'#5d5d5d',
    marginLeft:screenWidth*0.01,
    marginTop:screenHeight*0.01,
    fontWeight:'300'
  },

  dadosTextRegras:{
    color:'#5d5d5d',
    marginLeft:screenWidth*0.01,
    fontSize:11,
  },

  containerGeral:{
    flexDirection:'row',
  },

  imgContainer:{
    width:screenWidth *0.2,
    marginTop:screenHeight*0.005,
  },

  imagem:{
    width:screenWidth *0.18,
    height:screenWidth *0.18,
    borderRadius:5,
    borderColor:'#d3d3d3',
    borderWidth:3,
    marginLeft:screenWidth*0.01,
  },

  txtContainer:{
    width:screenWidth *0.69,
  },

  btnEntrar:{
    width: screenWidth * 0.68,
    backgroundColor:'#471a88',
    marginTop:screenHeight*0.015,
    marginRight:screenWidth*0.01,
    padding:4,
    borderRadius:20,

  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:16,
  }

});