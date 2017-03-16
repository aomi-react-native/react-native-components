package software.sitb.react.camera2;

import android.annotation.TargetApi;
import android.content.Context;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import software.sitb.react.camera.commons.AbstractCameraViewManager;
import software.sitb.react.camera.commons.CameraFacing;

import javax.annotation.Nullable;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class Camera2ViewManager extends AbstractCameraViewManager<Camera2View> {

    public static final String CAPTURE_OUTPUT_BUFFER_EVENT = "captureOutputBuffer";

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
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "capture", Command.CAPTURE.ordinal()
        );
    }

    @Override
    public void receiveCommand(Camera2View view, int commandId, @Nullable ReadableArray args) {
        switch (Command.values()[commandId]) {
            case CAPTURE:
                break;
        }
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                CAPTURE_OUTPUT_BUFFER_EVENT, MapBuilder.of("registrationName", "onCaptureOutputBuffer")
        );
    }

    public enum Command {
        CAPTURE
    }
}
