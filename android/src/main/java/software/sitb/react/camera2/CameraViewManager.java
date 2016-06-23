package software.sitb.react.camera2;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraViewManager extends SimpleViewManager<CameraView> {

    @Override
    public String getName() {
        return "RCTCameraViewManager";
    }

    @Override
    protected CameraView createViewInstance(ThemedReactContext reactContext) {
        return new CameraView(reactContext);
    }

    @ReactProp(name = "type")
    public void setType(CameraView view, String type) {
        view.setType(type);
    }
}
