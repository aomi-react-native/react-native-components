package software.sitb.react.media;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class MediaManagerPackage extends DefaultReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(
                new MediaManager(reactContext)
        );
    }
}
