package software.sitb.react.camera;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.view.TextureView;
import android.view.WindowManager;
import software.sitb.react.camera.commons.BaseCameraView;
import software.sitb.react.camera.commons.CameraFacing;
import software.sitb.react.camera.commons.Orientation;

/**
 * 相机视图
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CameraView extends TextureView implements BaseCameraView, TextureView.SurfaceTextureListener {

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

    public CameraManager getCameraManager() {
        return cameraManager;
    }

    private int getCurrentOrientation() {
        return getWindowManager().getDefaultDisplay().getRotation();
    }

    private WindowManager getWindowManager() {
        return ((WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE));
    }


}
