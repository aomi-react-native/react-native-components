package software.sitb.react.local.authentication;

import android.os.Handler;
import android.os.HandlerThread;
import android.support.v4.hardware.fingerprint.FingerprintManagerCompat;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/9/30
 */
public class LocalAuthentication extends DefaultReactContextBaseJavaModule {

  private static final String TAG = "SitbLA";

  private Handler handler;

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
  public void fingerprintValidate(Promise promise) {
    FingerprintManagerCompat managerCompat = FingerprintManagerCompat.from(getReactApplicationContext());
    if (!managerCompat.hasEnrolledFingerprints()) {
      Log.e(TAG, "没有注册指纹");
      promise.reject("", "没有注册指纹");
      return;
    }

    managerCompat.authenticate(null, 0, null, new AuthenticationCallback(promise), handler);
  }

  private static class AuthenticationCallback extends FingerprintManagerCompat.AuthenticationCallback {

    private Promise promise;

    public AuthenticationCallback(Promise promise) {
      this.promise = promise;
    }

    @Override
    public void onAuthenticationError(int errMsgId, CharSequence errString) {
      Log.e(TAG, "onAuthenticationError. 错误代码:" + errMsgId + ",错误消息:" + errString);
    }

    @Override
    public void onAuthenticationHelp(int helpMsgId, CharSequence helpString) {
      Log.i(TAG, "onAuthenticationHelp. 帮助代码:" + helpMsgId + ",帮助消息:" + helpString);
      promise.reject(helpMsgId + "", helpString.toString());
    }

    @Override
    public void onAuthenticationSucceeded(FingerprintManagerCompat.AuthenticationResult result) {
      Log.d(TAG, "验证成功");
      promise.resolve(true);
    }

    @Override
    public void onAuthenticationFailed() {
      Log.e(TAG, "验证失败");
      promise.reject("EXCEPTION", "验证失败");
    }
  }
}
