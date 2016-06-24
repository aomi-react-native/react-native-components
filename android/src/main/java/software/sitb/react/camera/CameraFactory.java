package software.sitb.react.camera;

import android.hardware.Camera;
import android.os.AsyncTask;
import android.util.Log;
import android.view.SurfaceHolder;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@SuppressWarnings("deprecation")
public class CameraFactory {

    private static final String TAG = "CameraFactory";

    private static CameraFactory cameraFactory = new CameraFactory();

    private Map<Integer, Integer> cameraTypes = new HashMap<>(2);

    private Camera camera;

    private SurfaceHolder holder;

    private int orientation;

    private int cameraType = Camera.CameraInfo.CAMERA_FACING_BACK;

    private int actualDeviceOrientation = 0;

    private double latitude = 0;
    private double longitude = 0;
    private long timestamp = 0;

    private CameraFactory() {
        for (int i = 0; i < Camera.getNumberOfCameras(); i++) {
            Camera.CameraInfo info = new Camera.CameraInfo();
            Camera.getCameraInfo(i, info);
            if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT && cameraTypes.get(Camera.CameraInfo.CAMERA_FACING_FRONT) == null) {
                cameraTypes.put(Camera.CameraInfo.CAMERA_FACING_FRONT, i);

            } else if (info.facing == Camera.CameraInfo.CAMERA_FACING_BACK && cameraTypes.get(Camera.CameraInfo.CAMERA_FACING_BACK) == null) {
                cameraTypes.put(Camera.CameraInfo.CAMERA_FACING_BACK, i);
            }
        }
    }

    public static CameraFactory getInstance() {
        return cameraFactory;
    }

    public void setHolder(SurfaceHolder holder) {
        this.holder = holder;
    }

    public Camera acquireCameraInstance() {
        if (null == camera) {
            camera = Camera.open(this.cameraTypes.get(this.cameraType));
        }
        return camera;
    }

    public void setOrientation(int orientation) {
        if (this.orientation == orientation) {
            return;
        }
        this.orientation = orientation;
        adjustLayout();
    }

    public void setCameraType(int cameraType) {
        if (this.cameraType == cameraType) {
            return;
        }
        this.cameraType = cameraType;

        if (null == camera) {
            return;
        }

        new AsyncTask<Void, Integer, Boolean>() {

            @Override
            protected Boolean doInBackground(Void... params) {
                stopPreview();
                startPreview();
                return true;
            }

        }.execute();
    }

    public void setGpsData(double latitude, double longitude, long timestamp) {
        if (camera == null) {
            return;
        }
        Log.d(TAG, "设置GPS参数");
        Camera.Parameters parameters = camera.getParameters();
        if (this.latitude != latitude) {
            this.latitude = latitude;
            parameters.setGpsLatitude(latitude);
        }
        if (this.longitude != longitude) {
            this.longitude = longitude;
            parameters.setGpsLongitude(longitude);
        }
        if (this.timestamp != timestamp) {
            this.timestamp = timestamp;
            parameters.setGpsTimestamp(timestamp);
        }
        camera.setParameters(parameters);
    }

    public void setActualDeviceOrientation(int actualDeviceOrientation) {
        this.actualDeviceOrientation = actualDeviceOrientation;
        adjustLayout();
    }


    public void startPreview() {
        try {
            acquireCameraInstance();
            adjustLayout();

            Camera.Parameters parameters = camera.getParameters();

            // set autofocus
            List<String> focusModes = parameters.getSupportedFocusModes();
            if (focusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE)) {
                parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
            }

            parameters.setGpsLatitude(31.0000);
            parameters.setGpsLongitude(121.0000);

            try {
                camera.setParameters(parameters);
            } catch (Exception e) {
                Log.e(TAG, "设置参数失败", e);
            }

            camera.setPreviewDisplay(holder);
            camera.startPreview();
        } catch (IOException e) {
            release();
            Log.e(TAG, e.getMessage(), e);
        }
    }

    public void stopPreview() {
        if (null != camera) {
            camera.stopPreview();
        }
    }

    public void release() {
        if (null != camera) {
            camera.stopPreview();
            camera.release();
            camera = null;
        }
    }

    /**
     * 调整布局
     */
    private void adjustLayout() {
        if (null == camera) {
            return;
        }

        Log.d(TAG, "调整布局");
        Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
        Camera.getCameraInfo(this.cameraType, cameraInfo);

        int displayRotation;
        int rotation;
        if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
            rotation = (cameraInfo.orientation + actualDeviceOrientation * 90) % 360;
            displayRotation = (720 - orientation - actualDeviceOrientation * 90) % 360;
        } else {
            rotation = (cameraInfo.orientation - actualDeviceOrientation * 90 + 360) % 360;
            displayRotation = rotation;
        }

        camera.setDisplayOrientation(displayRotation);

        Camera.Parameters parameters = camera.getParameters();
        parameters.setRotation(rotation);

        Camera.Size previewSize = getSize(parameters.getSupportedPreviewSizes());
        Camera.Size pictureSize = getSize(parameters.getSupportedPictureSizes());

        parameters.setPreviewSize(previewSize.width, previewSize.height);
        parameters.setPictureSize(pictureSize.width, pictureSize.height);

        try {
            camera.setParameters(parameters);
        } catch (Exception e) {
            Log.e(TAG, "调整布局设置参数失败", e);
        }
    }

    private Camera.Size getSize(List<Camera.Size> sizes) {
        Camera.Size result = null;

        for (Camera.Size size : sizes) {
            if (null == result) {
                result = size;
            } else if (size.width > result.width && size.height > result.height) {
                result = size;
            }
        }


        return result;
    }

}
