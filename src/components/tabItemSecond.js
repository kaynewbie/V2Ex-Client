'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  ListView,
  ScrollView,
  Button,
  TouchableHighlight,
  Text,
  AsyncStorage,
} from 'react-native';
import LoginController from './LoginController';
import PostHeader from './Views/PostHeader';
import UtilityMethods from '../utility/utilityMethods';

// username=
const userProfileURL = "https://www.v2ex.com/api/members/show.json";

const write_user_error = "write_user_error";
const read_user_error = "read_user_error";
const remove_user_error = "remove_user_error";

const defaultData = [[{}], ["帖子", "回复"]];

class tabItemSecond extends Component {
	static navigationOptions = {
		title: '个人',
		header: {
			visible: false,
		},
	};

	constructor(props) {
	  super(props);
	  let ds = new ListView.DataSource({
	  	rowHasChanged: (r1, r2) => r1 !== r2,
	  	sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
	  });
	  this.state = {
	  	data: defaultData,
	  	isLogin: false,
	  	dataSource: ds,
	  };
	}

	render() {
	  return (
	  	<View style={{flex: 1}}>
	  		<View style={{height: 64, top: 0, left: 0, right: 0}}>
		  		<View style={styles.header}>
		  			<View style={{height: 35, width: 80, paddingTop: 8, paddingLeft: 8, paddingBottom: 8, paddingRight: 8, justifyContent: 'center', alignItems: 'center'}}>
		  				<Text style={{fontSize: global.headerFontSize, textAlign: 'center'}}>我</Text>
			  		</View>
		  		</View>
	  		</View>
		    <ListView 
		    	style={{flex: 1}}
		    	dataSource={this.state.dataSource.cloneWithRowsAndSections(this.state.data)}
		    	renderRow={(rowData, sectionId, rowId) => this._renderRow.bind(this)(rowData, sectionId, rowId)}
		    	renderSectionHeader={(sectionData, sectionId) => this._renderHeader(sectionData, sectionId)}
		    >
		    </ListView>
	    </View>
	  );
	}

	componentDidMount() {
		// 检测是否有已登录用户
		AsyncStorage.getAllKeys((error, keys) => {
			if (error) {
				console.log(read_user_error + error);
			} else if (keys.length > 0) {
				const key = keys[0];
				AsyncStorage.getItem(key, (error, result) => {
					this.setState({
						data: this._formatData(JSON.parse(result)),
						isLogin: true,
					});
				});
			}
		});
	}

	/**
	 * 异步保存用户信息
	 */
	_saveUserInfoAsync(userInfo) {
		let key = 'v2ex' + userInfo.id;
		AsyncStorage.getItem(key, (error, result) => {
			if (error) {
				console.log(write_user_error + error);
				return;
			}
			if (result) {
				AsyncStorage.mergeItem(key, JSON.stringify(userInfo), (error) => {
					if (error) {
						console.log(write_user_error + error);
						return;
					} else {
						alert("保存成功");
					}
				})
			} else {
				AsyncStorage.setItem(key, JSON.stringify(userInfo), (error) => {
					if (error) {
						console.log(write_user_error + error);
						return;
					} else {
						alert("保存成功");
					}
				});
			}
		});
	}

	/**
	 * 登录回调
	 */
	_loginCallBack(username) {
		let url = UtilityMethods.formatGetURL(userProfileURL, {username: username});
		fetch(url)
			.then((response) => response.json())
			.then((json) => {
				this.setState({
					data: this._formatData(json),
					isLogin: true,
				});

				// 保存用户信息
				this._saveUserInfoAsync(json);
			})
			.catch((error) => {
				console.log(error);
			})
	}

	_profileHeaderClicked() {
		if (this.state.isLogin) {
			let userInfo = this.state.data;
			AsyncStorage.removeItem('v2ex' + userInfo.id, (error) => {
				if (error) {
					console.log(remove_user_error + error);
				}
			});
			this.setState({
				isLogin: false,
				data: this._formatData(),
			});
			alert("已经退出登录");
		} else {
			const { navigate } = this.props.navigation;
			navigate('AccountOperation', { callBack: this._loginCallBack.bind(this) });		// 绑定 this
		}
	}

	_renderRow(rowData, sectionId, rowId) {
		let str = 'sectionId='+sectionId+', rowId='+rowId+', rowData='+rowData;
		if (sectionId === "0") {
			if (this.state.isLogin && rowData.username) {
				return (
					<TouchableHighlight 
						style={{flex: 1, flexDirection: 'row'}}
						onPress={this._profileHeaderClicked.bind(this)}
					>
						<View style={{flex: 1, flexDirection: 'row'}}>
							<View style={{width: 80, paddingTop: 8, paddingLeft: 8, paddingBottom: 8, paddingRight: 8}}>
								<Image
									style={{height: 64}}
									source={{uri: global.schemeName+':'+rowData.avatar_normal}}
								/>
							</View>
							<View style={{flex: 1, paddingTop: 8, paddingBottom: 8, paddingRight: 8}}>
								<View style={{justifyContent: 'center', flex: 1}}>
									<Text style={{fontSize: 16, fontWeight: 'bold'}}>{rowData.username}</Text>
								</View>
								<View style={{justifyContent: 'center', flex: 1}}>
									<Text>{rowData.tagline}</Text>
								</View>
							</View>
						</View>
					</TouchableHighlight>
				);
			} else {
				return (
					<View style={{flex: 1, alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5}}>
						<Text style={{textAlign: 'center'}}>登录账号，获得更多体验</Text>
						<Button 
							title={'点击登录'}
							onPress={this._profileHeaderClicked.bind(this)}
						/>
					</View>
				);
			}
		} else if (sectionId === "1") {
			return (
				<TouchableHighlight onPress={() => {this._cellClickedAtRow.bind(this)(rowId)}}>
					<View style={{borderBottomWidth: 0.2, paddingTop: 8, paddingLeft: 8, paddingBottom: 8}}>
						<Text>{rowData}</Text>
					</View>
				</TouchableHighlight>
			);
		}
	}

	_renderHeader(sectionData, sectionId) {
		return (<View style={{height: 20}}></View>);
	}

	_formatData(userInfo) {
		if (userInfo) {
			return [[userInfo], ["帖子", "回复"]];
		} else {
			return defaultData;
		}
	}

	_cellClickedAtRow(rowId) {
		if (rowId === "0") {
			const { navigate } = this.props.navigation;
			let obj = this.state.data[0][0];
			navigate('PersonalPosts', { username: obj.username, userId: obj.id });
		} else if (rowId === "1") {
			const { navigate } = this.props.navigation;
			navigate('PersonalReplies');
		}
	}
}

const styles = StyleSheet.create({
	icon: {
		width: 26,
		height: 26,
	},
	avatar: {
		left: 10,
		width: 60,
		height: 60,
	},
	profileHeader: {
		top: 20, 
		height: 80,
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	header: {
		left: 0,
		top: 0,
		right: 0,
		height: 63.5,
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
});


export default tabItemSecond;

