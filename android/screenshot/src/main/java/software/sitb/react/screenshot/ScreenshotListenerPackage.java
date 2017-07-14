package software.sitb.react.screenshot;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author Sean sean.snow@live.com createAt 2017/7/14
 */
public class ScreenshotListenerPackage extends DefaultReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(new ScreenshotListenerModule(reactContext));
    }
}
