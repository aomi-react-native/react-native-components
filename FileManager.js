import {
  NativeModules,
  Platform
} from 'react-native';


const SitbRNFileManager = NativeModules.SitbRNFileManager;


/**
 * file manger
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/6
 */

class RNFileManager {

  static getPhotoByUri(uri:String) {
    if (Platform.OS === 'android') {
      return SitbRNFileManager.getPhotoByContentUri(uri);
    }
  }

}


export default RNFileManager;

