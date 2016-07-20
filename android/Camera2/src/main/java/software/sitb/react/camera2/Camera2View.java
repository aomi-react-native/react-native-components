package software.sitb.react.camera2;


import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.*;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.ImageReader;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;

import java.util.Arrays;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@TargetApi(Build.VERSION_CODES.LOLLIPOP)
public class Camera2View extends TextureView implements TextureView.SurfaceTextureListener {

    private static final String TAG = "Camera2View";

    private CameraManager cameraManager;

    private Handler handler;

    private String cameraId;

    private Size previewSize;

    private CaptureRequest.Builder previewBuilder;

    private CameraDevice.StateCallback cameraDeviceStateCallback = new CameraDevice.StateCallback() {
        @Override
        public void onOpened(@NonNull CameraDevice camera) {
            try {
                startPreview(camera);
            } catch (CameraAccessException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onDisconnected(@NonNull CameraDevice camera) {
        }

        @Override
        public void onError(@NonNull CameraDevice camera, int error) {
        }
    };


    private CameraCaptureSession.StateCallback cameraCaptureSessionStateCallback = new CameraCaptureSession.StateCallback() {
        @Override
        public void onConfigured(@NonNull CameraCaptureSession session) {
            try {
//                CameraManagerFactory.setCameraCaptureSession(session);
                // 设置预览时连续捕获图像数据
                session.setRepeatingRequest(previewBuilder.build(), null, handler);
            } catch (CameraAccessException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onConfigureFailed(@NonNull CameraCaptureSession session) {
//            CameraManagerFactory.setCameraCaptureSession(null);
        }
    };


    public Camera2View(Context context) {
        super(context);
        setSurfaceTextureListener(this);
        HandlerThread threadHandler = new HandlerThread("SitbRCTCamera2View");
        threadHandler.start();
        handler = new Handler(threadHandler.getLooper());
    }

    @Override
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        try {
            //获得属性
            CameraCharacteristics characteristics = cameraManager.getCameraCharacteristics(this.cameraId);
            //支持的STREAM CONFIGURATION
            StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
            //显示的size
            assert map != null;
            previewSize = map.getOutputSizes(SurfaceTexture.class)[0];
            //打开相机
            if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                Log.e(TAG, "无相机访问权限");
                return;
            }
            cameraManager.openCamera(this.cameraId, cameraDeviceStateCallback, handler);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {

    }


    /**
     * 开始预览，主要是camera.createCaptureSession这段代码很重要，创建会话
     *
     * @param camera 相机
     * @throws CameraAccessException 相机访问异常
     */
    private void startPreview(CameraDevice camera) throws CameraAccessException {
        SurfaceTexture texture = getSurfaceTexture();
        texture.setDefaultBufferSize(previewSize.getWidth(), previewSize.getHeight());
        Surface surface = new Surface(texture);
        ImageReader imageReader = ImageReader.newInstance(previewSize.getWidth(), previewSize.getHeight(), ImageFormat.JPEG, 1);
        previewBuilder = camera.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
        previewBuilder.addTarget(surface);
        camera.createCaptureSession(Arrays.asList(surface, imageReader.getSurface()), cameraCaptureSessionStateCallback, handler);
    }


    public void setCameraManager(CameraManager cameraManager) {
        this.cameraManager = cameraManager;
    }

    public void setCameraId(String cameraId) {
        this.cameraId = cameraId;
    }

}
