import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, AsyncStorage, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/pt-br';

const screenWidth = Math.round(Dimensions.get('window').width);
//const screenHeight = Math.round(Dimensions.get('window').height);

export default function Sacola({ navigation }) {
 
  //const idestab = navigation.getParam('idestab');
  //const nomeestab = navigation.getParam('nomeestab');

  const [estab, setEstab] = useState([]);
  const [nomeestab, setNomeestab] = useState('');
  const [endereco, setEndereco] = useState([]);  
  const [apelido, setApelido] = useState('');  
  const [cep, setCep] = useState('');  
  const [rua, setRua] = useState('');  
  const [numero, setNumero] = useState('');  
  const [bairro, setBairro] = useState('');  
  const [complemento, setComplemento] = useState('');  
  const [itens, setItens] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("E");
  const [valortotal, setValortotal] = useState(0);
  const [valortaxaE, setValortaxaE] = useState(0);
  const [valorGrandTotal, setValorGrandTotal] = useState(0);
  const [tipoPag, setTipoPag] = useState("D"); // D=Debito - C=Credito - E=Especie
  const [troco, setTroco] = useState("0"); // Troco para E=Especie
  const [showEnd, setShowEnd] = useState(false);
  const [cadEnd, setCadEnd] = useState(false);
  const [confirmaPedido, setConfirmaPedido] = useState(false);
  const [erroValidador, setErroValidador] = useState('');


  async function loadEstab() {
    var idestab = await AsyncStorage.getItem('eloyitemestab');
    idestab = idestab.replace(/"/g,'');
    
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/estabelecimentos/' + idestab
    );
    const data = await response.json();
    setEstab(data);
    setNomeestab(data[0].nome);
  };



  async function loadEndereco(indice) {
    const iduser = await AsyncStorage.getItem('eloyuserid');
    if(indice === null) indice = 0;
    const response = await fetch(
      'https://backendeloyaqui.herokuapp.com/enderecos/usuario/' + iduser
    );
    const data = await response.json();
    setEndereco(data);
    setApelido(data[indice].apelido);
    setRua(data[indice].rua);
    setNumero(data[indice].numero);
    setBairro(data[indice].bairro);
    setComplemento(data[indice].complemento);
    setCep(data[indice].cep);
  };



  async function Limpapedido(){
    for (i = 1; i <= 15; i++) {
      await AsyncStorage.removeItem('eloypedido');
      await AsyncStorage.removeItem('eloyitem'+i);
      await AsyncStorage.removeItem('eloyqtdy'+i);
      await AsyncStorage.removeItem('eloyvalorun'+i);
      await AsyncStorage.removeItem('eloyvalortotal'+i);
    }
  };



  function handlePedido(){
    setConfirmaPedido(true);
  };



  async function confirmPedido(){

    var itensPed = [];
    var idestab = await AsyncStorage.getItem('eloyitemestab');
    idestab = idestab.replace(/"/g,'');

    setConfirmaPedido(false);
    setLoading(true);

    const iduser = await AsyncStorage.getItem('eloyuserid');
    var today = new Date();
    today = moment(today).format("YYYY-MM-DD HH:mm:ss");

    for (i = 1; i <= 15; i++) {

      vlUnitario = await AsyncStorage.getItem('eloyvalorun'+i);
      if(vlUnitario !== null)
        vlUnitario = vlUnitario.replace(/"/g,'');

      vlTotal = await AsyncStorage.getItem('eloyvalortotal'+i);
      if(vlTotal !== null)
        vlTotal = vlTotal.replace(/"/g,'');

      quantidade = await AsyncStorage.getItem('eloyqtdy'+i);
      if(quantidade !== null)
        quantidade = quantidade.replace(/"/g,'');

      observacao = await AsyncStorage.getItem('eloyitemobs'+i);
      if(observacao !== null)
        observacao = observacao.replace(/"/g,'');

      nome = await AsyncStorage.getItem('eloyitem'+i);

      if(nome !== null){
        nome = nome.replace(/"/g,'');
        itensPed.push({
          item: nome,
          valorun: vlUnitario,
          qtdy: quantidade,
          valortotal: vlTotal,
          obs: observacao        
        });
      };

    };

    const apireturn = await fetch(
      'https://backendeloyaqui.herokuapp.com/pedidos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data:today, 
          status:'1', 
          subtotal: valortotal.toFixed(2), 
          taxaentrega: valortaxaE.toFixed(2), 
          total: valorGrandTotal.toFixed(2), 
          tipopag: tipoPag, 
          troco: troco,
          tipoentrega: tipoEntrega,
          apelido:apelido,
          rua:rua,
          numero:numero,
          bairro:bairro,
          cep:cep,
          complemento:complemento,
          idestabelecimento:idestab, 
          idusuario:iduser,
          itensPed: itensPed
        }),
    })

    const responseJson = await apireturn.json();
    
    if (!apireturn.ok) {
      setErroValidador(responseJson.error);
      alert(responseJson.error);
      setLoading(false);
    } else {
      setErroValidador('');
      setLoading(false);
      Limpapedido();
      navigation.navigate('MeusPedidos');
    }
  };




  async function CarregaItensPedido(){
    var itensPed = [];
    var nome;
    var vlTotal = 0;
    var vlAcumulado = 0;
    var quantidade = 1;
    var observacao;
    //var count = parseInt(await AsyncStorage.getItem('eloypedido'));
    
    for (i = 1; i <= 15; i++) {
      vlTotal = await AsyncStorage.getItem('eloyvalortotal'+i);
      if(vlTotal !== null)
        vlTotal = vlTotal.replace(/"/g,'');

      quantidade = await AsyncStorage.getItem('eloyqtdy'+i);
      if(quantidade !== null)
        quantidade = quantidade.replace(/"/g,'');

      observacao = await AsyncStorage.getItem('eloyitemobs'+i);

      nome = await AsyncStorage.getItem('eloyitem'+i);
      if(nome !== null){
        nome = nome.replace(/"/g,'');
        itensPed.push({
          id: i,
          item: nome,
          qtdy: quantidade,
          valortotal: vlTotal,
          obs: observacao
        })
        vlAcumulado = parseFloat(vlTotal) + parseFloat(vlAcumulado);
      };
      vlTotal = 0;
      quantidade = 1;
    };
  
    if (vlAcumulado === 0){
      navigation.goBack(null);
      return;
    }

    setItens(itensPed);
    setValortotal(vlAcumulado);
    if(tipoEntrega == 'E'){
      setValortaxaE(3);
      setValorGrandTotal(vlAcumulado + 3);
    }else{
      setValortaxaE(0);
      setValorGrandTotal(vlAcumulado);
    }

    setLoading(false);
  };  




  async function SubmitEndereco(){

    const iduser = await AsyncStorage.getItem('eloyuserid');
    var cError = false;

    if(cep == '') {
      setErroValidador2('cep não pode ser vazio');
      cError = true;
    }

    if(bairro == '') {
      setErroValidador2('bairro não pode ser vazio');
      cError = true;
    }

    if(numero == '') {
      setErroValidador2('numero não pode ser vazio');
      cError = true;
    }

    if(rua == '') {
      setErroValidador2('rua não pode ser vazio');
      cError = true;
    }

    if(apelido == '') {
      setErroValidador2('apelido não pode ser vazio');
      cError = true;
    }
   
    if(cError) return;
    setLoading(true);

    const apireturn = await fetch(
       'https://backendeloyaqui.herokuapp.com/enderecos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apelido,
          rua,
          numero,
          bairro,
          cep,
          complemento:complemento,
          idusuario:iduser
        }),
    });

    const responseJson = await apireturn.json();
    
    if (apireturn.ok) {
      setErroValidador('');
      setLoading(false);
      setCadEnd(false);
      loadEndereco();
    } else {
      setErroValidador(responseJson.error);
      setLoading(false);
    }

};



  async function RemoveItemPedido(i){
    const qtdyItens = parseInt(await AsyncStorage.getItem('eloypedido'));
    await AsyncStorage.setItem('eloypedido',JSON.stringify(qtdyItens - 1));
    await AsyncStorage.removeItem('eloyitem'+i);
    await AsyncStorage.removeItem('eloyqtdy'+i);
    await AsyncStorage.removeItem('eloyvalorun'+i);
    await AsyncStorage.removeItem('eloyvalortotal'+i);
    setTimeout(() => {CarregaItensPedido();}, 500);
    navigation.state.params.onNavigateBack();
  };




  useEffect(() => {
    setLoading(true);
    loadEstab();
    loadEndereco(0);
    setTimeout(() => {CarregaItensPedido();}, 2000);
  }, []);



  useEffect(() => {
    CarregaItensPedido();
  }, [tipoEntrega]);

  

  return (

    <View style={styles.container}>

      <ScrollView>

        <View style={styles.secao}>
          <Text style={styles.textDestaques}>{nomeestab}</Text>
          <Text style={styles.textDestaques}>Entrega ou Retirada</Text>
          
          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Entrega</Text>
              <Text style={styles.textDesc}>50-60 minutos</Text>
              <Text style={styles.textItemDesc}>R$3,00</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoEntrega("E")}
            >
              { tipoEntrega === "E" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Retirada</Text>
              <Text style={styles.textDesc}>20-30 minutos</Text>
              <Text numberOfLines={1} style={styles.textItemDesc}>{estab.rua}</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoEntrega("R")}
            >
              { tipoEntrega === "R" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

        </View>

        { tipoEntrega === "E" && endereco.length > 0 && (

        <View style={styles.secao}>
          <View style={styles.containerGeral}>
            <Text style={styles.textDestaques}>Entregar em </Text>
            <TouchableOpacity onPress={() => setShowEnd(true)}><Text style={styles.textDestaquesLink}>( Alterar Endereço )</Text></TouchableOpacity>
          </View>
          <View style={styles.containerGeral}>
            <Icon style={styles.icone} name='near-me' size={24} color='#817E9F' />
            <View style={styles.containerColumnComplemento}>
              {endereco.length > 0 && (
              <>
                <Text numberOfLines={1} style={styles.textDesc}>{rua}, {numero}</Text>
                <Text numberOfLines={1} style={styles.textItemDesc}>{bairro} - {complemento}</Text>
              </>
              )}
            </View>
          </View>
        </View>

        )}

        { tipoEntrega === "E" && endereco.length === 0 && (

        <View style={styles.secao}>
          <View style={styles.containerGeral}>
            <Text style={styles.textDestaques}>Entregar em </Text>
            <TouchableOpacity onPress={() => setCadEnd(true)}><Text style={styles.textDestaquesLink}>( Cadastrar Endereço )</Text></TouchableOpacity>
          </View>
        </View>

        )}

        <View style={styles.secao}>
          <Text style={styles.textDestaquesValores}>O que será preparado</Text>

          {itens.map(item => 
              <View key={item.id}>

                <View style={styles.buttonContainer}>
                  <View style={styles.containerColumn}>
                    <Text style={styles.textDestaquesCardapio}>{item.qtdy}x {item.item}</Text>
                    <Text style={styles.textDesc}>R${item.valortotal}</Text>
                    {item.obs.length > 2 &&
                      <Text style={styles.textItemDesc}>Obs: {item.obs}</Text>
                    }
                  </View>
                  <TouchableOpacity onPress={() => RemoveItemPedido(item.id)}><Icon name='remove-circle' size={24} color='red' /></TouchableOpacity>
                </View>


              </View>
            )}

          <View style={styles.bordas}>
            <TouchableOpacity style={styles.btnAdicionar} onPress={() => { navigation.goBack(null) }}>
              <Text style={styles.textoAdicionar}>Adicionar mais itens</Text>
            </TouchableOpacity>
          </View>
          
          { tipoEntrega == "E" &&
            <>
              <View style={styles.buttonContainerPag}>
                <View style={styles.containerColumn}>
                  <Text style={styles.textDesc}>SubTotal:</Text>
                </View>
                <Text>R${valortotal.toFixed(2)}</Text>
              </View>

              <View style={styles.buttonContainerPag}>
                <View style={styles.containerColumn}>
                  <Text style={styles.textDesc}>Taxa Entrega:</Text>
                </View>
                <Text>R${valortaxaE.toFixed(2)}</Text>
              </View>
            </>
          }

          <View style={styles.buttonContainerPag}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDescBold}>Total:</Text>
            </View>
            <Text style={styles.valorDireita}>R${valorGrandTotal.toFixed(2)}</Text>
          </View>

        </View>

        <View style={styles.secaoLast}>
          <Text style={styles.textDestaques}>Pagamento</Text>
          {/* <Text style={styles.textItemDesc}>*Pague no recebimento</Text> */}

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Cartão Débito/Crédito</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoPag("D")}
            >
              { tipoPag === "D" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Dinheiro</Text>
            </View>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => setTipoPag("E")}
            >
              { tipoPag === "E" && (<View style={styles.checkedCircle} />) }
            </TouchableOpacity>
          </View>
          
          {tipoPag === 'E' &&
          <View style={styles.buttonContainer}>
            <View style={styles.containerColumn}>
              <Text style={styles.textDesc}>Troco para:</Text>
            </View>
            <TextInput 
              style={ styles.inputLogin } 
              autoCapitalize='none' 
              autoCorrect={false} 
              keyboardType="email-address"
              maxLength={40}
              placeholder="ex: 100"
              value={troco}
              onChangeText={(text) => setTroco(text)}
            />
          </View>
          }

          <TouchableOpacity style={styles.btnEntrar} onPress={() => { handlePedido() }}>
            <Text style={styles.textoEntrar}>Fazer Pedido</Text>
          </TouchableOpacity>
          
        </View>

      </ScrollView>


        {showEnd && <Modal
          transparent={true}
          animationType={'none'}
          visible={showEnd}>
          <View style={styles.modalBackground}>
            <View style={styles.ModalFormEnd}>
              <Text style={styles.textDescPrincEnd}>Meu(s) Endereço(s)</Text>
              <TouchableOpacity onPress={() => { setShowEnd(false); setCadEnd(true)}}><Text style={styles.textDestaquesLink}>( Cadastrar Endereço )</Text></TouchableOpacity>
              <Text></Text>
              {endereco.map((endereco, index) => 
                <View key={endereco._id}>
                  <Text style={styles.textDescPrinc2}>Apelido: <Text style={styles.textDesc}>{endereco.apelido}</Text></Text>
                  <Text style={styles.textDescPrinc2}>End: <Text style={styles.textDesc}>{endereco.rua}, {endereco.numero}</Text></Text>
                  <Text style={styles.textDescPrinc2}>Bairro: <Text style={styles.textDesc}>{endereco.bairro}</Text></Text>
                  <Text style={styles.textDescPrinc2}>Complemento: <Text style={styles.textDesc}>{endereco.complemento}</Text></Text>
                  <Text style={styles.textDescPrinc2}>CEP: <Text style={styles.textDesc}>{endereco.cep}</Text></Text>
                  <TouchableOpacity onPress={() => {loadEndereco(index); setShowEnd(false) }}>
                      <Text style={styles.textoRemoverEnd}>( Selecionar )</Text>
                  </TouchableOpacity>
                  <Text></Text>
                </View>
              )}
                <TouchableOpacity style={styles.btnEntrarModal2} onPress={() => setShowEnd(false)}>
                  <Text style={styles.textoEntrar}>Fechar</Text>
                </TouchableOpacity>

            </View>
          </View>
        </Modal>
        }

        {cadEnd && <Modal
                transparent={true}
                animationType={'none'}
                visible={cadEnd}>
                <View style={styles.modalBackground}>
                  <View style={styles.ModalFormEnd}>
                    <Text style={styles.textDescPrincEnd}>Novo Endereço</Text>
                    <Text style={styles.labelLogin}>Apelido</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Apelido para identificar"
                      value={apelido}
                      onChangeText={(text) => setApelido(text)}
                    />
                      <Text style={styles.labelLogin}>Rua</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="Rua/Av do seu Endereço"
                      value={rua}
                      onChangeText={(text) => setRua(text)}
                    />
                      <Text style={styles.labelLogin}>Número</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: 856"
                      value={numero}
                      onChangeText={(text) => setNumero(text)}
                    />
                      <Text style={styles.labelLogin}>Bairro</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: Jd Ermida I"
                      value={bairro}
                      onChangeText={(text) => setBairro(text)}
                    />
                      <Text style={styles.labelLogin}>Complemento</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: Torre Lest - AP 85"
                      value={complemento}
                      onChangeText={(text) => setComplemento(text)}
                    />
                      <Text style={styles.labelLogin}>CEP</Text>
                    <TextInput 
                      style={ styles.inputLoginModal } 
                      autoCorrect={false} 
                      maxLength={20}
                      placeholder="ex: 13212-070"
                      value={cep}
                      onChangeText={(text) => setCep(text)}
                    />

                     <Text style={styles.labelError}>{erroValidador}</Text>
                     <TouchableOpacity style={styles.btnEntrarModal} onPress={SubmitEndereco}>
                      <Text style={styles.textoEntrar}>Cadastrar Endereço</Text>
                     </TouchableOpacity>
                     
                     <TouchableOpacity style={styles.btnEntrarModal2} onPress={() => setCadEnd(false)}>
                      <Text style={styles.textoEntrar}>Cancelar</Text>
                     </TouchableOpacity>
                     <Text></Text>
                  </View>
                </View>
              </Modal>
              }


    {confirmaPedido && <Modal
          transparent={true}
          animationType={'none'}
          visible={confirmaPedido}>
          <View style={styles.modalBackground}>
            <View style={styles.ModalFormEnd}>
              <Text style={styles.textDescPrincEnd}>Confirmação dos dados</Text>
              <Text></Text>
              {tipoEntrega === 'E' && endereco.map((endereco, index) => 
                <View key={endereco._id}>
                  <Text style={styles.textDescPrinc2}>Entregar em:</Text>
                  <Text style={styles.textDescPrinc2}>End:<Text style={styles.textDesc}>{endereco.rua}, {endereco.numero}</Text></Text>
                  <Text style={styles.textDescPrinc2}>Bairro: <Text style={styles.textDesc}>{endereco.bairro}</Text></Text>
                  <Text style={styles.textDescPrinc2}>Complemento: <Text style={styles.textDesc}>{endereco.complemento}</Text></Text>                 
                </View>
              )}
              <Text></Text>
              <View>
                <Text style={styles.textDescPrincEnd}>Pague na entrega</Text>
                <Text style={styles.textDescPrincEnd}>{tipoPag === 'E' ? 'Dinheiro' : 'Cartão Débito/Crédito' }</Text>
                <Text></Text>
              </View>
                
                <TouchableOpacity style={styles.btnEntrarModal} onPress={() => confirmPedido()}>
                <Text style={styles.textoEntrar}>Confirmar Pedido</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnEntrarModal2} onPress={() => setConfirmaPedido(false)}>
                <Text style={styles.textoEntrar}>Alterar Dados</Text>
                </TouchableOpacity>
                <Text></Text>

            </View>
          </View>
        </Modal>
        }


    </View>
  );
}


Sacola.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={styles.txtPedido}>Finalizar Pedido</Text>
    ),
  }
}

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor:'#ededed'
  },

  LoadingIndicator:{
    flex:1,
    justifyContent:"center",
    marginTop:15
  },

  pedidoBottom:{
    flexDirection:'row',
    width: screenWidth,
    height: 45,
    backgroundColor:'#700353',
    position: 'absolute',
    bottom:0
  },

  pedidoBottomContentIcon:{
    width: (screenWidth - 0.1) /3,
    marginLeft: screenWidth * 0.05,
    marginTop:10,
    color:'#fff'
  },

  pedidoBottomContent:{
    width: (screenWidth - 0.1) /3,
    marginTop:13,
    color:'#fff'
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000080'
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

  ModalFormEnd: {
    backgroundColor: '#FFFFFF',
    width: screenWidth * 0.9,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft:screenWidth*0.05,
    paddingTop:10,
  },

  Item: {
    height:65,
    backgroundColor:'#fff',
    borderBottomColor:'#d5d5d5',
    borderBottomWidth:1,
    paddingTop: 10,
    paddingLeft: 10,
  },

  bordas:{
    borderBottomWidth:1,
    borderTopWidth:1,
    borderColor:'#d3d3d3',
    marginTop:10,
    marginBottom:10,
    marginLeft:15,
    marginRight:15
  },

  icone:{
    marginLeft: screenWidth * 0.025,
    marginBottom:20
  },

  secao:{
    backgroundColor:'#fff',
    width: screenWidth * 0.95,
    marginTop:5,
    marginLeft: screenWidth * 0.025,
    borderWidth:1,
    borderColor:'#d3d3d3',
    borderRadius:5
  },

  secaoLast:{
    backgroundColor:'#fff',
    width: screenWidth * 0.95,
    marginTop:5,
    marginBottom:20,
    marginLeft: screenWidth * 0.025,
    borderWidth:1,
    borderColor:'#d3d3d3',
    borderRadius:5
  },

  valores:{
    flexDirection:'column',
    backgroundColor:'#d3d3d3',
    marginTop:10,
    marginLeft: screenWidth * 0.025,
    marginBottom:10
  },

  textoRemoverEnd:{
    color:'red',
    fontSize:13,
  },

  ItemImg: {
    backgroundColor:'#fff',
    marginLeft: 8,
  },

  inputLogin:{
    width:screenWidth * 0.2,
    borderColor: '#484848', 
    borderWidth: 1,
    borderRadius:5,
    padding:5
  },

  labelLogin:{
    color:'#471a88',
    marginLeft: screenWidth * 0.05,
    marginBottom:3,
  },

  textTitle: {
    fontSize:16,
    marginTop:10,
    fontWeight:'bold',
    color:'#12299B'
  },

  textDesc: {
    fontSize: 15,
    marginLeft: screenWidth * 0.025,
    fontWeight:'normal',
  },

  textDescBold: {
    fontSize: 15,
    marginLeft: screenWidth * 0.025,
    fontWeight:'bold'
  },


  textAdicionar: {
    fontSize: 16,
    marginLeft:8,
    color:'#fff',
  },

  textDescNoticia: {
    fontSize: 14,
    paddingTop:5,
    marginRight:5,
    justifyContent:'center'
  },

  textDescFechado: {
    fontSize: 12,
    paddingTop:5,
    color:'red'
  },

  textDescPrinc2: {
    fontSize: 14,
    fontWeight:'bold',
  },

  containerMaisMenos:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#471a88',
    borderRadius:5,
    width:screenWidth*0.3,
    height:40,
    marginLeft: screenWidth * 0.05,
    marginTop:15
  },

  containerAdicionar:{
    backgroundColor:'#700353',
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#fff',
    borderRadius:5,
    width:screenWidth*0.575,
    height:40,
    marginLeft: screenWidth * 0.025,
    marginTop:15
  },

  containerGeral:{
    flexDirection:'row',
  },

  containerColumn:{
    flexDirection:'column',
    marginLeft: screenWidth * 0.025,
  },
  
  containerColumnComplemento:{
    flexDirection:'column',
    marginLeft: screenWidth * 0.025,
    marginRight:35
  },

  botaomais:{
    marginLeft:10,
    marginTop:8,
  },

  botaomenos:{
    marginLeft:10,
    marginRight:8,
    marginTop:8,
  },

  botaoadicionar:{
    marginLeft:10,
    marginTop:8,
    flexDirection:'row',
    width:'100%'
  },

  imgContainer:{
    width:screenWidth *0.2,
    marginTop:5
  },

  imagem:{
    width:screenWidth *0.95,
    height:screenWidth *0.25,
    borderRadius:5,
    borderColor:'#d3d3d3',
    borderWidth:3
  },

  txtContainer:{
    width:screenWidth *0.97,
    marginTop:5,
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

  textItem:{
    fontSize:18,
    marginLeft:screenWidth*0.05,
    marginTop:10,
    marginBottom:5
  },

  textItemDesc:{
    fontSize:12,
    marginLeft:screenWidth*0.025,
    color:'#595959'
  },

  textItemSubValor:{
    fontSize:15,
    color:'#808080',
    marginBottom:3
  },

  textItemSubValorRight:{
    fontSize:15,
    color:'#808080',
    marginBottom:3,
    textAlign: 'right'
  },

  viewDireita:{
    flexDirection:'row',
    width:'50%',
    alignItems:'flex-end',
  },

  viewEsquerda:{
    flexDirection:'row',
    width:'50%',
    alignItems:'flex-start',
  },

  textItemValor:{
    fontSize:16,
    fontWeight:'bold',
    color:'#595959',
  },

  textDestaques:{
    fontSize:16,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginBottom:10,
    marginTop: 10
  },

  textDestaquesLink:{
    fontSize:12,
    fontWeight:'bold',
    color:'#794F9B',
    marginLeft:screenWidth*0.01,
    marginBottom:10,
    marginTop: 12
  },

  textDestaquesValores:{
    fontSize:16,
    fontWeight:'bold',
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop: 10
  },

  textDestaquesCardapio:{
    fontSize:15,
    color:'#484848',
    marginLeft:screenWidth*0.025,
    marginTop: 10,
  },

  buttonContainerPag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginRight:15
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginRight:30
  },

  circle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ACACAC',
      alignItems: 'center',
      justifyContent: 'center',
  },

  checkedCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#794F9B',
  },

  valorDireita: {
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:'bold'
},

  btnAdicionar:{
    width: screenWidth * 0.80,
    marginLeft: screenWidth * 0.05,
    marginTop: 5,
    marginBottom:5,
    borderRadius:6,
  },

  textoAdicionar:{
    color:'#471a88',
    textAlign:'center',
    fontSize:16,
  },

  btnEntrar:{
    width: screenWidth * 0.80,
    backgroundColor:'#471a88',
    padding:6,
    marginLeft: screenWidth * 0.08,
    marginTop: 15,
    marginBottom:10,
    borderRadius:6,
  },

  textoEntrar:{
    color:'#fff',
    textAlign:'center',
    fontSize:18,
  },

  txtPedido:{
    fontSize:17,
    fontWeight:'600',
    color:'#fff',
    marginHorizontal:16
  },

  btnEntrarModal:{
    width: screenWidth * 0.8,
    borderWidth:1,
    backgroundColor:'#471a88',
    borderColor:'#fff',
    padding:6,
    marginTop: 10,
    borderRadius:6,
    marginBottom: 5
  },

  btnEntrarModal2:{
    width: screenWidth * 0.8,
    borderWidth:1,
    backgroundColor:'#794F9B',
    borderColor:'#fff',
    padding:6,
    marginTop: 2,
    borderRadius:6,
    marginBottom: 5
  },

})