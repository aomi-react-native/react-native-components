package software.sitb.react.camera;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.os.Build;
import android.view.TextureView;
import android.view.WindowManager;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@TargetApi(Build.VERSION_CODES.KITKAT)
@SuppressWarnings("deprecation")
public class CameraView extends TextureView implements TextureView.SurfaceTextureListener {

    private static final String TAG = "CameraView";

    private SurfaceTexture surfaceTexture;

    private Camera camera;

    private Context context;

    public CameraView(Context context) {
        super(context);
        setSurfaceTextureListener(this);
        this.context = context;
    }


    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        this.surfaceTexture = surface;
        startPreview();
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        surfaceTexture = null;
        stopPreview();
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {
    }

    synchronized private void startPreview() {
        CameraFactory.getInstance().startPreview(surfaceTexture);
    }

    synchronized private void stopPreview() {
        CameraFactory.getInstance().stopPreview();
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

    private void setActualDeviceOrientation(Context context) {
        int actualDeviceOrientation = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getOrientation();
        CameraFactory.getInstance().setActualDeviceOrientation(actualDeviceOrientation);
    }
}
