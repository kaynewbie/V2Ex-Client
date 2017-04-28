'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Button,
  Image,
  Text,
  ListView,
  ActivityIndicator,
  TouchableHighlight,
  RefreshControl,
  Animated,
} from 'react-native';
import PostDetails from './PostDetails';
import FadeInView from './Views/FadeInView';
import NavigationBar from './Views/NavigationBar';
import UtilityMethods from '../utility/utilityMethods';

const latestPostURL = 'https://www.v2ex.com/api/topics/latest.json';
const hotestPostURL = 'http://www.v2ex.com/api/topics/hot.json';

let postTypeEnum = {
	latest: "最新",
	hotest: "最热",
};

class tabItemFirst extends Component {
	static navigationOptions = { 
		title: '首页',
		header: {
			visible: false,
		},
	};

	constructor(props) {
		  super(props);

	  // rowHasChanged 只更新变化的行
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  let options = [postTypeEnum.latest, postTypeEnum.hotest];
	  var categoryOptions = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(options);
	  /**
	   * 类属性
	   * @type dataSource
	   * @type headerIsRefreshing 是否正在刷新
	   * @type postType 帖子分类
	   * @type opacity 分类选项视图透明度
	   */
	  this.state = {
	  	dataSource: ds,
	  	headerIsRefreshing: false,
	  	postType: "0",
	  	isShow: false,
	  	catogoryOptDs: categoryOptions,
	  	isLoading: false,
	  	// 动画
	  	opacity: new Animated.Value(0),
	  	arrowRotate: new Animated.Value(0),
	  };
	}

	_cellClicked(rowData, rowId) {
		const { navigate } = this.props.navigation;
		navigate('PostDetails', { postInfo: rowData });
	}

	_renderRow(rowData, rowId) {
		let timeLog = UtilityMethods.formatTime(rowData.last_modified);
		return (
			<TouchableHighlight onPress={() => { 
				this._cellClicked(rowData, rowId) 
			}}>
				<View style={styles.row}>
					<View style={{flex: 1, flexDirection: 'row-reverse', alignItems: 'flex-start'}}>
						<Image 
							source={{uri: "https:" + rowData.member.avatar_normal}}
							style={styles.thumb}
						/>
						<Text 
							style={{fontSize: 16, color: 'black', flex: 1}}
						>
							{rowData.title}
						</Text>
					</View>
					<View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
						<Text style={{fontSize: 10, color: '#696969', width: 100}}>{timeLog}</Text>
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
							<Text style={{fontSize: 10, color: '#696969'}}>{rowData.member.username}</Text>
							<View style={{justifyContent: 'center', marginLeft: 3, backgroundColor: '#328ac2', paddingLeft: 3, paddingRight: 3, borderRadius: 2}}>
								<Text style={{fontSize: 10, color: '#f7f9fb'}}>{rowData.node.title}</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	/**
	 * 拉去最新帖子数据
	 * @return {[type]} [description]
	 */
	_fetchLatestPosts(postType) {
		this.setState({
			isLoading: true,
		});
		fetch(this._currentPostType(postType).url)
			.then((reseponse) => reseponse.json())
			.then((json) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(json),
					headerIsRefreshing: false,
					isLoading: false,
				});
				this.listView.scrollTo({y: 0, animated: false});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ 
					headerIsRefreshing: false,
					isLoading: false,
				});
			});
	}

	/**
	 * 刷新页面
	 */
	_onRefresh() {
		this.setState({ headerIsRefreshing: true });
		this._fetchLatestPosts();
	}

	/**
	 * 选择帖子分类
	 */
	_headerClickedChoosePostType() {
		this._categoryOptionsAnimation();
	}

	_categoryOptionsAnimation() {
		let opacity = this.state.isShow ? 0 : 1;
		this.state.opacity.setValue(this.state.isShow);
		let rotation = this.state.arrowRotate.setValue(0);
		Animated.parallel([
			Animated.timing(
				this.state.opacity,
				{
					toValue: opacity,
				}
				),
			Animated.timing(
				this.state.arrowRotate, 
				{
					toValue: 0.5,
					duration: 300,
				}
				)
		]).start();

		this.setState({
			isShow: !this.state.isShow,
		});
	}

	/**
	 * 选中一个分类
	 * 消失动画
	 * 请求该分类下帖子
	 */
	_selectPostCategory(rowData, rowId) {
		this._categoryOptionsAnimation();
		// 是在下一个 runloop 刷新页面
		this.setState({
			postType: rowId,
		});
		this._fetchLatestPosts(rowId);
	}

	_renderCategoryOption(rowData, rowId) {
		return (
			<TouchableHighlight 
				style={{height: 40, alignItems: 'center', justifyContent: 'center'}}
				onPress={() => {
					this._selectPostCategory.bind(this)(rowData, rowId);
				}}
			>
				<Text style={{color: "white"}}>{rowData}</Text>
			</TouchableHighlight>
		);
	}

	_currentPostType(postType) {
		var title;
		var url;
		switch (postType ? postType : this.state.postType) {
			case "0":
				title = postTypeEnum.latest;
				url = latestPostURL;
				break;
			case "1":
				title = postTypeEnum.hotest;
				url = hotestPostURL;
				break;
			case "2":
				title = postTypeEnum.favorite;
				url = favoritePostURL;
				break;
			default:
		}
		return {
			title: title,
			url: url,
		};
	}

	render() {
		return (
		  	<View style={{flex: 1}}>
		  		<View style={{height: 65, top: 0, left: 0, right: 0}}>
			  		<View style={styles.header}>
			  			<TouchableHighlight
			  				underlayColor={'#CFCFCF'}
				  			style={{height: 35, width: 80}}
			  				onPress={this._headerClickedChoosePostType.bind(this)}
			  			>
			  				<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 8, paddingLeft: 8, paddingBottom: 8, paddingRight: 8}}>
			  					<Text style={{textAlign: 'center', fontSize: global.headerFontSize, marginRight: 3}}>{this._currentPostType().title}</Text>
			  					<Animated.Image
			  						style={{width: 8, height: 8, transform: [{rotateX: this.state.arrowRotate.interpolate({
			  							inputRange: [0, 1],
			  							outputRange: ['0deg', '360deg']
			  						})}]}}
			  						source={require('../images/arrow@2x.png')}
			  					/>
			  				</View>
			  			</TouchableHighlight>
			  			<ActivityIndicator
			  				animating={this.state.isLoading}
			  				style={{right: 10, height: 35, position: 'absolute'}}
			  			/>
		  			</View>
		  		</View>
		  		<ListView
		  			ref={(listView) => this.listView = listView}
		  			dataSource={ this.state.dataSource }
		  			renderRow={(rowData, sectionId, rowId) => this._renderRow.bind(this)(rowData, rowId)}
		  			refreshControl={
		  				<RefreshControl
		  					refreshing={this.state.headerIsRefreshing}
		  					onRefresh={() => {
		  						this._onRefresh();
		  					}}
		  					title='Loading'
		  					progressBackgroundColor='#ffff00'
		  				/>
		  			}
		  		>
		  		</ListView>
		  		{this.state.isShow ? <Animated.View style={{opacity: this.state.opacity, top: 65, left: 0, bottom: 0, right: 0, position: 'absolute'}}>
		  													<View style={styles.categoryOptions}>
			  													<ListView 
			  														style={{flex: 1}}
			  														dataSource={this.state.catogoryOptDs}
			  														renderRow={(rowData, sectionId, rowId) => this._renderCategoryOption(rowData, rowId)}
			  													>
			  													</ListView>
		  													</View>
		  												</Animated.View> : null}
		  	</View>
		);
	}
	// 推荐网络请求
	componentDidMount() {
		 this._fetchLatestPosts();
	}
}

const styles = StyleSheet.create({
	header: {
		left: 0,
		top: 0,
		right: 0,
		height: 64.5,
		opacity: 1,
		backgroundColor: 'rgba(250, 250, 250, 0.9)',
		justifyContent: 'flex-end',
		alignItems: 'center',
		shadowColor: '#B2B2B2',
		shadowOpacity: 1,
		shadowRadius: 0.5,
		shadowOffset: {
			height: 0.5,
		},
	},
	icon: {
		width: 26,
		height: 26,
	},
	row: {
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: '#F6F6F6',
	},
	thumb: {
		width: 25,
		height: 25,
		borderRadius: 3,
	},
	categoryOptions: {
		position: 'absolute',
		width: 100,
		backgroundColor: 'rgba(35, 35, 35, 0.9)',
		alignSelf: 'center',
		borderRadius: 2,
	},
});


export default tabItemFirst;