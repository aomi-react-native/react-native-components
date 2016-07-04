import {
  NativeModules,
  Platform
} from 'react-native';

const {
  SitbRCTMediaManager: {
    SourceType,
    MediaType,
    CameraType,
    Quality,
    launchImageLibrary,
    launchCamera
  }
} = NativeModules;


type Options = {
  sourceType: SourceType,
  mediaType: MediaType,
  allowsEditing: Boolean,
  cameraType: CameraType,
  quality: Quality
};

const DEFAULT_LIBRARY_OPTIONS = {
  sourceType: SourceType.savedPhotosAlbum,
  mediaType: MediaType.image,
  allowsEditing: false,
  quality: Quality.high
};

const DEFAULT_CAMERA_OPTIONS = {
  sourceType: SourceType.camera,
  cameraType: CameraType.back,
  quality: Quality.VGA1280x720
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/29
 */
class MediaBrowser {

  static launchImageLibrary(options:Options = DEFAULT_LIBRARY_OPTIONS):Promise {
    const newOptions = Object.assign({}, DEFAULT_LIBRARY_OPTIONS, options);
    return launchImageLibrary(newOptions);
  }

  static launchCamera(options = DEFAULT_CAMERA_OPTIONS):Promise {
    const newOptions = Object.assign({}, DEFAULT_CAMERA_OPTIONS, options);
    if (Platform.OS === 'android' && newOptions.allowsEditing) {
      return new Promise((resolve, reject)=> {
        launchCamera(newOptions).then(original=> {
          setTimeout(()=> {
            NativeModules.SitbRCTMediaManager.launchEditing(original.path)
              .then(edited => {
                resolve({
                  original,
                  edited
                });
              })
              .catch(err => reject(err));
          }, 1);
        })
          .catch(err=> reject(err));
      });
    }
    return launchCamera(newOptions);
  }

}


export {
  MediaBrowser as default,
  SourceType,
  MediaType,
  CameraType
};
