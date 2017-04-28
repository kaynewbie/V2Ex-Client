'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

// 导航栏组件
class NavigationBar extends Component {
  render() {
    return (
      <View style={{height: 64, top: 0, left: 0, right: 0}}>
      	<View style={styles.header}>
      	</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	header: {
		left: 0,
		top: 0,
		right: 0,
		height: 63.5,
		backgroundColor: '#FAFAFA',
		justifyContent: 'flex-end',
		alignItems: 'center',
		shadowColor: '#B2B2B2',
		shadowOpacity: 1,
		shadowRadius: 0.5,
		shadowOffset: {
			height: 0.5,
		},
	},
});


export default NavigationBar;