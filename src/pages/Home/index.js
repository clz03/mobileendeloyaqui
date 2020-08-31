import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  FlatList, 
  Text, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableHighlight, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert } from 'react-native';

import logo from './assets/eloy.png';
import imgbg from './assets/bg3.jpeg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Home({ navigation }) {
  const [cat, setCat] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {

    async function loadCat() {
      const response = await fetch(
        //'http://192.168.0.8:8080/categorias'
        'https://backendeloyaqui.herokuapp.com/categorias' 
      );

      const data = await response.json();
      setCat(data);
      setLoading(false);
    }

    async function checkMensagemHome() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/homealert' 
      );
      const data = await response.json();

      if (typeof data[0] === 'object'){
        Alert.alert(
          data[0].titulo,
          data[0].mensagem
        );
      }
    }
    
    setLoading(true);
    loadCat();
    checkMensagemHome();
    
  }, []);

  async function handleSubmit() {
    if(search.length < 3){
      Alert.alert(
        'Busca inválida',
        'Digite mais caracteres para uma busca mais aprimorada'
      );
    } else {
      navigation.navigate('Search', { busca: search, title: search })
    }
  };

  state = {showIndicator:false}

  return (
    
      <View style={styles.backContainer}>
        <ImageBackground source={imgbg} style={styles.backImageHeader}>
          <Image source={logo} style={styles.logo}></Image>
          <View style={styles.containerSearch}>
            <TextInput 
              style={styles.textSearch} 
              placeholder='O que está procurando ?' 
              placeholderTextColor="gray"  
              maxLength={12}
              autoCapitalize='none' 
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity 
              style={styles.btnSearch} 
              underlayColor={"#d3d3d3"}
              onPress={handleSubmit}>
              <Icon name="navigate-next" size={24} style={styles.txtbtnSearch}/>
            </TouchableOpacity>
          </View>
        </ImageBackground>   
    
        <SafeAreaView style={styles.container}>

          <FlatList
            numColumns={3}
            scrollEnabled={true}
            data={cat}
            keyExtractor={cat => String(cat._id)}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              loading ? (
                <ActivityIndicator size="large" style={styles.backImageHeader}/>
              ) : (
                ""
              )
            }
            renderItem={({ item }) => (
            <TouchableHighlight underlayColor={"#d3d3d3"} onPress={() => { navigation.navigate('Search', { cat_id: item._id, title: item.nome }) }}>
              <View style={[styles.menuItem, {backgroundColor: item.color}]}>
                <Icon name={item.icon} size={24} color="#fff" />
                <Text style={styles.textMenu}>{item.nome}</Text>
              </View>
            </TouchableHighlight>
          )}            
          />

        </SafeAreaView>
      </View>
  );


}



var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0
  },

  backImageHeader: {
    height:screenHeight * 0.38,
    alignContent:'center',
    alignItems:'center'
  },

  containerSearch: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  container: {
    flex: 1,
    // flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#d3cfc7',
    //marginBottom:15
  },

  logo: {
    marginTop: screenHeight * 0.10
  },

  menuItem:{
    width: screenWidth *0.32,
    height: screenHeight*0.15,
    // backgroundColor: '#4E6A70',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:8,
    marginTop:3,
    marginLeft:4
  },

  textMenu: {
    fontSize:13,
    paddingTop:10,
    color: '#fff'
  },

  textSearch: {
    width: screenWidth *0.78,
    paddingLeft:10,
    color:'#a3a3a3',
    height:48,
    marginTop: screenHeight * 0.06,
    backgroundColor:'#fff',
    borderColor:'#d3d3d3',
    borderWidth:1,
    borderRadius:5
  },

  btnSearch: {
    width: screenWidth *0.10,
    height:48,
    backgroundColor:'#fff',
    marginTop: screenHeight * 0.06,
    borderColor:'#d3d3d3',
    borderWidth:1,
    borderRadius:5,
    marginLeft:3,
    justifyContent: 'center',
    alignItems: 'center',
  }

});