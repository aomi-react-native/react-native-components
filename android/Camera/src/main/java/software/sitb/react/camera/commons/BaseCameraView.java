package software.sitb.react.camera.commons;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public interface BaseCameraView {

    /**
     * @param cameraFacing 相机facing
     */
    void setCameraFacing(CameraFacing cameraFacing);

    void setOrientation(Orientation orientation);

    void setQuality(Quality quality);

}
