package software.sitb.react.wechat;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.common.MapBuilder;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.*;
import com.tencent.mm.opensdk.modelpay.PayResp;
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
      ),
      "scene", MapBuilder.of(
        "session", SendMessageToWX.Req.WXSceneSession,
        "timeLine", SendMessageToWX.Req.WXSceneTimeline,
        "favorite", SendMessageToWX.Req.WXSceneFavorite
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
    if (null != getCurrentActivity()) {
      weChatApi.handleIntent(getCurrentActivity().getIntent(), this);
    } else {
      Log.w(TAG, "current activity is null.");
    }
    boolean result = weChatApi.registerApp(appId);
    Log.d(TAG, "向微信注册APP, result = " + result);
  }

  @ReactMethod
  public void share(ReadableMap options, Promise promise) {
    if (!options.hasKey("scene")) {
      Log.e(TAG, "微信分享失败,不正确的分享场景");
      promise.reject("3000", "微信分享失败,不正确的分享场景");
      return;
    }

    if (!options.hasKey("type")) {
      Log.e(TAG, "微信分享失败,不正确的类型");
      promise.reject("3001", "不正确的消息类型");
      return;
    }

    ShareType type = ShareType.values()[options.getInt("type")];
    if (null == type) {
      Log.e(TAG, "微信分享失败,不正确的类型");
      promise.reject("3001", "不正确的消息类型");
      return;
    }

    WXMediaMessage message = new WXMediaMessage();
    if (options.hasKey("title")) {
      message.title = options.getString("title");
    }
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
      case WEBPAGE: {
        WXWebpageObject webpageObject = new WXWebpageObject();
        if (!options.hasKey("webPageUrl")) {
          Log.e(TAG, "微信分享失败,缺少webPageUrl");
          promise.reject("3001", "缺少webPageUrl");
          return;
        }
        webpageObject.webpageUrl = options.getString("webPageUrl");
        message.mediaObject = webpageObject;
        break;
      }
    }

    SendMessageToWX.Req req = new SendMessageToWX.Req();
    req.scene = options.getInt("scene");
    req.message = message;
    req.transaction = UUID.randomUUID().toString();
    boolean success = weChatApi.sendReq(req);
    promise.resolve(success);
  }

  @Override
  public void onReq(BaseReq baseReq) {
    Log.d(TAG, "onReq transaction -> " + baseReq.transaction);
  }

  @Override
  public void onResp(BaseResp baseResp) {
    Log.d(TAG, "onResp transaction -> " + baseResp.transaction);
    WritableMap map = Arguments.createMap();
    map.putInt("errCode", baseResp.errCode);
    map.putString("errStr", baseResp.errStr);
    map.putString("openId", baseResp.openId);
    map.putString("transaction", baseResp.transaction);

    if (baseResp instanceof SendAuth.Resp) {
      SendAuth.Resp resp = (SendAuth.Resp) (baseResp);

      map.putString("type", "SendAuth.Resp");
      map.putString("code", resp.code);
      map.putString("state", resp.state);
      map.putString("url", resp.url);
      map.putString("lang", resp.lang);
      map.putString("country", resp.country);
    } else if (baseResp instanceof SendMessageToWX.Resp) {
      SendMessageToWX.Resp resp = (SendMessageToWX.Resp) (baseResp);
      map.putString("type", "SendMessageToWX.Resp");
    } else if (baseResp instanceof PayResp) {
      PayResp resp = (PayResp) (baseResp);
      map.putString("type", "PayReq.Resp");
      map.putString("returnKey", resp.returnKey);
    }

    sendEvent("WeChatResp", map);
  }

  public enum ShareType {
    TEXT,
    IMAGE,
    MUSIC,
    VIDEO,
    WEBPAGE
  }

}
