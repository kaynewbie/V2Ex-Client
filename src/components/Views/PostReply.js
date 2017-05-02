'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import utilityMethods from '../../utility/utilityMethods';

const imageURL = 'https://v2ex.assets.uxengine.net/gravatar/dd664d0b55f66cd936ac5e0df37327c2?s=73&d=retro';

class PostReply extends Component {
  render() {
  	let replyInfo = this.props.replyInfo;
    return (
    	<View style={{backgroundColor: 'white'}}>
	      <View style={[styles.borderBottom, styles.container, {flexDirection: 'row', flex: 1}]}>
					<Image
						source={{uri: 'https:' + replyInfo.member.avatar_normal}}
						style={{width: 24, height: 24, borderRadius: 3}}
					/>
					<View style={{flex: 1, marginLeft: 10}}>
						<View style={{flex: 1, flexDirection: 'row'}}>
							<Text style={{marginRight: 10}}>{replyInfo.member.username}</Text>
							<Text style={{fontSize: 10, color: 'gray'}}>{utilityMethods.formatTime(replyInfo.last_modified)}</Text>
						</View>
						<Text style={{flex: 1}}>{replyInfo.content}</Text>
					</View>
				</View> 
			</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 10
	},
	borderBottom: {
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 0.5,
		borderColor: '#C8C7CC',
		marginLeft: 8
	}
});


export default PostReply;