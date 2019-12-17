import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Platform, ScrollView } from 'react-native';

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

export default function TelUteis() {

  const [teluteis, setTeluteis] = useState([]);  
  const [loading, setLoading] = useState(false);

  async function loadTel() {
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/teluteis' 
    );

    const data = await response.json();
    setTeluteis(categorizeArray(data));
    setLoading(false);
  }

  function categorizeArray(data) {
    var newData = data.reduce(function(obj, v, i) {
      obj[v.categoria] = obj[v.categoria] || [];
      obj[v.categoria].push(v);
      return obj;
    }, {});
    return newData;
  }

  useEffect(() => {
    setLoading(true)
    loadTel();
  }, []);


  return (

    <View style={styles.container}>

      { loading &&
        <ActivityIndicator size="large" style={styles.LoadingIndicator}/>
      }

      <ScrollView>
      <Text style={styles.textTitle}>Emergências</Text>
      {teluteis.Emergências && teluteis.Emergências.map(teluteis => 
          <View style={styles.ItemImg} key={teluteis._id}>
            <View style={styles.containerGeral}>
              <View style={styles.txtContainer}>
                <Text style={styles.textDesc}>{teluteis.nome} - {teluteis.telefone}</Text>
              </View>
            </View>
        </View>
        )
      }

      <Text style={styles.textTitle}>Saúde</Text>
      {teluteis.Saúde && teluteis.Saúde.map(teluteis => 
          <View style={styles.ItemImg} key={teluteis._id}>
            <View style={styles.containerGeral}>
              <View style={styles.txtContainer}>
              <Text style={styles.textDesc}>{teluteis.nome} - {teluteis.telefone}</Text>
              </View>
            </View>
        </View>
        )
      }

      <Text style={styles.textTitle}>Úteis</Text>
      {teluteis.Úteis && teluteis.Úteis.map(teluteis => 
          <View style={styles.ItemImg} key={teluteis._id}>
            <View style={styles.containerGeral}>
              <View style={styles.txtContainer}>
              <Text style={styles.textDesc}>{teluteis.nome} - {teluteis.telefone}</Text>
              </View>
            </View>
        </View>
        )
      }

    </ScrollView>
  </View>
);
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

ItemImg: {
  height: isIphoneX() ? screenHeight*0.04 : isAndroid() ? screenHeight*0.07 : screenHeight*0.04,
  backgroundColor:'#fff',
  borderBottomColor:'#d5d5d5',
  borderBottomWidth:1,
  marginLeft:10,
},

textTitle: {
  fontSize:14,
  fontWeight:'bold',
  color:'#12299B',
  marginLeft:10,
  marginTop:8
},

textDesc: {
  fontSize: 12,

},

textDescAberto: {
  fontSize: 12,
  paddingTop:5,
  color:'green'
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
  marginTop:5,
},

imagem:{
  width:screenWidth *0.19,
  height:screenWidth *0.19,
  borderRadius:5,
  borderColor:'#d3d3d3',
  borderWidth:3,
},

txtContainer:{
  width:screenWidth *0.7,
  marginTop:8
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
  color:'#fff',
  fontSize:10,
  fontWeight:'bold'
},
})