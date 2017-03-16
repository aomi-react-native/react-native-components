package software.sitb.react.camera2;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class Camera2ViewManagerPackage extends DefaultReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.<ViewManager>singletonList(new Camera2ViewManager());
    }
}
