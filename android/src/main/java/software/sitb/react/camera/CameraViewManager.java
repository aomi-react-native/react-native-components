package software.sitb.react.camera;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraViewManager extends SimpleViewManager<CameraView> {
    @Override
    public String getName() {
        return "RCTSitbCameraView";
    }

    @Override
    protected CameraView createViewInstance(ThemedReactContext reactContext) {
        return new CameraView(reactContext);
    }

    @ReactProp(name = "type")
    public void setType(CameraView view, int type) {
        view.setCameraType(type);
    }

    @ReactProp(name = "orientation")
    public void setOrientation(CameraView view, int orientation) {
        view.setOrientation(orientation);
    }

}
