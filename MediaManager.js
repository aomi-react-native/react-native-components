import { NativeModules } from 'react-native';

const {
  SitbRCTMediaManager: {
    sourceType,
    mediaType,
    launchImageLibrary
  }
} = NativeModules;


type Options = {
  sourceType: Number,
  mediaType: String,
  allowsEditing: Boolean
};

const DEFAULT_OPTIONS = {
  sourceType: sourceType.savedPhotosAlbum,
  mediaType: mediaType.Image,
  allowsEditing: false
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/29
 */
class MediaBrowser {

  static launchImageLibrary(options:Options = DEFAULT_OPTIONS) {
    return launchImageLibrary(options);
  }

}


export {
  MediaBrowser as default,
  sourceType,
  mediaType
};
