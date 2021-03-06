import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Platform,
} from "react-native";

import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import "moment/locale/pt-br";
import {
  connect,
  disconnect,
  subscribeToNewAgenda,
} from "../../services/socket";
import * as Device from "expo-device";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
var apiLocal = "http://192.168.0.8/";
var apiCloud = "https://backendeloyaqui.herokuapp.com/";

export function isIphoneX() {
  return Platform.OS === "ios" && screenHeight >= 812;
}

export function isAndroid() {
  return Platform.OS !== "ios";
}

var servicokey = "";
var dataselecionada = "";

export default function Detail({ navigation }) {
  const [estab, setEstab] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [profid, setProfid] = useState("");
  const [servico, setServico] = useState([]);
  const [servicoid, setServicoid] = useState("");
  const [blackdates, setBlackdates] = useState([]);
  const [startdate, setStartdate] = useState("");
  const [seldate, setSeldate] = useState("");
  const [feriados, setFeriados] = useState([]);
  const [evento, setEvento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(0);

  const idestab = navigation.getParam("idestab");
  const schedule = navigation.getParam("schedule");

  const weekday = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  async function setupWebsocket() {
    disconnect();
    connect(idestab, 0);
  }

  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(28, "days"),
    },
  ];

  async function gotoCalendar(nome, idservico) {
    let dias = "";
    let datesBlacklist = [];
    var curDate;
    var curDay;
    var feriadoDay;
    var checkStart = false;
    var loadDate;

    const response = await fetch(
      "https://backendeloyaqui.herokuapp.com/profissional/" + profid
    );

    const data = await response.json();
    dias = data[0].diasemana;

    //Current Date
    //curDate = moment().day();
    //if(!dias.includes(curDate.toString())){
    //  datesBlacklist.push(moment())
    //}

    // Next 28 days
    for (let i = 0; i <= 28; ++i) {
      curDay = moment()
        .add(i, "days")
        .startOf("day")
        .toISOString()
        .substring(0, 10);
      curDate = moment().add(i, "days").day();

      if (feriados.includes(curDay)) {
        datesBlacklist.push(moment().add(i, "days"));
      } else if (!dias.includes(curDate.toString())) {
        datesBlacklist.push(moment().add(i, "days"));
      } else {
        if (!checkStart) {
          setStartdate(moment().add(i, "days"));
          setSeldate(moment().add(i, "days"));
          loadDate = moment().add(i, "days");
          checkStart = true;
        }
      }
    }
    setServicoid(idservico);
    servicokey = idservico;
    setBlackdates(datesBlacklist);
    //setNomeagenda(nome);
    loadEvento(moment(loadDate).format("YYYY-MM-DD"), profid);
    dataselecionada = moment(loadDate).format("YYYY-MM-DD");
    setPagina(2);
  }

  async function loadEvento(date, idprof) {
    setLoading(true);

    // if(idprof == '') idprof = profid;
    if (date == "") date = dataselecionada;

    const response4 = await fetch(
      //'http://192.168.0.8:8080/eventos/dia/' + date + '/' + idservico
      "https://backendeloyaqui.herokuapp.com/eventos/dia/" + date + "/" + idprof
    );

    const data4 = await response4.json();
    setEvento(data4);
    setLoading(false);
  }

  async function loadEstab() {
    const response = await fetch(
      //'http://192.168.0.8:8080/estabelecimentos/' + idestab
      "https://backendeloyaqui.herokuapp.com/estabelecimentos/" + idestab
    );

    const data = await response.json();
    setEstab(data);
    loadProfissionais();
    loadFeriados();
    setupWebsocket();
    subscribeToNewAgenda((status) => loadEvento("", profid));
  }

  async function loadFeriados() {
    var arrFeriados = [];
    let i = 0;
    const response = await fetch(
      //'http://192.168.0.8:8080/feriados/' + idestab
      "https://backendeloyaqui.herokuapp.com/feriados"
    );
    const data = await response.json();

    for (i = 0; i < data.length; i++) {
      arrFeriados.push(data[i].data.toString().substring(0, 10));
    }

    setFeriados(arrFeriados);
  }

  async function loadServico() {
    const response = await fetch(
      //'http://192.168.0.8:8080/servicos/estabelecimento/' + idestab
      "https://backendeloyaqui.herokuapp.com/servicos/profissional/" + profid
    );
    const data = await response.json();
    setServico(data);
  }

  async function loadProfissionais() {
    const response = await fetch(
      //'http://192.168.0.8:8080/servicos/estabelecimento/' + idestab
      "https://backendeloyaqui.herokuapp.com/profissional/estabelecimento/" +
        idestab
    );
    const data = await response.json();
    setProfissionais(data);
  }

  async function handleAgendamento(data, hora, status) {
    const useremail = await AsyncStorage.getItem("eloyuseremail");

    if (useremail != null) {
      if (status == "I") {
        Alert.alert(
          "Horário Indisponível",
          "por favor selecione outro horário"
        );
      } else {
        Alert.alert(
          "Confirmação",
          "Agendar para " +
            data.substring(8, 10) +
            "/" +
            data.substring(5, 7) +
            "/" +
            data.substring(0, 4) +
            " - " +
            hora +
            ":00 ?",
          [
            { text: "Não" },
            { text: "Sim", onPress: () => confirmAgendamento(data, hora) },
          ]
        );
      }
    } else {
      Alert.alert("Login", "Para agendar é preciso fazer login", [
        { text: "OK" },
        { text: "Ir para Login", onPress: () => navigation.navigate("Login") },
      ]);
    }
  }

  async function confirmAgendamento(data, hora) {
    const iduser = await AsyncStorage.getItem("eloyuserid");

    const response = await fetch(
      //'http://192.168.0.8:8080/usuarios/'+ iduser
      "https://backendeloyaqui.herokuapp.com/usuarios/" + iduser
    );

    const datareturn = await response.json();

    if (!datareturn[0].validado) {
      Alert.alert(
        "Seu cadastro ainda não está validado",
        "Por favor ative seu cadastro, verifique o e-mail recebido para ativar sua conta."
      );
      return;
    }

    setLoading(true);

    const responseApi = await fetch(
      //'http://192.168.0.8:8080/eventos', {
      "https://backendeloyaqui.herokuapp.com/eventos",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
          hora: hora,
          comentario: datareturn[0].telefone,
          idestabelecimento: idestab,
          idservico: servicoid,
          idusuario: iduser,
        }),
      }
    );

    if (responseApi.ok) {
      loadEvento(data, profid);
      Alert.alert(
        "Agendamento realizado!",
        "Gerencie seus agendamentos na aba Meu Perfil"
      );
    } else {
      const data_ret = await responseApi.json();
      loadEvento(data, profid);
      Alert.alert("Problema ao Agendar!", data_ret.error);
    }

    setLoading(false);
  }

  async function refreshList() {
    loadEvento("", profid);
  }

  useEffect(() => {
    loadEstab();

    if (schedule) {
      setTimeout(() => {
        setInitPage(2);
      }, 1500);
    }

    //returned function will be called on component unmount
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    loadServico();
  }, [profid]);

  return (
    <View style={styles.backContainer}>

      {pagina === 0 && (
        <View style={styles.container2}>
          <Text style={styles.tabTitle}>Selecione o profissional:</Text>

          <FlatList
            data={profissionais}
            keyExtractor={(profissionais) => profissionais._id}
            ListHeaderComponent={
              loading ? (
                <ActivityIndicator
                  size="large"
                  style={styles.LoadingIndicator}
                />
              ) : (
                ""
              )
            }
            renderItem={({ item }) => (
              <View style={styles.viewCardapio}>
                <TouchableHighlight
                  style={styles.ItemImg2}
                  onPress={() => {
                    setProfid(item._id);
                    setPagina(1);
                  }}
                >
                  <View>
                    <Text style={styles.textItem}>{item.nome}</Text>
                    <Text style={styles.textItemDesc2}>Disponível em:</Text>
                    <View style={styles.containersemana}>
                      {item.diasemana.map((diasemana) => (
                        <Text style={styles.textItemDesc} key={diasemana}>
                          {weekday[parseInt(diasemana)]}
                        </Text>
                      ))}
                    </View>
                    <Text></Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          />
        </View>
      )}

      {pagina === 1 && (
        <View style={styles.container2} visible="false">
          <Text style={styles.tabTitle}>
            Selecione o serviço a ser agendado:
          </Text>

          {/* // 0 DOMINGO
                          // 1 SEGUNDA
                          // 2 TERCA
                          // 3 QUARTA
                          // 4 QUINTA
                          // 5 SEXTA
                          // 6 SABADO */}

          <FlatList
            data={servico}
            keyExtractor={(servico) => servico._id}
            ListHeaderComponent={
              loading ? (
                <ActivityIndicator
                  size="large"
                  style={styles.LoadingIndicator}
                />
              ) : (
                ""
              )
            }
            renderItem={({ item }) => (
              <View style={styles.viewCardapio}>
                <TouchableHighlight
                  style={styles.ItemImg2}
                  onPress={() => {
                    gotoCalendar(item.nome, item._id);
                  }}
                >
                  <View>
                    <Text style={styles.textItem}>{item.nome}</Text>
                    <Text style={styles.textItemDesc}>{item.descr}</Text>
                    <Text style={styles.textItemDesc2}>Disponível em:</Text>
                    {/* <View style={styles.containersemana}>                                     
                                          {item.diasemana.map(diasemana => 
                                            <Text style={styles.textItemDesc} key={diasemana}>{weekday[parseInt(diasemana)]}</Text>
                                          )}
                                        </View> */}
                    <Text style={styles.textItemValor}>R${item.preco}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          />
        </View>
      )}

      {pagina === 2 && (
        <View style={styles.backContainer}>
          {/* <View style={styles.containersemana}>
                          <Text style={styles.tabTitle}>Agendar: {nomeagenda} |</Text>
                          <TouchableOpacity onPress={() => {setPagina(1); setEvento('')}}>
                            <Text style={styles.tabTitleLink}> voltar</Text>
                          </TouchableOpacity>
                        </View>
                        <Text>&nbsp;</Text> */}

          <CalendarStrip
            calendarAnimation={{ type: "sequence", duration: 30 }}
            daySelectionAnimation={{
              type: "border",
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: "white",
            }}
            style={{ height: 90, paddingTop: 8, paddingBottom: 10 }}
            calendarHeaderStyle={{ color: "black" }}
            calendarColor={"#eaeaea"}
            dateNumberStyle={{ color: "black" }}
            dateNameStyle={{ color: "black" }}
            highlightDateNumberStyle={{ color: "purple" }}
            highlightDateNameStyle={{ color: "purple" }}
            disabledDateNameStyle={{ color: "grey" }}
            disabledDateNumberStyle={{ color: "grey" }}
            startingDate={startdate}
            selectedDate={seldate}
            maxDate={moment().add(30, "days")}
            minDate={moment()}
            updateWeek={false}
            datesWhitelist={datesWhitelist}
            datesBlacklist={blackdates}
            iconContainer={{ flex: 0.1 }}
            onDateSelected={(date) => {
              loadEvento(moment(date).format("YYYY-MM-DD"), profid);
              dataselecionada = moment(date).format("YYYY-MM-DD");
            }}
          />

          <FlatList
            scrollEnabled={true}
            data={evento}
            keyExtractor={(evento) => String(evento.id)}
            refreshing={loading}
            onRefresh={refreshList}
            // ListHeaderComponent={
            //   loading ? (
            //     <Modal
            //       transparent={true}
            //       animationType={'none'}
            //       visible={loading}>
            //       <View style={styles.modalBackground}>
            //         <View style={styles.activityIndicatorWrapper}>
            //           <ActivityIndicator
            //             animating={loading} />
            //             <Text style={styles.textMenuSmall}>processando</Text>
            //         </View>
            //       </View>
            //     </Modal>
            //   ) : (
            //     ""
            //   )
            // }
            ListEmptyComponent={
              <Text style={styles.tabTitle}>
                Desculpe, o estabelecimento não possuí atendimento disponível
                nesse dia.
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor={"#d3d3d3"}
                onPress={() => {
                  handleAgendamento(item.data, item.hora, item.status);
                }}
              >
                <View style={styles.ItemAgenda}>
                  <Text style={styles.textMenu}>
                    Agendar para&nbsp;
                    {item.hora.toString().indexOf(".5") > -1
                      ? item.hora.toString().replace(".5", "") + ":30"
                      : item.hora + ":00"}
                  </Text>

                  {item.status == "D" ? (
                    <Text style={styles.textMenuGreen}>Disponível</Text>
                  ) : (
                    <Text style={styles.textMenuRed}>Agendado</Text>
                  )}
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      )}

    </View>
  );
}

var styles = StyleSheet.create({
  
  backContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },

  backImageHeader: {
    height: screenHeight * 0.3,
  },

  layer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  viewCardapio: {
    marginTop: 5,
  },

  pedidoOnline: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: screenWidth * 0.025,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#794F9B",
    borderRadius: 5,
    alignItems: "center",
  },

  ItemImg: {
    width: screenWidth,
    borderBottomColor: "#d5d5d5",
    borderBottomWidth: 1,
    marginTop: 10,
  },

  ItemImg2: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    width: screenWidth * 0.95,
    marginLeft: screenWidth * 0.025,
    marginBottom: 8,
  },

  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },

  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },

  textTitle: {
    marginTop: screenHeight * 0.05,
    color: "#fff",
    fontSize: 20,
    paddingLeft: 15,
  },

  textMenu: {
    fontSize: 13,
    color: "#000",
  },

  textMenuSmall: {
    fontSize: 10,
    color: "#000",
    alignItems: "center",
  },

  textMenuGreen: {
    fontSize: 13,
    color: "green",
  },

  textMenuRed: {
    fontSize: 13,
    color: "red",
  },

  textItem: {
    marginLeft: screenWidth * 0.025,
    marginTop: 4,
  },

  textItemDesc: {
    marginLeft: screenWidth * 0.025,
    fontSize: 11,
    color: "#595959",
  },

  textItemDesc2: {
    marginLeft: screenWidth * 0.025,
    marginTop: 8,
    fontSize: 11,
    color: "#595959",
  },

  textItemValor: {
    marginLeft: screenWidth * 0.025,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
    color: "#595959",
    borderColor: "#c3c3c3",
  },

  textoEntrar: {
    marginLeft: 5,
    marginTop: 3,
    marginBottom: 3,
  },

  tabTitleLink: {
    paddingTop: 10,
    color: "#484848",
    fontWeight: "500",
  },

  tabTitle: {
    paddingLeft: 10,
    paddingTop: 10,
    color: "#707070",
  },

  tabSub: {
    paddingLeft: 10,
    color: "#000",
  },

  tabSubRS: {
    paddingLeft: 0,
    color: "#000",
    fontSize: 11,
  },

  textDesc: {
    color: "#fff",
    fontSize: 13,
    paddingLeft: 15,
  },

  textCardapio: {
    color: "#000",
    fontSize: 13,
    marginLeft: 10,
    marginBottom: 5,
  },

  textDestaq: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
  },

  txtNoData: {
    marginLeft: 10,
    marginTop: 20,
    color: "#000",
    fontSize: 11,
  },

  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
    fontSize: 10,
  },

  containersemana: {
    flexDirection: "row",
  },

  container2: {
    flexWrap: "wrap",
    backgroundColor: "#fff",
    fontSize: 10,
  },

  scene: {
    flex: 1,
  },

  tabHeading: {
    backgroundColor: "#eaeaea",
  },

  menuItem: {
    width: screenWidth * 0.31,
    height: screenHeight * 0.12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginTop: 10,
    marginLeft: 6,
  },

  ItemAgenda: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.1,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginTop: 10,
    marginLeft: 8,
  },

  menuItemDestaq: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginTop: 10,
    marginLeft: 8,
  },

  backImageDestaq: {
    height: screenHeight * 0.15,
    width: screenWidth,
    marginTop: 10,
  },

  textbuttonBack: {
    color: "#fff",
    fontSize: 18,
  },

  buttonBack: {
    color: "#000",
    paddingLeft: 10,
    marginTop: screenHeight * 0.07,
    flexDirection: "row",
  },

  buttonBack2: {
    color: "#484848",
    paddingTop: 10,
    flexDirection: "row",
  },

  textback: {
    paddingTop: 5,
  },

  textDestaques: {
    color: "#000",
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "bold",
    width: screenWidth * 0.95,
  },

  cupomItem: {
    flexDirection: "row",
    width: screenWidth * 0.93,
    height: screenHeight * 0.15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a5a5a5",
    marginTop: 10,
    marginLeft: screenWidth * 0.03,
  },

  barraLateralVerde: {
    backgroundColor: "green",
    width: screenWidth * 0.03,
    height: "100%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  barraLateralCinza: {
    backgroundColor: "gray",
    width: screenWidth * 0.03,
    height: "100%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  ticket: {
    borderRightColor: "#e5e5e5",
    borderRightWidth: 2,
    width: screenWidth * 0.95,
  },

  ticketText: {
    color: "#5d5d5d",
    marginTop: 5,
    marginLeft: 10,
    fontWeight: "bold",
  },

  dadosTextRegras: {
    color: "#5d5d5d",
    marginLeft: 3,
    marginTop: screenHeight * 0.02,
    fontSize: 10,
  },

  imgwhats: {
    width: screenWidth * 0.09,
    height: screenWidth * 0.09,
    marginBottom: 5,
  },

  imginstagram: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    marginBottom: 5,
  },
});
