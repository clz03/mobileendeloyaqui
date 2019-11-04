import React from 'react';
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from './pages/Home';
import Reward from './pages/Reward';
import Register from './pages/Register';
import AccountLogged from './pages/AccountLogged';
import Login from './pages/Login';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Search from './pages/Search'; 
import Detail from './pages/Detail';

const PagesNavigator = createStackNavigator({
  Search:{
    screen: Search,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Estabelecimentos',
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

const Accountnavigator = createStackNavigator({
  Register:{
    screen: Register,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Cadastre-se',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff',
      headerLeft: null
    },
  },
  AccountLogged:{
    screen: AccountLogged,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Meu Perfil',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff',
      headerLeft: null
    },
  },
  Login:{
    screen: Login,
    navigationOptions: {
      headerStyle: {backgroundColor:'#471a88'},
      headerTitle:'Meu Perfil',
      headerTitleStyle: {color:'#fff'},
      headerTintColor: '#fff'
    },
  },
},{
  initialRouteName:'Register'
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
        Reward:{
          screen: Cupomnavigator,
          navigationOptions: {
            title: 'Cupons',
            tabBarIcon: ({ focused, tintColor }) => {
              return <Icon name='style' size={24} color={tintColor} />;
            },
          },
        },
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
          screen: Accountnavigator,
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