package software.sitb.react.orientation;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.SensorManager;
import android.util.Log;
import android.view.OrientationEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 田尘殇Sean(sean.snow@live.com) Create At 16/8/7
 */
public class OrientationManager extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "OrientationManager";

    private int currentOrientation = -1;

    private OrientationEventListener orientationListener;

    public OrientationManager(ReactApplicationContext reactContext) {
        super(reactContext);
        orientationListener = new OrientationEventListener(reactContext, SensorManager.SENSOR_DELAY_NORMAL) {
            @Override
            public void onOrientationChanged(int orientation) {
                Log.d(TAG, "当前orientation=>" + orientation);
                if (((orientation >= 0) && (orientation <= 45)) || (orientation >= 315) || ((orientation >= 135) && (orientation <= 225))) {
                    //portrait
                    Log.d(TAG, "Screen orientation changed from Landscape to Portrait!");
//                    currentOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
                } else if (((orientation > 45) && (orientation < 135)) || ((orientation > 225) && (orientation < 315))) {
                    //landscape
                    Log.d(TAG, "Screen orientation changed from Portrait to Landscape!");
//                    currentOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
                }
            }
        };


    }

    @Override
    public String getName() {
        return "SitbRCTOrientationManager";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("Orientation",
                MapBuilder.of(
                        "unknown", ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED,
                        "portrait", ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
                        "portraitUpsideDown", Configuration.ORIENTATION_PORTRAIT,
                        "landscapeLeft", ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE,
                        "landscapeRight", ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE,
                        "faceUp", ActivityInfo.SCREEN_ORIENTATION_SENSOR,
                        "faceDown", ActivityInfo.SCREEN_ORIENTATION_SENSOR
                )
        );
        return constants;
    }

    @ReactMethod
    public void setOrientation(Integer orientation, Boolean lock) {
        if (null != orientation && this.currentOrientation != orientation) {
            this.currentOrientation = orientation;
            Activity activity = this.getCurrentActivity();
            assert activity != null;
            activity.setRequestedOrientation(orientation);
        }
    }

    @ReactMethod
    public void setOrientationToDefault() {
        Activity activity = this.getCurrentActivity();
        assert activity != null;
        activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_USER);
    }

    /**
     * 获取当前屏幕方向
     *
     * @param promise JS 异步回调
     */
    @ReactMethod
    public void getOrientation(Promise promise) {
        promise.resolve(this.currentOrientation);
    }

    @ReactMethod
    public void startOrientationChangeListener() {
        if (orientationListener.canDetectOrientation()) {
            orientationListener.enable();
        }
    }

    @ReactMethod
    public void stopOrientationChangeListener() {
        orientationListener.disable();
    }
}
