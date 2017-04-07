import { NativeModules, Platform } from 'react-native';


const config = {
  webApiKey: '',
  iosApiKey: '',
  androidApiKey: ''
};

const convertUrl = 'http://restapi.amap.com/v3/assistant/coordinate/convert?coordsys=gps&key=';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/4/6
 */
export default class AmapLocation {

  static setApiKey({webApiKey, androidApiKey}) {
    config.webApiKey = webApiKey;
    config.androidApiKey = androidApiKey;
    if (Platform.OS === 'android') {
      NativeModules.AmapLocation.setApiKey(androidApiKey);
    }
  }

  /**
   * 高德定位SDK获取当前的地理位置
   * @param success 成功回调函数
   * @param error 失败回调函数
   * @param options 参数
   */
  static getCurrentPosition(success: Function, error: Function, options) {
    if (Platform.OS === 'android') {
      NativeModules.AmapLocation.getCurrentPosition(options, success, error);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        fetch(`${convertUrl}${config.webApiKey}&locations=${position.coords.longitude},${position.coords.latitude}`)
          .then(res => res.json())
          .then(res => {
            if (res.status === '1') {
              const tmp = res.locations.split(',');
              const result = {
                ...position
              };
              result.coords.longitude = tmp[0];
              result.coords.latitude = tmp[1];
              success && success(result);
            } else {
              error && error({
                code: res.infocode,
                message: res.info
              });
            }
          })
          .catch(err => error && error(err));
      }, error, options);
    }
  }

}
