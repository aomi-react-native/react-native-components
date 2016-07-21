package software.sitb.react.camera2;

import android.annotation.TargetApi;
import android.content.Context;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import software.sitb.react.camera.commons.CameraFacing;
import software.sitb.react.camera.commons.Orientation;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class Camera2ViewManager extends SimpleViewManager<Camera2View> {
    @Override
    public String getName() {
        return "SitbRCTCamera2View";
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected Camera2View createViewInstance(ThemedReactContext reactContext) {
        Camera2View view = new Camera2View(reactContext);
        CameraManager cameraManager = (CameraManager) reactContext.getSystemService(Context.CAMERA_SERVICE);
        view.setCameraManager(cameraManager);
        return view;
    }

    @ReactProp(name = "cameraFacing")
    public void setCameraFacing(Camera2View view, Integer cameraFacing) {
        switch (CameraFacing.values()[cameraFacing]) {
            case BACK:
                view.setCameraId("0");
                break;
            case FRONT:
                view.setCameraId("1");
                break;
        }
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
