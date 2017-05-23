import { NativeModules } from 'react-native';

const {WeChatManager} = NativeModules;


type TypeProps = {
  text: Number,
  image: Number,
  music: Number,
  video: Number,
  webPage: Number
};

type Options = {
  type: TypeProps,
  text: String,
  description: String,
  mediaTagName: String,
  messageAction: String,
  messageExt: String,
  image: String,
  thumbImageSize: Number,
  webPageUrl: String
};

export const Type: TypeProps = WeChatManager.type;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/5/17
 */
class WeChat {

  /**
   * 向微信注册
   * @param appId appId
   */
  static registerApp(appId: String) {
    return WeChatManager.registerApp(appId);
  }

  /**
   * 分享给指定的用户
   * @param options 分享参数
   */
  static shareToSession(options: Options) {
    return WeChatManager.shareToSession(options);
  }

  /**
   * 分享到朋友圈
   * @param options 分享参数
   */
  static shareToTimeLine(options: Options) {
    return WeChatManager.shareToTimeLine(options);
  }

}

export default WeChat;
