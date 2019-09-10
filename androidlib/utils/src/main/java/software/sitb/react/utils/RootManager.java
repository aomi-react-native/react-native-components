package software.sitb.react.utils;


import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/6/1
 */
@ReactModule(name = RootManager.MODULE_NAME)
public class RootManager extends DefaultReactContextBaseJavaModule {

    public static final String MODULE_NAME = "SitbRootManager";

    private static final String TAG = "ROOT_MANAGER";

    private static final String BIN_PATH = "/system/bin/su";

    private static final String X_BIN_PATH = "/system/xbin/su";

    private Boolean isRoot = null;

    public RootManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void isRoot(Promise promise) {
        if (null != isRoot) {
            promise.resolve(isRoot);
            return;
        }
        if (new File(BIN_PATH).exists() && isCanExecute(BIN_PATH)) {
            promise.resolve(true);
            return;
        }
        if (new File(X_BIN_PATH).exists() && isCanExecute(X_BIN_PATH)) {
            promise.resolve(true);
            return;
        }
        promise.resolve(false);
    }

    private boolean isCanExecute(String filePath) {
        java.lang.Process process = null;
        try {
            process = Runtime.getRuntime().exec("ls -l " + filePath);
            BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String str = in.readLine();
            if (str != null && str.length() >= 4) {
                char flag = str.charAt(3);
                if (flag == 's' || flag == 'x')
                    return true;
            }
        } catch (IOException e) {
            Log.e(TAG, e.getMessage(), e);
        } finally {
            if (process != null) {
                process.destroy();
            }
        }
        return false;
    }
}
