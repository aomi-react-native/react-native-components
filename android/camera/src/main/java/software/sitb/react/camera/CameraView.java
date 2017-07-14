package software.sitb.react.camera;

import android.content.Context;
import android.graphics.Rect;
import android.graphics.SurfaceTexture;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.os.AsyncTask;
import android.util.Base64;
import android.view.TextureView;
import android.view.WindowManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import software.sitb.react.camera.commons.BaseCameraView;
import software.sitb.react.camera.commons.CameraFacing;
import software.sitb.react.camera.commons.Orientation;
import software.sitb.react.camera.commons.Quality;

import java.io.ByteArrayOutputStream;

import static software.sitb.react.camera.commons.AbstractCameraViewManager.CAPTURE_OUTPUT_BUFFER_EVENT;


/**
 * 相机视图
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraView extends TextureView implements BaseCameraView, TextureView.SurfaceTextureListener, Camera.PreviewCallback {

    private int width;
    private int height;
    private int previewFormat;
    private Quality quality;

    private boolean needCaptureOutputBuffer = false;

    private byte[] captureOutputBuffer;

    private CameraManager cameraManager;

    public CameraView(Context context) {
        super(context);
        cameraManager = new CameraManager();
        setSurfaceTextureListener(this);
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        cameraManager.setSurfaceTexture(surface);
        cameraManager.startPreview();

        Camera.Parameters parameters = cameraManager.getCamera().getParameters();
        Camera.Size previewSize = parameters.getPreviewSize();
        this.height = previewSize.height;
        this.width = previewSize.width;
        this.previewFormat = parameters.getPreviewFormat();
        captureOutputBuffer = new byte[(this.height * this.width * 3) / 2];
        cameraManager.setPreviewCallbackWithBuffer(this);
        cameraManager.setCallbackBuffer(captureOutputBuffer);
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        cameraManager.release();
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {

    }

    @Override
    public void setCameraFacing(CameraFacing cameraFacing) {
        cameraManager.setCameraFacing(cameraFacing);
    }

    @Override
    public void setOrientation(Orientation orientation) {
        switch (orientation) {
            case AUTO:
                cameraManager.setRotation(getCurrentOrientation());
                break;
        }
    }

    @Override
    public void setQuality(Quality quality) {
        this.quality = quality;
        cameraManager.setQuality(quality);
    }

    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        if (!this.needCaptureOutputBuffer) {
            return;
        }
        new AsyncTask<byte[], Void, Void>() {

            @Override
            protected Void doInBackground(byte[]... params) {
                decode(params[0]);
                return null;
            }

            private void decode(byte[] data) {
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                YuvImage image = new YuvImage(data, previewFormat, width, height, null);
                int qualityValue = 100;
                switch (quality) {
                    case MEDIUM:
                        qualityValue = 100 / 2;
                        break;
                    case LOW:
                        qualityValue = 100 / 3;
                        break;
                }
                image.compressToJpeg(new Rect(0, 0, image.getWidth(), image.getHeight()), qualityValue, outputStream);
                byte[] imgBytes = outputStream.toByteArray();
                String imgBase64 = Base64.encodeToString(imgBytes, Base64.DEFAULT);
                WritableMap response = Arguments.createMap();

                WritableMap buffer = Arguments.createMap();
                buffer.putString("buffer", imgBase64);
                response.putMap("nativeEvent", buffer);

                DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = ((ReactContext) getContext())
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
                eventEmitter.emit(CAPTURE_OUTPUT_BUFFER_EVENT, response);

                getCameraManager().setCallbackBuffer(captureOutputBuffer);
            }

        }.execute(data);
    }

    public CameraManager getCameraManager() {
        return cameraManager;
    }

    private int getCurrentOrientation() {
        return getWindowManager().getDefaultDisplay().getRotation();
    }

    private WindowManager getWindowManager() {
        return ((WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE));
    }

    public void setNeedCaptureOutputBuffer(boolean needCaptureOutputBuffer) {
        this.needCaptureOutputBuffer = needCaptureOutputBuffer;
    }
}
