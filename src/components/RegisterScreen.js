'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

class RegisterScreen extends Component {

	_onPress() {
    
  }

  render() {
    return (
      <View>
        <TouchableHighlight 
          style={{height: 40, marginTop: 20}}
          onPress={() => { this._onPress() }}
        >
          <Text>注册</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default RegisterScreen;