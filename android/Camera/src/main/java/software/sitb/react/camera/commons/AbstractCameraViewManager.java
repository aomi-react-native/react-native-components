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


    @ReactProp(name = "cameraFacing")
    public void setCameraFacing(T view, Integer cameraFacing) {
        ((BaseCameraView) view).setCameraFacing(CameraFacing.values()[cameraFacing]);
    }


    @ReactProp(name = "orientation")
    public void setOrientation(T view, Integer orientation) {
        ((BaseCameraView) view).setOrientation(Orientation.values()[orientation]);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedViewConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("CameraFacing", MapBuilder.of("back", CameraFacing.BACK.ordinal(), "front", CameraFacing.FRONT.ordinal()));
        constants.put("Orientation", MapBuilder.of("auto", Orientation.AUTO.ordinal()));

        return constants;
    }
}
