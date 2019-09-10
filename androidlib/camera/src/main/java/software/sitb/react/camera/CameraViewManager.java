package software.sitb.react.camera;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import software.sitb.react.camera.commons.AbstractCameraViewManager;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraViewManager extends AbstractCameraViewManager<CameraView> {

    protected CameraView view;

    @Override
    public String getName() {
        return "SitbCameraView";
    }

    @ReactProp(name = "needCaptureOutputBuffer")
    public void setNeedCaptureOutputBuffer(CameraView view, Boolean needCaptureOutputBuffer) {
        view.setNeedCaptureOutputBuffer(needCaptureOutputBuffer);
    }

    @Override
    protected CameraView createViewInstance(ThemedReactContext reactContext) {
        this.view = new CameraView(reactContext);
        return this.view;
    }

    @ReactMethod
    public void stopCapture() {
        this.view.getCameraManager().release();
    }

}
