package software.sitb.react.camera.commons;

import android.view.View;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public abstract class AbstractCameraViewManager<T extends View> extends SimpleViewManager<T> {

    public static final String CAPTURE_OUTPUT_BUFFER_EVENT = "captureOutputBuffer";

    @ReactProp(name = "cameraFacing")
    public void setCameraFacing(T view, String cameraFacing) {
        ((BaseCameraView) view).setCameraFacing(CameraFacing.valueOf(cameraFacing));
    }

    @ReactProp(name = "orientation")
    public void setOrientation(T view, String orientation) {
        ((BaseCameraView) view).setOrientation(Orientation.valueOf(orientation));
    }

    @ReactProp(name = "quality")
    public void setQuality(T view, String quality) {
        ((BaseCameraView) view).setQuality(Quality.valueOf(quality));
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedViewConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("CameraFacing", MapBuilder.of("back", CameraFacing.BACK.toString(), "front", CameraFacing.FRONT.toString()));
        constants.put("Orientation", MapBuilder.of("auto", Orientation.AUTO.toString()));
        constants.put("Quality", MapBuilder.of(
                "high", Quality.HIGH.toString(),
                "medium", Quality.MEDIUM.toString(),
                "low", Quality.LOW.toString(),
                "vga", Quality.VGA.toString(),
                "hd720", Quality.HD720.toString(),
                "hd1080", Quality.HD1080.toString()
        ));

        return constants;
    }
}
