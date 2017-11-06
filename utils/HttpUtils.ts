/**
 * url 中的查询参数转换为object
 * @param queryStr
 */
function queryUrlToObj(queryStr) {
  let tmp = queryStr.replace(/&/g, '","');
  tmp = decodeURI(tmp.replace(new RegExp('=', 'g'), '":"'));
  if (tmp === '') {
    return {};
  }
  console.log(`{"${tmp}"}`);
  return JSON.parse(`{"${tmp}"}`);
}

const URL_PATTERN = /(http|ftp|https):\/\/.*/;

/**
 * @author Sean(sean.snow@live.com)
 * @date 2017/2/21
 */
export default class HttpUtils {

  static isUrl(url) {
    return URL_PATTERN.test(url);
  }

  /**
   * 获取浏览器URL中的参数
   * @returns {{}} 返回一个Object对象
   */
  static getQueryArgs() {
    let tmp = location.search.substr(1);
    return queryUrlToObj(tmp);
  }

  static queryToObjectWithUrl(url) {
    let tmp = url.substr(url.indexOf('?') + 1);
    return queryUrlToObj(tmp);
  }

  static urlArgs(params: Object): String {
    if (!params) {
      return '';
    }
    return Object.keys(params)
      .map(key => {
        let value = params[key];
        if (typeof value === 'undefined') {
          value = '';
        } else if (value === 0) {
          value = '0';
        } else if (value === false) {
          value = 'false';
        }

        return `${key}=${value}`;
      })
      .join('&');
  }

}
