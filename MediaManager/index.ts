import { NativeModules, Platform } from 'react-native';

const {
  SitbRCTMediaManager: {
    SourceType,
    MediaType,
    CameraType,
    Quality,
    PhotoAlbumAuthorizationStatus,
    launchImageLibrary,
    launchCamera,
    getPhotoAlbumAuthorizationStatus
  }
} = NativeModules;

export interface Options {
  sourceType?: string;
  mediaType?: string;
  allowsEditing?: boolean;
  cameraType?: string;
  quality?: number;
}

export enum PhotoAlbumAuthorizationStatusType {
  /**
   * 拒绝
   */
  denied,
  /**
   * 家长控制
   */
  restricted,
  /**
   * 用户未做出选择
   */
  notDetermined,
  /**
   * 已授权
   */
  authorized
}

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

export interface PhotoAlbum {
  // 编辑后的图片
  edited?: {
    path?: string;
  };
  // 原图
  original?: {
    path?: string;
  };
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/29
 */
class MediaManager {
  /**
   *
   * @param options
   * @returns {*}
   */
  static launchImageLibrary(
    options: Options = DEFAULT_LIBRARY_OPTIONS
  ): Promise<PhotoAlbum> {
    const newOptions = Object.assign({}, DEFAULT_LIBRARY_OPTIONS, options);
    return launchImageLibrary(newOptions);
  }

  static launchCamera(options = DEFAULT_CAMERA_OPTIONS): Promise<PhotoAlbum> {
    const newOptions = Object.assign({}, DEFAULT_CAMERA_OPTIONS, options);
    if (Platform.OS === 'android' && newOptions.allowsEditing) {
      return new Promise((resolve, reject) => {
        launchCamera(newOptions)
          .then(image => {
            setTimeout(() => {
              NativeModules.SitbRCTMediaManager.launchEditing(
                image.original.path
              )
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

  /**
   * 获取相册授权状态
   * ios
   */
  static getPhotoAlbumAuthorizationStatus(): Promise<PhotoAlbumAuthorizationStatusType> {
    return getPhotoAlbumAuthorizationStatus();
  }
}

export {
  MediaManager as default,
  SourceType,
  MediaType,
  CameraType,
  Quality,
  PhotoAlbumAuthorizationStatus
};
