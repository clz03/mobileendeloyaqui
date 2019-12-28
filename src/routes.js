import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from './pages/Home';
import Reward from './pages/Reward';
import Register from './pages/Register';
import AccountLogged from './pages/AccountLogged';
import Login from './pages/Login';
import ForgotPwd from './pages/ForgotPwd';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Search from './pages/Search'; 
import Detail from './pages/Detail';
// import TelUteis from './pages/TelUteis';
import Delivery from './pages/Delivery';
import Pedido from './pages/Delivery/pedido';
import ItemPedido from './pages/Delivery/itemPedido';

const PagesNavigator = createStackNavigator({
  Search:{
    screen: Search,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      title:'Estabelecimentos',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
  Detail:{
    screen: Detail,
    navigationOptions: {
      header: null,
    },
  },
  Home:{
    screen: Home,
    navigationOptions: {
      header: null,
      headerBackTitle: 'Voltar'
    },
  },
},{
  initialRouteName:'Home'
});

const DeliveryNavigator = createStackNavigator({
  Delivery:{
    screen: Delivery,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Pedido Delivery',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
  Pedido:{
    screen: Pedido,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Cardápio Online - Pedido',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
  itemPedido:{
    screen: ItemPedido,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Item Pedido',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
},{
  initialRouteName:'Delivery'
});

const Cupomnavigator = createStackNavigator({
  Reward:{
    screen: Reward,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Cupom Semanal',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
},{
  initialRouteName:'Reward'
});

const Newsnavigator = createStackNavigator({
  News:{
    screen: News,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Notícias',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
  NewsDetail:{
    screen: NewsDetail,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Detalhe da Notícia',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
},{
  initialRouteName:'News'
});

// const TelUteisnavigator = createStackNavigator({
//   TelUteis:{
//     screen: TelUteis,
//     navigationOptions: {
//       headerStyle: {backgroundColor:'#471a88'},
//       headerTitle:'Telefones Úteis',
//       headerTitleStyle: {color:'#fff'},
//       headerTintColor: '#fff'
//     },
//   }
// },{
//   initialRouteName:'TelUteis'
// });

const Accountnavigator = createSwitchNavigator({
  Register:{
    screen: Register
  },
  AccountLogged:{
    screen: AccountLogged
  },
  Login:{
    screen: Login
  },
  ForgotPwd:{
    screen: ForgotPwd
  }
},{
  initialRouteName:'Login'
})

const AccountnavigatorStack = createStackNavigator({
  Account:{
    screen: Accountnavigator,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Meu Perfil',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff',
    },
  }
})

const Routes = createAppContainer(
    createBottomTabNavigator({
      Home:{
          screen: PagesNavigator,
          navigationOptions: {
            title: 'Pesquisar',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='search' size={24} color={tintColor} />;
            },
          },
        },
        Delivery:{
          screen: DeliveryNavigator,
          navigationOptions: {
            title: 'Delivery',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='motorcycle' size={24} color={tintColor} />;
            },
          },
        },
        Reward:{
          screen: Cupomnavigator,
          navigationOptions: {
            title: 'Cupons',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='style' size={24} color={tintColor} />;
            },
          },
        },
        // TelUteis:{
        //   screen: TelUteisnavigator,
        //   navigationOptions: {
        //     title: 'Serv. Úteis',
        //     tabBarIcon: ({ focused, tintColor }) => {
        //       return <Icon name='call' size={24} color={tintColor} />;
        //     },
        //   },
        // },
        News:{
          screen: Newsnavigator,
          navigationOptions: {
            title: 'Notícias',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='location-city' size={24} color={tintColor} />;
            },
          },
        },
        Account:{
          screen: AccountnavigatorStack,
          navigationOptions: {
            title: 'Meu Perfil',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='account-box' size={24} color={tintColor} />;
            },
          },
        }
    }, {
        tabBarOptions: {
            activeTintColor: '#000',
            labelStyle: {
              fontSize: 11,
            },
            style: {
              backgroundColor: '#fff',
            },
          }
    }),

);

export default Routes;