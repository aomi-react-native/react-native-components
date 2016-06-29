package software.sitb.react.camera;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.SurfaceTexture;
import android.hardware.SensorManager;
import android.os.Build;
import android.view.*;
import com.facebook.react.bridge.ReactContext;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@TargetApi(Build.VERSION_CODES.KITKAT)
@SuppressWarnings("deprecation")
public class CameraView  extends TextureView implements TextureView.SurfaceTextureListener  {

    private Context context;

    private int actualDeviceOrientation;

    public CameraView(Context ctx) {
        super(ctx);
        this.context = ctx;
        setActualDeviceOrientation();

        OrientationEventListener orientationListener = new OrientationEventListener(ctx, SensorManager.SENSOR_DELAY_NORMAL) {
            @Override
            public void onOrientationChanged(int orientation) {
                if (setActualDeviceOrientation()) {
                    cameraLayout();
                }
            }
        };
        if (orientationListener.canDetectOrientation()) {
            orientationListener.enable();
        } else {
            orientationListener.disable();
        }
        this.setSurfaceTextureListener(this);
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        CameraFactory.getInstance().setSurfaceTexture(surface);
        startPreview();
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {
    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        CameraFactory.getInstance().setSurfaceTexture(null);
        release();
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {

    }

    synchronized private void startPreview() {
        CameraFactory.getInstance().startPreview();
    }

    synchronized private void stopPreview() {
        CameraFactory.getInstance().stopPreview();
    }

    synchronized private void release() {
        CameraFactory.getInstance().release();
    }


    public void setOrientation(int orientation) {
        CameraFactory.getInstance().setOrientation(orientation);
    }

    public void setCameraType(int type) {
        CameraFactory.getInstance().setCameraType(type);
    }


    private void cameraLayout() {
        cameraLayout(this.getLeft(), this.getTop(), this.getRight(), this.getBottom());
    }

    private void cameraLayout(int left, int top, int right, int bottom) {

        int width = right - left;
        int height = bottom - top;

        this.layout(0, 0, width, height);
        this.postInvalidate(this.getLeft(), this.getTop(), this.getRight(), this.getBottom());

    }

    private boolean setActualDeviceOrientation() {
        int actualDeviceOrientation = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getOrientation();
        if (this.actualDeviceOrientation != actualDeviceOrientation) {
            this.actualDeviceOrientation = actualDeviceOrientation;
            CameraFactory.getInstance().setActualDeviceOrientation(actualDeviceOrientation);
            return true;
        }
        return false;
    }


}
