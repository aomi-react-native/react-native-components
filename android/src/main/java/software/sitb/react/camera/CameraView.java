package software.sitb.react.camera;

import android.annotation.TargetApi;
import android.content.Context;
import android.hardware.SensorManager;
import android.os.Build;
import android.view.OrientationEventListener;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.WindowManager;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@TargetApi(Build.VERSION_CODES.KITKAT)
@SuppressWarnings("deprecation")
public class CameraView extends SurfaceView implements SurfaceHolder.Callback {

    private Context context;

    private int actualDeviceOrientation;

    public CameraView(Context ctx) {
        super(ctx);
        this.context = ctx;
        setActualDeviceOrientation(this.context);

        OrientationEventListener orientationListener = new OrientationEventListener(ctx, SensorManager.SENSOR_DELAY_NORMAL) {
            @Override
            public void onOrientationChanged(int orientation) {
                if (setActualDeviceOrientation(context)) {
                    cameraLayout();
                }
            }
        };
        if (orientationListener.canDetectOrientation()) {
            orientationListener.enable();
        } else {
            orientationListener.disable();
        }

    }


    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        CameraFactory.getInstance().setHolder(holder);
        startPreview();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        if (holder.getSurface() == null) {
            // preview surface does not exist
            return;
        }
        // stop preview before making changes
        try {
            stopPreview();
        } catch (Exception ignore) {
            // ignore: tried to stop a non-existent preview
        }

        CameraFactory.getInstance().acquireCameraInstance().startPreview();

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        CameraFactory.getInstance().setHolder(null);
        release();
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

    private boolean setActualDeviceOrientation(Context context) {
        int actualDeviceOrientation = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getOrientation();
        if (this.actualDeviceOrientation != actualDeviceOrientation) {
            this.actualDeviceOrientation = actualDeviceOrientation;
            CameraFactory.getInstance().setActualDeviceOrientation(actualDeviceOrientation);
            return true;
        }
        return false;
    }

}
