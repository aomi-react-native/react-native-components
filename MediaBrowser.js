import { NativeModules } from 'react-native';

const {
  SitbRCTMediaBrowserModule: {
    sourceType,
    mediaType,
    launchImageLibrary
  }
} = NativeModules;


const DEFAULT_OPTIONS = {
  sourceType: sourceType.savedPhotosAlbum
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/29
 */
class MediaBrowser {

  static launchImageLibrary(options = DEFAULT_OPTIONS) {
    return launchImageLibrary(options);
  }

}


export {
  MediaBrowser as default,
  sourceType,
  mediaType
};
