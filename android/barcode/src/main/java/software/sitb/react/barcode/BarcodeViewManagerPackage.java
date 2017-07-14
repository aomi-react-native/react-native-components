package software.sitb.react.barcode;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class BarcodeViewManagerPackage extends DefaultReactPackage {

    private BarcodeViewManager barcodeViewManager;

    public BarcodeViewManagerPackage() {
        this.barcodeViewManager = new BarcodeViewManager();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(this.barcodeViewManager);
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.<ViewManager>singletonList(this.barcodeViewManager);
    }
}
