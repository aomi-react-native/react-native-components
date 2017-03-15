import { NativeModules, Platform } from 'react-native';

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
  allowsEditing: false
};

const DEFAULT_CAMERA_OPTIONS = {
  sourceType: SourceType.camera,
  mediaType: MediaType.image,
  cameraType: CameraType.back,
  allowsEditing: false,
  quality: Quality.high
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/29
 */
class MediaManager {

  static launchImageLibrary(options: Options = DEFAULT_LIBRARY_OPTIONS): Promise {
    const newOptions = Object.assign({}, DEFAULT_LIBRARY_OPTIONS, options);
    return launchImageLibrary(newOptions);
  }

  static launchCamera(options = DEFAULT_CAMERA_OPTIONS): Promise {
    const newOptions = Object.assign({}, DEFAULT_CAMERA_OPTIONS, options);
    if (Platform.OS === 'android' && newOptions.allowsEditing) {
      return new Promise((resolve, reject) => {
        launchCamera(newOptions).then(image => {
          setTimeout(() => {
            NativeModules.SitbRCTMediaManager.launchEditing(image.original.path)
              .then(edited => {
                resolve(Object.assign({}, image, edited));
              })
              .catch(err => reject(err));
          }, 1);
        })
          .catch(err => reject(err));
      });
    }
    return launchCamera(newOptions);
  }

}


export {
  MediaManager as default,
  SourceType,
  MediaType,
  CameraType,
  Quality
};
