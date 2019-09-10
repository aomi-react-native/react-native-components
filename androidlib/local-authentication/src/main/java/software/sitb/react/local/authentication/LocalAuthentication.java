package software.sitb.react.local.authentication;

import android.os.Handler;
import android.os.HandlerThread;
import android.support.v4.hardware.fingerprint.FingerprintManagerCompat;
import android.support.v4.os.CancellationSignal;
import android.util.Log;
import com.facebook.react.bridge.*;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/9/30
 */
public class LocalAuthentication extends DefaultReactContextBaseJavaModule {

  private static final String TAG = "SitbLA";

  private static final String EVENT_NAME = "receiveAuthentication";

  private static final int NO_ENROLLED_FINGERPRINTS = 1;

  private Handler handler;

  private CancellationSignal cancellationSignal;


  public LocalAuthentication(ReactApplicationContext reactContext) {
    super(reactContext);
    HandlerThread threadHandler = new HandlerThread("SitbLocalAuthentication");
    threadHandler.start();
    handler = new Handler(threadHandler.getLooper());
  }

  @Override
  public String getName() {
    return "SitbLocalAuthentication";
  }

  /**
   * 是否支持指纹识别
   *
   * @param promise 回调结果
   */
  @ReactMethod
  public void supportBiometrics(Promise promise) {
    FingerprintManagerCompat managerCompat = FingerprintManagerCompat.from(getReactApplicationContext());
    if (managerCompat.isHardwareDetected()) { //判断设备是否支持
      Log.d(TAG, "设备支持指纹");
      promise.resolve(true);
    } else {
      Log.w(TAG, "设备不支持指纹");
      promise.reject("EXCEPTION", "设备不支持指纹");
    }
  }

  @ReactMethod
  public void fingerprintValidate() {
    FingerprintManagerCompat managerCompat = FingerprintManagerCompat.from(getReactApplicationContext());
    if (!managerCompat.hasEnrolledFingerprints()) {
      Log.e(TAG, "没有注册指纹");
      send("EXCEPTION", NO_ENROLLED_FINGERPRINTS, "没有注册指纹");
      return;
    }
    cancellationSignal = new CancellationSignal();
    managerCompat.authenticate(null, 0, cancellationSignal, new AuthenticationCallback(), handler);
  }

  /**
   * 取消指纹识别
   */
  @ReactMethod
  public void cancelFingerprintValidate() {
    if (null != cancellationSignal && !cancellationSignal.isCanceled()) {
      Log.d(TAG, "停止指纹监听");
      cancellationSignal.cancel();
    }
  }

  private class AuthenticationCallback extends FingerprintManagerCompat.AuthenticationCallback {

    @Override
    public void onAuthenticationError(int errMsgId, CharSequence errString) {
      Log.e(TAG, "onAuthenticationError. 错误代码:" + errMsgId + ",错误消息:" + errString);
      switch (errMsgId) {
        case 5:
          break;
        default:
          send("ERROR", errMsgId, errString.toString());
          break;
      }
    }

    @Override
    public void onAuthenticationHelp(int helpMsgId, CharSequence helpString) {
      Log.i(TAG, "onAuthenticationHelp. 帮助代码:" + helpMsgId + ",帮助消息:" + helpString);
      send("HELP", helpMsgId, helpString.toString());
    }

    @Override
    public void onAuthenticationSucceeded(FingerprintManagerCompat.AuthenticationResult result) {
      Log.d(TAG, "验证成功");
      send("SUCCESS", 0, "验证成功");
    }

    @Override
    public void onAuthenticationFailed() {
      Log.e(TAG, "验证失败");
      send("FAILED", 0, "指纹验证失败");
    }
  }

  private void send(String event, int code, String message) {
    WritableMap data = Arguments.createMap();
    data.putString("event", event);
    data.putInt("code", code);
    data.putString("message", message);
    sendEvent(EVENT_NAME, data);
  }
}
