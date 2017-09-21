package software.sitb.react.utils;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import com.facebook.react.bridge.*;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/6/1
 */
public class DeviceManager extends DefaultReactContextBaseJavaModule {

  private static final String TAG = "DeviceManager";

  public DeviceManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "SitbDeviceManager";
  }


  @ReactMethod
  public void getDeviceInfo(Promise promise) {

    WritableMap response = Arguments.createMap();
    try {
      PackageInfo info = getReactApplicationContext().getPackageManager()
        .getPackageInfo(getReactApplicationContext().getPackageName(), 0);
      response.putString("packageName", info.packageName);
      response.putInt("versionCode", info.versionCode);
      response.putString("versionName", info.versionName);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }

    response.putString("systemName", "Android");
    response.putString("systemVersion", Build.VERSION.RELEASE);
    response.putString("model", Build.MODEL);
    response.putString("name", Build.DISPLAY);
    response.putString("localizedModel", Build.MODEL);
    response.putString("identifier", "");
    response.putInt("sdkInt", Build.VERSION.SDK_INT);
    promise.resolve(response);
  }
}
