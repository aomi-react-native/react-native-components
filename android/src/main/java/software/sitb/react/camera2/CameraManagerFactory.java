package software.sitb.react.camera2;

import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CaptureRequest;
import android.media.ImageReader;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraManagerFactory {

    private static CameraDevice cameraDevice;

    private static CameraCaptureSession cameraCaptureSession;

    private static CaptureRequest.Builder previewRequestBuilder;

    private static ImageReader imageReader;

    private CameraManagerFactory() {
    }

    public static void setCameraDevice(CameraDevice cameraDevice) {
        CameraManagerFactory.cameraDevice = cameraDevice;
    }

    public static CameraDevice getCameraDevice() {
        return CameraManagerFactory.cameraDevice;
    }

    public static CameraCaptureSession getCameraCaptureSession() {
        return cameraCaptureSession;
    }

    public static void setCameraCaptureSession(CameraCaptureSession cameraCaptureSession) {
        CameraManagerFactory.cameraCaptureSession = cameraCaptureSession;
    }


    public static CaptureRequest.Builder getPreviewRequestBuilder() {
        return previewRequestBuilder;
    }

    public static void setPreviewRequestBuilder(CaptureRequest.Builder previewRequestBuilder) {
        CameraManagerFactory.previewRequestBuilder = previewRequestBuilder;
    }

    public static ImageReader getImageReader() {
        return imageReader;
    }

    public static void setImageReader(ImageReader imageReader) {
        CameraManagerFactory.imageReader = imageReader;
    }
}
