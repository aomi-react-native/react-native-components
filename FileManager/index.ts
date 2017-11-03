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

export default class FileManager {

  static getPhotoFromCameraRoll(uri: string) {
    if (Platform.OS === 'android') {
      return SitbRNFileManager.getPhotoByContentUri(uri);
    }
  }

}
