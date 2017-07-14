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
public class ScreenshotListenerModule extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "ScreenshotListener";

    private ServiceConnection serviceConnection;

    public ScreenshotListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SitbScreenshotListenerModule";
    }

    @ReactMethod
    public void startListener() {
        serviceConnection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                Log.d(TAG, "ScreenshotListenerService Connected");
            }

            @Override
            public void onServiceDisconnected(ComponentName componentName) {
                Log.d(TAG, "ScreenshotListenerService Disconnected");
            }
        };
        Intent intent = new Intent(getReactApplicationContext().getCurrentActivity(), ScreenshotListenerService.class);
        intent.setAction(ScreenshotListenerService.class.getName());
        getReactApplicationContext().bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void stopListener() {
        if (null != serviceConnection) {
            getReactApplicationContext().unbindService(serviceConnection);
        }
    }

}
