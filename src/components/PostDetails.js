'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ListView,
  Text,
  Image,
  RefreshControl,
} from 'react-native';
import PostHeader from './Views/PostHeader';
import PostReply from './Views/PostReply';
import UtilityMethods from '../utility/utilityMethods';

const page_size = 10;

// https://www.v2ex.com/api/replies/show.json?topic_id=356219
const replyURL = "https://www.v2ex.com/api/replies/show.json";

class PostDetails extends Component {
	static navigationOptions = {
		title: ({ state }) => state.params.postInfo.title,
	};

	constructor(props) {
	  super(props);
	  // 用 postInfo 实例化 dataSource
	  var postInfo = props.navigation.state.params.postInfo;
	  var data = [ postInfo ];
		var dataSource = new ListView.DataSource({rowHasChanged: (oldValue, newValue) => oldValue !== newValue})
		/**
		 * [state description]
		 * @type {Object} data 保存的源数据
		 * @type {Object} dataSource 表视图中展示的数据
		 * @type int currentPage 当前获取到的回复页码
		 */
	  this.state = {
	  	data: data,
	  	dataSource: dataSource.cloneWithRows( data ),
	  	page: 1,
	  };
	}

	render() {
		return (
		  <ListView
		  	style={{flex: 1}}
		  	dataSource={ this.state.dataSource }
		  	renderRow={(rowData, sectionID, rowID) => {
		  		return this._renderRow(rowData, rowID);
		  	}}
		  	onEndReached={() => {
		  		this._pullUpToLoadMore.bind(this);
		  	}}
		  />
		);
	}

	componentDidMount() {
		this._loadReplies();
	}

	_renderRow(rowData, rowID) {
		if (rowID === "0") {// header
			return ( <PostHeader postInfo={rowData}/> );
		} else {// reply
			return ( <PostReply replyInfo={rowData}/> );
		}
	}

	_pullUpToLoadMore() {
		let currentPage = this.state.page + 1;
		this.setState({
			page: currentPage,
		});
		this._loadReplies();
	}

	_loadReplies() {
		let params = {
			topic_id: this.props.navigation.state.params.postInfo.id,
			page: this.state.currentPage,
			page_size: page_size,
		};
    let url = UtilityMethods.formatGetURL(replyURL, params);
		fetch(url)
			.then((response) => response.json())
			.then((response) => {
				if (response.length) {
					let tmp = this.state.data;
					tmp = tmp.concat(response);
					this.setState({
						data: tmp,
						dataSource: this.state.dataSource.cloneWithRows(tmp),
					});
				} else if (this.state.page > 1) {
					let currentPage = this.state.page - 1;
					this.setState({
						page: currentPage,
					});
				}
			})
			.catch((error) => {
				if (this.state.page > 1) {
					let currentPage = this.state.page - 1;
					this.setState({
						page: currentPage,
					});
				}
			});
	}
}

const styles = StyleSheet.create({
	
});


export default PostDetails;

