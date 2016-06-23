package software.sitb.react.camera;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.*;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.ImageReader;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.NonNull;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;

import java.util.Arrays;

@TargetApi(Build.VERSION_CODES.LOLLIPOP)
public class CameraView extends TextureView implements TextureView.SurfaceTextureListener {

    private Context context;

    private Size previewSize;

    private Handler handler;

    private CaptureRequest.Builder previewBuilder;

    /**
     * 相机类型,
     * 前置摄像机 = 1
     * 后置摄像机 = 0
     */
    private String type;


    private CameraDevice.StateCallback cameraDeviceStateCallback = new CameraDevice.StateCallback() {
        @Override
        public void onOpened(@NonNull CameraDevice camera) {
            try {
                CameraManagerFactory.setCameraDevice(camera);
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
                CameraManagerFactory.setCameraCaptureSession(session);
                // 设置预览时连续捕获图像数据
                session.setRepeatingRequest(previewBuilder.build(), null, handler);
            } catch (CameraAccessException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onConfigureFailed(@NonNull CameraCaptureSession session) {
            CameraManagerFactory.setCameraCaptureSession(null);
        }
    };


    public CameraView(Context context) {
        super(context);
        this.context = context;
        setSurfaceTextureListener(this);
        HandlerThread threadHandler = new HandlerThread("CameraSurfaceView");
        threadHandler.start();
        handler = new Handler(threadHandler.getLooper());
    }


    @Override
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        CameraManager cameraManager = (CameraManager) this.context.getSystemService(Context.CAMERA_SERVICE);
        try {
            //获得属性
            CameraCharacteristics characteristics = cameraManager.getCameraCharacteristics(getType());
            //支持的STREAM CONFIGURATION
            StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
            //显示的size
            assert map != null;
            previewSize = map.getOutputSizes(SurfaceTexture.class)[0];
            //打开相机
            cameraManager.openCamera(getType(), cameraDeviceStateCallback, handler);
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


    //开始预览，主要是camera.createCaptureSession这段代码很重要，创建会话
    private void startPreview(CameraDevice camera) throws CameraAccessException {
        SurfaceTexture texture = getSurfaceTexture();
        texture.setDefaultBufferSize(previewSize.getWidth(), previewSize.getHeight());
        Surface surface = new Surface(texture);
        ImageReader imageReader = ImageReader.newInstance(previewSize.getWidth(), previewSize.getHeight(), ImageFormat.JPEG, 1);
        CameraManagerFactory.setImageReader(imageReader);
        try {
            previewBuilder = camera.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            CameraManagerFactory.setPreviewRequestBuilder(previewBuilder);
            previewBuilder.addTarget(surface);
            camera.createCaptureSession(Arrays.asList(surface, imageReader.getSurface()), cameraCaptureSessionStateCallback, handler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
