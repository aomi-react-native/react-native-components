package software.sitb.react.camera;

import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.os.AsyncTask;
import android.util.Log;
import android.view.Surface;
import software.sitb.react.camera.commons.CameraFacing;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraManager {

    private static final String TAG = "CameraManager";

    private Camera camera;

    /**
     * 相机显示
     */
    private SurfaceTexture surfaceTexture;

    /**
     * 相机方向
     */
    private CameraFacing cameraFacing = CameraFacing.BACK;

    private int rotation = 0;

    private Camera.PreviewCallback previewCallbackWithBuffer;

    private byte[] callbackBuffer;

    private Map<CameraFacing, Camera> cameras = new HashMap<>();

    /**
     * 初始化创建相机
     */
    public void initCamera() {
        camera = cameras.get(this.cameraFacing);
        if (null == camera) {
            switch (this.cameraFacing) {
                case BACK:
                    camera = Camera.open(Camera.CameraInfo.CAMERA_FACING_BACK);
                    cameras.put(this.cameraFacing, camera);
                    break;
                case FRONT:
                    camera = Camera.open(Camera.CameraInfo.CAMERA_FACING_FRONT);
                    cameras.put(this.cameraFacing, camera);
                    break;
            }
        }
    }

    public synchronized void startPreview() {
        initCamera();
        if (null == this.surfaceTexture) {
            Log.e(TAG, "相机启动失败没有, SurfaceTexture 不能为NULL");
            return;
        }


        Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
        Camera.getCameraInfo(this.cameraFacing.ordinal(), cameraInfo);
        int degrees = 0;
        switch (rotation) {
            case Surface.ROTATION_0:
                degrees = 0;
                break;
            case Surface.ROTATION_90:
                degrees = 90;
                break;
            case Surface.ROTATION_180:
                degrees = 180;
                break;
            case Surface.ROTATION_270:
                degrees = 270;
                break;
        }

        int result;
        if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (cameraInfo.orientation + degrees) % 360;
            result = (360 - result) % 360;  // compensate the mirror
        } else {  // back-facing
            result = (cameraInfo.orientation - degrees + 360) % 360;
        }
        camera.setDisplayOrientation(result);


        Camera.Parameters parameters = camera.getParameters();
        parameters.setRotation(result);

        // set autofocus
        List<String> focusModes = parameters.getSupportedFocusModes();
        if (focusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE)) {
            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
        }
        try {
            camera.setParameters(parameters);
        } catch (Exception e) {
            Log.e(TAG, "设置参数失败", e);
            return;
        }
        if (null != this.previewCallbackWithBuffer) {
            camera.setPreviewCallbackWithBuffer(this.previewCallbackWithBuffer);
        }
        if (null != this.callbackBuffer) {
            camera.addCallbackBuffer(this.callbackBuffer);
        }
        try {
            camera.setPreviewTexture(this.surfaceTexture);
            camera.startPreview();
        } catch (IOException e) {
            Log.e(TAG, e.getMessage(), e);
        }
    }

    public synchronized void stopPreview() {
        if (null != camera) {
            camera.stopPreview();
        }
    }

    public synchronized void restartPreview() {
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                stopPreview();
                startPreview();
                return null;
            }
        }.execute();
    }

    public void release() {
        if (null != camera) {
            camera.stopPreview();
            camera.release();
            camera = null;
            this.cameras.remove(this.cameraFacing);
        }
    }

    public void setRotation(int rotation) {
        if (this.rotation == rotation) {
            return;
        }
        this.rotation = rotation;
        restartPreview();
    }


    public void setCameraFacing(CameraFacing cameraFacing) {
        if (this.cameraFacing == cameraFacing) {
            return;
        }
        this.cameraFacing = cameraFacing;
        restartPreview();
    }

    public void setSurfaceTexture(SurfaceTexture surfaceTexture) {
        this.surfaceTexture = surfaceTexture;
    }

    public void setPreviewCallbackWithBuffer(Camera.PreviewCallback previewCallbackWithBuffer) {
        this.previewCallbackWithBuffer = previewCallbackWithBuffer;
        if (null != camera) {
            camera.setPreviewCallbackWithBuffer(previewCallbackWithBuffer);
        }
    }

    public void setCallbackBuffer(byte[] callbackBuffer) {
        this.callbackBuffer = callbackBuffer;
        if (null != camera) {
            camera.addCallbackBuffer(callbackBuffer);
        }
    }

    public Camera getCamera() {
        return camera;
    }
}
