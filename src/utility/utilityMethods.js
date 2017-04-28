'use strict';

/**
 * 工具类
 */
class UtilityMethods { 
	/**
	 * 格式化 GET 请求的 URL
	 * @param  {[type]} url    域名
	 * @param  {[type]} params 参数 
	 * @return {[type]}        形如：https://www.v2ex.com/css/desktop.css?v=3.9.7.5
	 */
	static formatGetURL(url, params) {
		let paramsArray = [];
	  Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])));
	  if (url.search(/\?/) === -1) {
	      url += '?' + paramsArray.join('&');
	  } else {
	      url += '&' + paramsArray.join('&');
	  }
	  return url;
	}

	/**
   * 格式化 POST 参数
   * 适用于 content-type=application/x-www-form-urlencoded; charset=utf-8
   */
  static toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  }

  /**
   * 格式化 GET URL
   * @return 形式：https://www.v2ex.com/t/356064
   */
  static formatGetHTMLURL(url, param) {
  	let lastChar = url.charAt(url.length-1);
  	if (lastChar !== '/') {
  		url += '/';
  	}
  	// for (let aParam in params) {
  	// 	url += aParam + '/';
  	// }
  	url += param;
  	return url;
  }

  /**
   * 格式化日期，用于显示帖子最新回复时间
   * @param  string timeStamp [description]
   * @return string
   * 1分钟前：*秒前
   * 1小时内：*分钟前
   * 24小时内：*小时前
   * 7天内：*天前
   * 7天外：****-**-**
   */
  static formatTime(timeStamp) {

    let millisecond = timeStamp+'000';
    // 当前时间 currentTime
    let currentTime = Date.now();
    // 时间差值 currentTime - timeStamp
    let timeInterval = currentTime - millisecond;

    var timeLog;
    let oneMin = 60 * 1000;
    if (timeInterval < oneMin && timeInterval > 0) {
      timeLog = `${parseInt(timeInterval / 1000, 10)}秒前`;
    } else if (timeInterval < oneMin * 60) {
      timeLog = `${parseInt(timeInterval / 1000 / 60, 10)}分钟前`;
    } else if (timeInterval < oneMin * 60 * 24) {
      timeLog = `${parseInt(timeInterval / 1000 / 60 / 60, 10)}小时前`;
    } else if (timeInterval < oneMin * 60 * 24 * 7) {
      timeLog = `${parseInt(timeInterval / 1000 / 60 / 60 / 24, 10)}天前`;
    } else {
      var date = new Date(parseInt(millisecond, 10));
      timeLog = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    return timeLog;
  }
}

export default UtilityMethods;