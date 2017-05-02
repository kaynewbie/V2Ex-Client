'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ListView,
  TouchableHighlight,
  Text,
  Image,
} from 'react-native';
import utilityMethods from '../utility/utilityMethods';

const postsURL = 'http://www.v2ex.com/api/topics/show.json';

class PersonalPosts extends Component {
	static navigationOptions = {
		title: ({ state }) => {
      let title = state.params.username ? state.params.username+'的帖子' : '帖子';
      if (state.params.username) {
        title = state.params.username + '的帖子';
      } else if (state.params.name) {
        title = state.params.name;
      } else {
        title = '帖子';
      }
      return title;
    },
	}

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataArray: [],
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.state.dataArray)}
          renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
          enableEmptySections={true}
        >
        </ListView>
      </View>
    );
  }

  componentDidMount() {
    this._fetchPostData();
  }

  _fetchPostData() {
    let params = this._createFetchParams();
    fetch(utilityMethods.formatGetURL(postsURL, params))
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "error") {
          alert(json.message);
        } else {
          this.setState({
            dataArray: json,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  _createFetchParams() {
    var params = new Object();
    const { state } = this.props.navigation;
    if (state.params.username) {
      params.username = state.params.username;
    } else if (state.params.title) {
      params.node_name = state.params.title;
    }
    return params;
  }

  _renderRow(rowData, rowId) {
    return (
      <TouchableHighlight onPress={() => { 
        this._cellClicked(rowData, rowId);
      }}>
        <View style={{backgroundColor: 'white'}}>
          <View style={[styles.row, styles.borderBottom]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around'}}>
              <Text style={{flex: 1, fontSize: 16, color: 'black'}}>{rowData.title}</Text>
              <Image 
                source={{uri: global.schemeName+':'+rowData.member.avatar_normal}}
                style={styles.thumb}
              />
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
              <Text style={{fontSize: 10, color: '#696969', width: 200}}>{utilityMethods.formatTime(rowData.last_modified)}</Text>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{fontSize: 10, color: '#696969'}}>{rowData.member.username}</Text>
                <View style={{justifyContent: 'center', marginLeft: 3, backgroundColor: '#328ac2', paddingLeft: 3, paddingRight: 3, borderRadius: 2}}>
                  <Text style={{fontSize: 10, color: '#f7f9fb'}}>{rowData.node.title}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _cellClicked(rowData, rowId) {
    const { navigate } = this.props.navigation;
    navigate('PostDetails', { postInfo: rowData });
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 3
  },
  borderBottom: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderColor: '#C8C7CC',
    marginLeft: 8
  }
});


export default PersonalPosts;