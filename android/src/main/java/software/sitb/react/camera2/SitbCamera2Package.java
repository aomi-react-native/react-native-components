package software.sitb.react.camera2;

import android.app.Activity;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.List;

/**
 * 相机package
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class SitbCamera2Package implements ReactPackage {

    private Activity activity;

    public SitbCamera2Package(Activity activity) {
        this.activity = activity;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(new SitbCamera2Module(reactContext, this.activity));
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.<ViewManager>singletonList(new CameraViewManager());
    }
}
