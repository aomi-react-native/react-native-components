package software.sitb.react.amap;

import android.util.Log;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.facebook.react.bridge.*;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/4/6
 */
public class AmapLocation extends DefaultReactContextBaseJavaModule {

  private static final String TAG = "AMAP";

  public AmapLocation(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "AmapLocation";
  }

  @ReactMethod
  public void setApiKey(String key) {
    Log.d(TAG, "设置API KEY");
    AMapLocationClient.setApiKey(key);
  }

  @ReactMethod
  public void getCurrentPosition(ReadableMap options, final Callback success, final Callback error) {
    new GuardedAsyncTask<Void, Integer>(getReactApplicationContext()) {
      @Override
      protected void doInBackgroundGuarded(Void... voids) {
        //初始化client
        final AMapLocationClient locationClient = new AMapLocationClient(getReactApplicationContext());
        //设置定位参数
        locationClient.setLocationOption(getDefaultOption());
        // 设置定位监听
        locationClient.setLocationListener(new AMapLocationListener() {

          @Override
          public void onLocationChanged(AMapLocation location) {
            if (null == location) {
              Log.e(TAG, "获取定位信息失败");
              error.invoke("获取定位信息失败");
            } else if (location.getErrorCode() == 0) {
              Log.d(TAG, "获取定位信息成功->" + location.toString());
              WritableMap result = Arguments.createMap();
              WritableMap coords = Arguments.createMap();
              coords.putDouble("latitude", location.getLatitude());
              coords.putDouble("longitude", location.getLongitude());
              coords.putDouble("accuracy", location.getAccuracy());

              result.putMap("coords", coords);
              result.putDouble("timestamp", location.getTime());

              success.invoke(result);
            } else {
              Log.e(TAG, "location Error, ErrCode:" + location.getErrorCode() + ", errInfo:" + location.getErrorInfo());
              WritableMap result = Arguments.createMap();
              result.putInt("code", location.getErrorCode());
              result.putString("message", location.getErrorInfo());
              error.invoke(result);
            }
            locationClient.stopLocation();
          }
        });
        locationClient.startLocation();
      }
    }.execute();
  }

  /**
   * 默认的定位参数
   *
   * @author hongming.wang
   * @since 2.8.0
   */
  private AMapLocationClientOption getDefaultOption() {
    AMapLocationClientOption mOption = new AMapLocationClientOption();
    mOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
    mOption.setGpsFirst(true);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
    mOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
    mOption.setInterval(2000);//可选，设置定位间隔。默认为2秒
    mOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
    mOption.setOnceLocation(false);//可选，设置是否单次定位。默认是false
    mOption.setOnceLocationLatest(false);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
    AMapLocationClientOption.setLocationProtocol(AMapLocationClientOption.AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
    mOption.setSensorEnable(false);//可选，设置是否使用传感器。默认是false
    mOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
    mOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
    return mOption;
  }

}
