'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Button,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import UtilityMethods from '../utility/utilityMethods';

const loginURL = "https://www.v2ex.com/signin";

var DomParser = require('react-native-html-parser').DOMParser;
class LoginController extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      username: '',
      password: '',
    };
  }

	static navigationOptions = {
    title: '登录',
		header: ({ goBack }) => {
      let left = (
        <Button
          title={`取消`}
          color='#ee6383'
          onPress={() => goBack(null)}
        />
      );
      return { left };
		},
	};

  /**
   * 获取登录所需：用户名的键；密码的键
   */
  _findLoginKeysInHTML(html) {
    var textName, passwordName;

    let body = html.getElementsByTagName("body")[0];
    let inputNodes = body.getElementsByTagName("input");
    for (var i = 0; i < inputNodes.length; i++) {
      let aNode = inputNodes.item(i);
      let att = aNode.getAttribute("type");
      if (att === "text") {
        textName = aNode.getAttribute("name");
      } else if (att === "password") {
        passwordName = aNode.getAttribute("name");
      }
    }
    return {
      'uKey': textName, 
      'pKey': passwordName,
    };
  }

  /**
   * 登录所需 onceString
   */
  _findLoginOnceString(html) {
    var onceString;

    let body = html.getElementsByTagName("body")[0];
    let inputNodes = body.getElementsByTagName("input");
    for (var i = 0; i < inputNodes.length; i++) {
      let aNode = inputNodes.item(i);
      let att = aNode.getAttribute("name");
      if (att === "once") {
        onceString = aNode.getAttribute("value");
      }
    }
    return onceString;
  }

  /**
   * 登录 v2ex
   * @return {[type]} [description]
   */
  _login() {
    let username = this.state.username;
    let password = this.state.password;

    /**
     * 预登录，不需要参数，只是获取 html
     * GET
     */
    fetch(loginURL)
      .then((response) => response.text())
      .then((response) => {
        // 1.解析 html
        let doc = new DomParser().parseFromString(response, 'text/html');
        let loginKeys = this._findLoginKeysInHTML(doc);
        let requestBody = {
          [loginKeys['uKey']]: username,          // 属性名如果使用 变量 的情况，用 [] 取出变量的值，否则属性名是变量名
          [loginKeys['pKey']]: password,
          once: this._findLoginOnceString(doc),
          next: "/",
        };
        let params = UtilityMethods.toQueryString(requestBody);
        
        // 2.进行实际的登录操作
        fetch(loginURL, {
          method: 'POST',
          headers: {
            'Referer': 'https://v2ex.com/signin',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C89',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
          body: params,
        })
          .then((response) => response.text())
          .then((response) => {
            let index = response.indexOf("/notifications");
            // 3.登录结果
            if (index >= 0) {
              // 成功，返回上一页
              // 返回参数：用户名，用于获取用户资料
              this.props.navigation.state.params.callBack(username);
              const {goBack} = this.props.navigation;
              goBack(null);
            } else {// 失败
              console.log("Login exception");
            }
          })
          .catch((error) => {
            console.log(error);
          })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <ScrollView style={{flex: 1, paddingLeft: 10}}>
        <Text style={{marginTop: 30, marginBottom: 10, fontSize: 18}}>Log in to V2EX</Text>
        <View >
          <TextInput 
            style={styles.textInput}
            onChangeText={( text ) => {
              this.setState({ username: text });
            }}
            placeholder="Phone"
          />
          <TextInput 
            style={styles.textInput}
            onChangeText={( text ) => {
              this.setState({ password: text });
            }}
            placeholder="Password"
          />
        </View>
        <TouchableHighlight 
          onPress={() => { this._login() }}
          underlayColor={'#fcfcfb'}
          style={{ height: 40, marginTop: 10, marginRight: 10, backgroundColor: '#ee6383', borderRadius: 3, justifyContent: 'center' }}
        >
          <Text style={{color: '#fcfcfb', textAlign: 'center'}}>登 录</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderBottomWidth: 1,
  },
  button: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 3,
  }
});

export default LoginController;