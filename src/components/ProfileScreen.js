'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

class ProfileScreen extends Component {
  render() {
    return (
      <View>
      	<Image
      		source='https://v2ex.assets.uxengine.net/gravatar/dd664d0b55f66cd936ac5e0df37327c2?s=73&d=retro'
      		style={{width: 80, height: 80}}
      	/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default ProfileScreen;