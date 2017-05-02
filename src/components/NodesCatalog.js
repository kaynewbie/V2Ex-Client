'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ListView,
  Text,
  Dimensions,
} from 'react-native';
import allNodes from '../../resources/allNodes';

const headerTitles = [ "分享与探索", "V2EX", "iOS", "Geek", "游戏", "Apple", "生活", "Internet", "城市", "品牌"];

/**
 * 节点目录从本地文件加载
 */
class NodesCatalog extends Component {
	static navigationOptions = {
		title: '节点',
		header: {
			visible: false,
		},
	};

	constructor(props) {
	  super(props);
		
	  this.state = {
	  	dataArray: [],
	  	dataSource: new ListView.DataSource({
	  		rowHasChanged: this._dataChanged,
	  		sectionHeaderHasChanged: this._dataChanged,
	  	}),
	  };
	}

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 64, top: 0, left: 0, right: 0}}>
        	<View style={styles.header}>
  	  			<View style={{height: 35, width: 53, paddingTop: 8, paddingLeft: 8, paddingBottom: 8, paddingRight: 8, justifyContent: 'center', alignItems: 'center'}}>
  	  				<Text style={{fontSize: global.headerFontSize, textAlign: 'center'}}>节点</Text>
  		  		</View>
  	  		</View>
        </View>
      	<ListView 
      		dataSource={this.state.dataSource.cloneWithRowsAndSections(this.state.dataArray)}
      		renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
      		renderSectionHeader={(sectionData, sectionId) => this._renderHeader(sectionData, sectionId)}
      		enableEmptySections={true}
      		contentContainerStyle={styles.collection}
      		pageSize={this._nodesCount.bind(this)()}
      	/>
      </View>
    );
  }

  componentDidMount() {
  	this.setState({
  		dataArray: allNodes,
  	});
  }

  _dataChanged(oldValue, newValue) {
  	return (oldValue !== newValue);
  }

  _renderRow(rowData, sectionId, rowId) {
  	return (
  		<View style={styles.cell}>
  			<Text
  				onPress={() => {
  					this._nodeSelected.bind(this)(rowData);
  				}}
  			>
  				{rowData.name}
  			</Text>
  		</View>
  	);
  }

  _renderHeader(sectionData, sectionId) {
  	return (
      <View style={{height: 20, width: Dimensions.get('window').width, justifyContent: 'center', paddingLeft: 10, backgroundColor: '#e4e3eb'}}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>{headerTitles[sectionId]}</Text>
      </View>
    );
  }

  // 节点数量总计，保证一次渲染全部节点
  _nodesCount() {
  	var count = 0;
  	this.state.dataArray.forEach((subArray, index, array) => {
  		count += subArray.length;
  	});
  	return count;
  }

  /**
   * 选中某个节点
   * @param  string title 节点标题
   */
  _nodeSelected(rowData) {
  	const { navigate } = this.props.navigation;
  	navigate('PersonalPosts', rowData);
  }
}

const styles = StyleSheet.create({
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
	collection: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	cell: {
		margin: 5,
		paddingTop: 3,
		paddingLeft: 8,
		paddingBottom: 3,
		paddingRight: 8,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f7f9fb',
	},
});


export default NodesCatalog;