'user strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';

import tabItemFirst from './src/components/tabItemFirst';
import tabItemSecond from './src/components/tabItemSecond';
import PostDetails from './src/components/PostDetails';
import LoginController from './src/components/LoginController';
import RegisterScreen from './src/components/RegisterScreen';
import PersonalPosts from './src/components/PersonalPosts';
import PersonalReplies from './src/components/PersonalReplies';
import NodesCatalog from './src/components/NodesCatalog';

// --- 全局配置 --- //
global.schemeName = "https";
global.host = "www.v2ex.com";
// 顶部导航栏字体大小
global.headerFontSize = 18;


// 底部导航
const bottomNavi = TabNavigator({
  Posts: { screen: tabItemFirst },
  NodesCatalog: { screen: NodesCatalog },
  Profile: { screen: tabItemSecond },
}, {
	tabBarPosition: 'bottom',
});

/**
 * 配置顶部导航
 * @RouteConfigs          route键值对
 * @StackNavigatorConfig  导航栏配置
 */
const mixNavi = StackNavigator({
  Root: { screen: bottomNavi },
  PostDetails: { screen: PostDetails },
  PersonalPosts: { screen: PersonalPosts },
  PersonalReplies: { screen: PersonalReplies },
}, {
  headerMode: 'screen',
});

/**
 * 登录相关页面导航
 * @type {[type]}
 */
const loginRelateNavi = StackNavigator({
  LoginController: { screen: LoginController },
  RegisterScreen: { screen: RegisterScreen },
}, {
  mode: 'card',
});

const modalScreens = StackNavigator({
  MixNavi: { screen: mixNavi },
  AccountOperation: { screen: loginRelateNavi },
}, {
  headerMode: 'screen',
  mode: 'modal',
  navigationOptions: {
    header: {
      visible: false,
    },
    // 禁止 modal screen 下拉返回手势
    cardStack: {
        gesturesEnabled: false,
      },
  }
})

AppRegistry.registerComponent('NavigationProject', () => modalScreens);