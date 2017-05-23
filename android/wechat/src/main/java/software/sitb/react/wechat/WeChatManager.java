package software.sitb.react.wechat;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.*;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import javax.annotation.Nullable;
import java.io.IOException;
import java.net.URL;
import java.util.Map;
import java.util.UUID;

/**
 * @author Sean sean.snow@live.com createAt 2017/5/23
 */
public class WeChatManager extends DefaultReactContextBaseJavaModule implements IWXAPIEventHandler {

  private static final String TAG = "WeChatManager";

  private IWXAPI weChatApi;

  public WeChatManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "WeChatManager";
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    return MapBuilder.<String, Object>of(
      "type", MapBuilder.of(
        "text", ShareType.TEXT.ordinal(),
        "image", ShareType.IMAGE.ordinal(),
        "music", ShareType.MUSIC.ordinal(),
        "video", ShareType.VIDEO.ordinal(),
        "webPage", ShareType.WEBPAGE.ordinal()
      )
    );
  }

  /**
   * 向微信注册APP
   *
   * @param appId   微信app id
   * @param promise js 异步回调
   */
  @ReactMethod
  public void registerApp(String appId, Promise promise) {
    weChatApi = WXAPIFactory.createWXAPI(getReactApplicationContext(), appId, true);
    boolean result = weChatApi.registerApp(appId);
    Log.d(TAG, "向微信注册APP, result = " + result);
  }

  @ReactMethod
  public void shareToSession(ReadableMap options, Promise promise) {
    share(options, SendMessageToWX.Req.WXSceneSession, promise);
  }

  @ReactMethod
  public void shareToTimeLine(ReadableMap options, Promise promise) {
    share(options, SendMessageToWX.Req.WXSceneTimeline, promise);
  }

  private void share(ReadableMap options, int scene, Promise promise) {
    if (!options.hasKey("type")) {
      Log.e(TAG, "微信分享失败,不正确的类型");
      promise.reject("3000", "不正确的消息类型");
      return;
    }

    ShareType type = ShareType.values()[options.getInt("type")];
    if (null == type) {
      Log.e(TAG, "微信分享失败,不正确的类型");
      promise.reject("3000", "不正确的消息类型");
      return;
    }


    WXMediaMessage message = new WXMediaMessage();
    if (options.hasKey("description")) {
      message.description = options.getString("description");
    }
    if (options.hasKey("mediaTagName")) {
      message.mediaTagName = options.getString("mediaTagName");
    }
    if (options.hasKey("messageAction")) {
      message.messageAction = options.getString("messageAction");
    }
    if (options.hasKey("messageExt")) {
      message.messageExt = options.getString("messageExt");
    }

    if (options.hasKey("image")) {
      try {
        Bitmap bitmap = BitmapFactory.decodeStream(new URL(options.getString("image")).openStream());
        message.setThumbImage(bitmap);
      } catch (IOException e) {
        Log.e(TAG, "设置图片失败", e);
      }
    }

    switch (type) {
      case TEXT:
        WXTextObject textObject = new WXTextObject();
        textObject.text = options.getString("text");
        message.mediaObject = textObject;
        break;
      case IMAGE:
        WXImageObject imageObject = new WXImageObject();
        imageObject.imageData = message.thumbData;
        message.mediaObject = imageObject;
        break;
      case MUSIC:
        WXMusicObject musicObject = new WXMusicObject();
        musicObject.musicUrl = "";
        message.mediaObject = musicObject;
        break;
      case VIDEO:
        break;
      case WEBPAGE:
        WXWebpageObject webpageObject = new WXWebpageObject();
        webpageObject.webpageUrl = options.getString("webPageUrl");
        message.mediaObject = webpageObject;
        break;
    }

    SendMessageToWX.Req req = new SendMessageToWX.Req();
    req.scene = scene;
    req.message = message;
    req.transaction = UUID.randomUUID().toString();
    weChatApi.sendReq(req);
  }

  @Override
  public void onReq(BaseReq baseReq) {

  }

  @Override
  public void onResp(BaseResp baseResp) {

  }

  public enum ShareType {
    TEXT,
      IMAGE,
      MUSIC,
      VIDEO,
      WEBPAGE
  }
}
