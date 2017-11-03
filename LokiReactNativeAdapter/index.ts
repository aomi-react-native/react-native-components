import { AsyncStorage } from 'react-native';


/**
 * Loki JS 数据库ReactNative 适配器
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/23
 */
export default class LokiReactNativeAdapter {

  loadDatabase(dbname, callback) {
    AsyncStorage.getItem(dbname)
      .then(data => callback(data))
      .catch(err => {
        console.error(`open ${dbname} error.`, err);
        callback(new Error(err));
      });
  }

  saveDatabase(dbname, serialized, callback) {
    AsyncStorage.setItem(dbname, serialized, callback);
  }

  deleteDatabase(dbname, callback) {
    AsyncStorage.removeItem(dbname, callback);
  }

}
