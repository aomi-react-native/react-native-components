package software.sitb.react.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.*;

import java.util.UUID;

import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import static android.content.Context.MODE_PRIVATE;

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

        response.putString("identifier", getPhoneSign());
        response.putString("systemName", "Android");
        response.putString("systemVersion", Build.VERSION.RELEASE);
        response.putString("model", Build.MODEL);
        response.putString("name", Build.DISPLAY);
        response.putString("localizedModel", Build.MODEL);
        response.putInt("sdkInt", Build.VERSION.SDK_INT);
        promise.resolve(response);
    }

    //获取手机的唯一标识
    public String getPhoneSign() {
        StringBuilder deviceId = new StringBuilder();
        // 渠道标志
        try {
            TelephonyManager tm = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            if (null != tm) {

                //IMEI（imei）
                String imei = tm.getDeviceId();
                if (!TextUtils.isEmpty(imei)) {
                    deviceId.append("imei");
                    deviceId.append(imei);
                    return deviceId.toString();
                }

                //序列号（sn）
                String sn = tm.getSimSerialNumber();
                if (!TextUtils.isEmpty(sn)) {
                    deviceId.append("sn");
                    deviceId.append(sn);
                    return deviceId.toString();
                }
            }
            //如果上面都没有， 则生成一个id：随机码
            String uuid = getUUID();
            if (!TextUtils.isEmpty(uuid)) {
                deviceId.append("uuid");
                deviceId.append(uuid);
                return deviceId.toString();
            }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
            deviceId.append("uuid").append(getUUID());
        }
        return deviceId.toString();
    }

    /**
     * 得到全局唯一UUID
     */
    private String uuid;

    private String getUUID() {
        SharedPreferences mShare = getReactApplicationContext().getSharedPreferences("uuid", MODE_PRIVATE);
        if (mShare != null) {
            uuid = mShare.getString("uuid", "");
        }
        if (TextUtils.isEmpty(uuid)) {
            uuid = UUID.randomUUID().toString();
            mShare.edit().putString("uuid", uuid).apply();
        }
        return uuid;
    }
}
