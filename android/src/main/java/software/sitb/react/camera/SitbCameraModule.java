package software.sitb.react.camera;

import android.hardware.Camera;
import com.facebook.react.bridge.*;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.Error;
import software.sitb.react.io.FileUtils;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@SuppressWarnings("deprecation")
public class SitbCameraModule extends DefaultReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public SitbCameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SitbCameraModule";
    }


    @ReactMethod
    public void takePicture(final ReadableMap options, final Promise promise) {

        Camera camera = CameraFactory.getInstance().acquireCameraInstance();

        if (null == camera) {
            promise.reject(Error.EXCEPTION, "找不到相机");
            return;
        }


        camera.takePicture(null, null, new Camera.PictureCallback() {

            @Override
            public void onPictureTaken(final byte[] data, Camera camera) {
                camera.stopPreview();
                camera.startPreview();

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        String title = "",
                                deprecation = "",
                                longitude = "",
                                latitude = "",
                                timestamp = "";

                        if (options.hasKey("title")) {
                            title = options.getString("title");
                        }
                        if (options.hasKey("deprecation")) {
                            deprecation = options.getString("deprecation");
                        }

                        if (options.hasKey("metadata")) {
                            ReadableMap metadata = options.getMap("metadata");
                            if (metadata.hasKey("location")) {
                                ReadableMap location = metadata.getMap("location");
                                if (location.hasKey("coords")) {
                                    ReadableMap coords = location.getMap("coords");


                                    if (coords.hasKey("longitude")) {
                                        longitude += coords.getDouble("longitude");
                                    }
                                    if (coords.hasKey("latitude")) {
                                        latitude += coords.getDouble("latitude");
                                    }

                                    if (coords.hasKey("timestamp")) {
                                        try {
                                            timestamp = coords.getString("timestamp");
                                        } catch (Exception ignored) {
                                        }
                                    }
                                }
                            }
                        }


                        WritableMap response = new WritableNativeMap();

                        String url = FileUtils.saveImageToCameraColl(
                                reactContext,
                                data,
                                title,
                                deprecation,
                                longitude,
                                latitude,
                                timestamp
                        );

                        response.putString("path", url);
                        promise.resolve(response);
                    }
                }).start();

            }

        });
    }

}
