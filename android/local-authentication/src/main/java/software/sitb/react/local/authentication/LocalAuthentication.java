package software.sitb.react.local.authentication;

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

    private static final String TAG = "SitbLocalAuthentication";

    public LocalAuthentication(ReactApplicationContext reactContext) {
        super(reactContext);
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
    public void fingerprintValidate(String msg, Promise promise) {

    }
}
