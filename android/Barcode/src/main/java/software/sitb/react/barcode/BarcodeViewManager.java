package software.sitb.react.barcode;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class BarcodeViewManager extends SimpleViewManager<BarcodeView> {
    @Override
    public String getName() {
        return "SitbRCTBarcodeView";
    }

    @Override
    protected BarcodeView createViewInstance(ThemedReactContext reactContext) {
        return new BarcodeView(reactContext);
    }
}
