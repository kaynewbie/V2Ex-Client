'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';
import utilityMethods from '../../utility/utilityMethods';

class PostHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let postInfo = this.props.postInfo;
    return (
      <View style={{flex: 1, paddingLeft: 10, paddingTop: 5, paddingRight: 10, paddingBottom: 5, backgroundColor: 'white'}}>
      	<Text style={{fontSize: 16, marginBottom: 5}}>{postInfo.title}</Text>
      	<View style={{flexDirection: 'row', alignItems: 'center'}}>
      		<Image source={{ uri: `https:${postInfo.member.avatar_normal}` }} style={{width: 16, height: 16, borderRadius: 8}}/>
      		<Text style={{marginLeft: 5, fontSize: 12}}>{postInfo.member.username}</Text>
      		<View style={{justifyContent: 'center', alignItems: 'flex-end', flex: 1}}>
      			<Text style={{fontSize: 12}}>{`${utilityMethods.formatTime(postInfo.last_modified)}，${postInfo.replies}回复`}</Text>
      		</View>
      	</View>
        <Text style={{fontSize: 14, marginBottom: 5, marginTop: 20}}>{postInfo.content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default PostHeader;