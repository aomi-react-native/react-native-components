package software.sitb.react.camera;

import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.media.ExifInterface;
import android.util.Log;

import java.io.IOException;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@SuppressWarnings("deprecation")
public class CameraFactory {

    private static final String TAG = "CameraFactory";

    private static CameraFactory cameraFactory = new CameraFactory();

    private Camera camera;

    private int orientation;

    private int cameraType = 0;

    private int actualDeviceOrientation = 0;

    private CameraFactory() {
    }

    public static CameraFactory getInstance() {
        return cameraFactory;
    }

    public Camera acquireCameraInstance() {
        if (null == camera) {
            camera = Camera.open();
        }
        return camera;
    }

    public void setOrientation(int orientation) {
        if (this.orientation == orientation) {
            return;
        }
        this.orientation = orientation;
    }

    public void setCameraType(int cameraType) {
        if (this.cameraType == cameraType) {
            return;
        }
        this.cameraType = cameraType;
    }

    public void setActualDeviceOrientation(int actualDeviceOrientation) {
        this.actualDeviceOrientation = actualDeviceOrientation;
        adjustPreviewLayout();
    }

    private void adjustPreviewLayout() {
        Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
        Camera.getCameraInfo(this.cameraType, cameraInfo);

        int displayRotation;
        int rotation;
        if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
            rotation = (orientation + actualDeviceOrientation * 90) % 360;
            displayRotation = (720 - orientation - actualDeviceOrientation * 90) % 360;
        } else {
            rotation = (orientation - actualDeviceOrientation * 90 + 360) % 360;
            displayRotation = rotation;
        }
        ExifInterface a;

        camera.setDisplayOrientation(displayRotation);
        Camera.Parameters parameters = camera.getParameters();
        parameters.setRotation(rotation);

        Camera.Size optimalPreviewSize = getBestPreviewSize(Integer.MAX_VALUE, Integer.MAX_VALUE);
        int width = optimalPreviewSize.width;
        int height = optimalPreviewSize.height;
        parameters.setPreviewSize(width, height);
        try {
            camera.setParameters(parameters);
        } catch (Exception e) {
            Log.e(TAG, "设置参数失败", e);
        }
    }

    private Camera.Size getBestPreviewSize(int width, int height) {
        Camera.Size result = null;
        if (camera == null) {
            return null;
        }
        Camera.Parameters params = camera.getParameters();
        for (Camera.Size size : params.getSupportedPictureSizes()) {
            if (size.width <= width && size.height <= height) {
                if (result == null) {
                    result = size;
                } else {
                    int resultArea = result.width * result.height;
                    int newArea = size.width * size.height;

                    if (newArea > resultArea) {
                        result = size;
                    }
                }
            }
        }
        return result;
    }

    public void startPreview(SurfaceTexture surfaceTexture) {
        try {
            // init camera
            acquireCameraInstance();
//            Camera.Parameters parameters = camera.getParameters();
//            setActualDeviceOrientation(context);

            camera.setPreviewTexture(surfaceTexture);
            camera.startPreview();
        } catch (IOException e) {
            Log.e(TAG, e.getMessage(), e);
        }
    }

    public void stopPreview() {
        if (null != camera) {
            camera.stopPreview();
            camera.release();
            camera = null;
        }
    }
}
