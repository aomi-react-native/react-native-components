package software.sitb.react.camera2;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.hardware.camera2.*;
import android.media.Image;
import android.media.ImageReader;
import android.os.Build;
import android.support.annotation.NonNull;
import android.util.Log;
import android.util.SparseIntArray;
import android.view.Surface;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.Error;
import software.sitb.react.io.FileUtils;

import java.nio.ByteBuffer;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class Camera2Module extends DefaultReactContextBaseJavaModule {


    private static final String TAG = "SitbCamera2Module";

    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();

    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }

    private Activity activity;

    private ReactApplicationContext reactContext;


    public Camera2Module(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = activity;
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SitbRCTCameraModule";
    }


    /**
     * Check if this device has a camera
     *
     * @param promise 异步回调
     */
    @ReactMethod
    public void checkCameraHardware(final Promise promise) {
        if (this.reactContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
            // this device has a camera
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    /**
     * 拍照
     *
     * @param options 参数
     * @param promise 异步
     */
    @ReactMethod
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public void capture(final ReadableMap options, final Promise promise) {

        CameraDevice cameraDevice = CameraManagerFactory.getCameraDevice();
        if (null == cameraDevice) {
            Log.e(TAG, "无法获取相机设备");
            promise.reject(Error.EXCEPTION, "无法获取相机设备");
            return;
        }

        final CameraCaptureSession captureSession = CameraManagerFactory.getCameraCaptureSession();
        final CaptureRequest.Builder previewRequestBuilder = CameraManagerFactory.getPreviewRequestBuilder();
        final ImageReader imageReader = CameraManagerFactory.getImageReader();
        imageReader.setOnImageAvailableListener(new ImageReader.OnImageAvailableListener() {
            @Override
            public void onImageAvailable(ImageReader reader) {
//                Image image = reader.acquireNextImage();
//                ByteBuffer buffer = image.getPlanes()[0].getBuffer();
//                byte[] bytes = new byte[buffer.remaining()];
//                FileUtils.saveImageToCameraColl(reactContext, bytes, options.getString("title"), options.getString("description"));
            }
        }, null);

        try {
            CaptureRequest.Builder builder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE);
            builder.addTarget(imageReader.getSurface());
            // 自动对焦
            builder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
            // 自动曝光模式
            builder.set(CaptureRequest.CONTROL_AE_MODE, CaptureRequest.CONTROL_AE_MODE_ON_AUTO_FLASH);
            // 设置设备方向
            int rotation = this.activity.getWindowManager().getDefaultDisplay().getRotation();
            // 根据设备方向计算设置照片的方向
            builder.set(CaptureRequest.JPEG_ORIENTATION, ORIENTATIONS.get(rotation));
            // 停止连续取景
            captureSession.stopRepeating();

            captureSession.capture(builder.build(), new CameraCaptureSession.CaptureCallback() {
                @Override
                public void onCaptureCompleted(@NonNull CameraCaptureSession session, @NonNull CaptureRequest request, @NonNull TotalCaptureResult result) {
                    try {
                        // 重设自动对焦模式
                        previewRequestBuilder.set(CaptureRequest.CONTROL_AF_TRIGGER, CameraMetadata.CONTROL_AF_TRIGGER_CANCEL);
                        // 设置自动曝光模式
                        previewRequestBuilder.set(CaptureRequest.CONTROL_AE_MODE, CaptureRequest.CONTROL_AE_MODE_ON_AUTO_FLASH);
                        // 打开连续取景模式
                        captureSession.setRepeatingRequest(previewRequestBuilder.build(), null, null);
                    } catch (CameraAccessException e) {
                        e.printStackTrace();
                    }
                }
            }, null);

        } catch (CameraAccessException e) {
            promise.reject(Error.EXCEPTION, e);
        }
    }
}
