import {
  CameraRoll as RNCameraRoll,
  NativeModules,
  Platform,
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/4/18
 */
export default class CameraRoll {
  /**
   * Saves the photo or video to the camera roll / gallery.
   *
   * the tag can be any image URI (including local, remote asset-library and base64 data URIs)
   * or a local video file URI (remote or data URIs are not supported for saving video at this time).
   *
   * If the tag has a file extension of .mov or .mp4, it will be inferred as a video. Otherwise
   * it will be treated as a photo. To override the automatic choice, you can pass an optional
   * `type` parameter that must be one of 'photo' or 'video'.
   *
   * Returns a Promise which will resolve with the new URI.
   */
  static saveToCameraRoll(
    tag: string,
    type?: 'photo' | 'video'
  ): Promise<Object> {
    if (Platform.OS === 'android') {
      return NativeModules.SitbCameraRollManager.saveToCameraRoll(tag, type);
    }
    return RNCameraRoll.saveToCameraRoll(tag, type);
  }
}
