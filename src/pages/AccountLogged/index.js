import React, { useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableHighlight, FlatList, ActivityIndicator } from 'react-native';
import {Container, Tab, Tabs, TabHeading } from 'native-base';
import {AsyncStorage} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function AccountLogged({ navigation }) {

  // const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState([]);  
  const [loading, setLoading] = useState(false);

  async function handleLogout(){
    await AsyncStorage.removeItem('eloyuseremail');
    await AsyncStorage.removeItem('eloyusernome');
    navigation.navigate('Register');
  }

  useEffect(() => {

    setLoading(true);

    async function getStorageValue() {
      // setEmail(await AsyncStorage.getItem('eloyuseremail'));
      setNome(await AsyncStorage.getItem('eloyusernome'));
    }

    async function loadEventos() {
      //const response = await fetch(
      //  'https://backendeloyaqui.herokuapp.com/eventos' 
      //);

      //const data = await response.json();

      const data = [
        {
          '_id': '1',
          'title': 'Barbearia do Rody',
          'start': '2019-11-04',
          'end': '2019-11-05',
          'summary': 'Corte comum'
        },
        {
          '_id': '2',
          'title': 'Vi Pé e Mão',
          'start': '2019-11-04',
          'end': '2019-11-05',
          'summary': 'Depilação'
        }
      ]

      setEvento(data);
      setLoading(false);
    }

    getStorageValue();
    loadEventos();
    
  }, []);

  return (
    
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <Text style={styles.txtTitle}>Seja Bem Vindo, {nome}</Text>

            <TouchableHighlight style={styles.btnEntrar} onPress={handleLogout}>
              <Text style={styles.textoEntrar}>Sair</Text>
            </TouchableHighlight>

            <Container>
                <Tabs initialPage={0} locked={true}>
                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meus Agendamentos</Text></TabHeading>}>
                    <View style={styles.container}>
                      <FlatList
                      data={evento}
                      keyExtractor={evento => String(evento._id)}
                      ListHeaderComponent={
                        loading ? (
                          <ActivityIndicator size="large" style={styles.backImageHeader}/>
                        ) : (
                          ""
                        )
                      }
                      renderItem={({ item }) => (                
                        <View style={styles.Item}>
                        <Text style={styles.textDescPrinc}>{item.title}</Text>
                          <View style={styles.containerGeral}>
                            <View style={styles.txtContainer}>
                              <Text style={styles.textDesc}>{item.start.substring(8,10) + "/" + item.start.substring(5,7) + "/" + item.start.substring(0,4) + " - " + item.end.substring(8,10) + "/" + item.end.substring(5,7) + "/" + item.end.substring(0,4)}</Text>
                              <Text style={styles.textDesc}>{item.summary}</Text>
                            </View>
                          </View>
                        </View>
                        )}            
                      />
                    </View>
                  </Tab>


                  <Tab heading={<TabHeading style={styles.tabHeading} ><Text>Meus Cupons</Text></TabHeading>}>
                    <View style={styles.container}>
                      
                    </View>
                  </Tab>
                </Tabs>
              </Container>
            

          </View>
        </View>
  );
}

var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },

  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'#fff'
  },

  containerGeral:{
    flexDirection:'row',
  },

  txtTitle:{
    color:'#000',
    fontSize:25,
    marginTop:10,
    textAlign:'center',
    fontWeight:'bold'
  },

  txtTitleDesc:{
    color:'#000',
    fontSize:20,
    marginTop:10,
    marginBottom:10,
    marginLeft:5,
    textAlign:'center',
  },

  textDescPrinc: {
    fontSize: 14,
    fontWeight:'bold',
    marginBottom:5,
    marginTop:5
  },

  textDesc: {
    fontSize: 13,
  },

  Item: {
    height:screenHeight * 0.1,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingLeft: 10,
  },

  txtContainer:{
    width:screenWidth *0.7,
  },



  btnEntrar:{
    width: screenWidth * 0.50,
    backgroundColor:'#471a88',
    height:35,
    marginTop: 15,
    marginBottom: 15,
    borderRadius:6,
    alignSelf:'center'
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    marginTop:5
  }
  

});