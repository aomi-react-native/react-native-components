package software.sitb.react.screenshot;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/7/14
 */
public class ScreenshotManager extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "ScreenshotManager";

    private ServiceConnection serviceConnection;

    public ScreenshotManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SitbScreenshotManager";
    }

    @ReactMethod
    public void startListener() {
        serviceConnection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                Log.d(TAG, "ScreenshotManager Connected");
            }

            @Override
            public void onServiceDisconnected(ComponentName componentName) {
                Log.d(TAG, "ScreenshotManager Disconnected");
            }
        };
        Intent intent = new Intent(getReactApplicationContext().getCurrentActivity(), ScreenshotManagerService.class);
        intent.setAction(ScreenshotManagerService.class.getName());
        getReactApplicationContext().bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void stopListener() {
        if (null != serviceConnection) {
            getReactApplicationContext().unbindService(serviceConnection);
        }
    }

}
