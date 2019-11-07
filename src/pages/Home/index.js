import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Text, Image, ImageBackground, StyleSheet, Dimensions, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';

import logo from './assets/eloy.png';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function Home({ navigation }) {
  const [cat, setCat] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    
    setLoading(true);

    async function loadCat() {
      const response = await fetch(
        'https://backendeloyaqui.herokuapp.com/categorias' 
      );

      const data = await response.json();
      setCat(data);
      setLoading(false);
    }
    loadCat();
    
  }, []);

  async function handleSubmit() {
    navigation.navigate('Search', { busca: search, title: search })
  };

  state = {showIndicator:false}

  return (
    
      <View style={styles.backContainer}>
        <ImageBackground source={require('./assets/bg3.jpeg')} style={styles.backImageHeader}>
          <Image source={logo} style={styles.logo}></Image>
          <View style={styles.containerSearch}>
            <TextInput 
              style={styles.textSearch} 
              placeholder='O que está procurando ?' 
              placeholderTextColor="gray"  
              maxLength={12}
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

  logoContainer: {
    height:screenHeight * 0.42
  },

  backImageHeader: {
    height:screenHeight * 0.42,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#d3d3d3'
  },

  logo: {
    marginTop: screenHeight * 0.15
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
    color: '#d2d2d2'
  },

  textSearch: {
    width: screenWidth *0.78,
    paddingLeft:10,
    color:'#a3a3a3',
    height:35,
    marginTop: screenHeight * 0.08,
    backgroundColor:'#fff',
    borderColor:'#d3d3d3',
    borderWidth:1,
    borderRadius:5
  },

  btnSearch: {
    width: screenWidth *0.10,
    height:35,
    backgroundColor:'#fff',
    marginTop: screenHeight * 0.08,
    borderColor:'#d3d3d3',
    borderWidth:1,
    borderRadius:5,
    marginLeft:3,
    justifyContent: 'center',
    alignItems: 'center',
  }


});