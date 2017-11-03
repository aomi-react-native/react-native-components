import { DeviceEventEmitter, GeolocationError, GeoOptions, NativeModules, Platform } from 'react-native';


const config = {
  webApiKey: '',
  iosApiKey: '',
  androidApiKey: ''
};

const convertUrl = 'http://restapi.amap.com/v3/assistant/coordinate/convert?coordsys=gps&key=';

const ANDROID_EVENT = 'amapWatchPosition';

let watchId = 0;
const watchFunc = {};

function gpsToAmap(position, success, error) {
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
}

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
  static getCurrentPosition(success: Function, error?: (error: GeolocationError) => void, options?: GeoOptions) {
    if (Platform.OS === 'android') {
      const onPosition = (payload) => {
        if (payload.success) {
          success && success(payload);
        } else {
          error && error(payload);
        }
        DeviceEventEmitter.removeListener(ANDROID_EVENT, onPosition);
      };

      DeviceEventEmitter.addListener(ANDROID_EVENT, onPosition);
      NativeModules.AmapLocation.getCurrentPosition(options);
    } else {
      navigator.geolocation.getCurrentPosition(position => gpsToAmap(position, success, error), error, options);
    }
  }

  static watchPosition(success: Function, error?: (error: GeolocationError) => void, options?: GeoOptions) {
    if (Platform.OS === 'android') {
      const onPosition = (payload) => {
        if (payload.success) {
          success && success(payload);
        } else {
          error && error(payload);
        }
      };

      DeviceEventEmitter.addListener(ANDROID_EVENT, onPosition);

      watchId += 1;
      watchFunc[watchId] = onPosition;

      NativeModules.AmapLocation.watchPosition(options, watchId);
      return watchId;
    }
    return navigator.geolocation.watchPosition(position => gpsToAmap(position, success, error), error, options);
  }

  static clearWatch(id) {
    if (Platform.OS === 'android') {
      const onPosition = watchFunc[id];
      if (onPosition) {
        NativeModules.AmapLocation.clearWatch(id);
        Reflect.deleteProperty(watchFunc, id);
      }
    } else {
      navigator.geolocation.clearWatch(id);
    }
  }

}
