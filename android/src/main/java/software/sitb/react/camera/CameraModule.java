package software.sitb.react.camera;

import android.content.ContentValues;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.hardware.Camera;
import android.provider.MediaStore;
import com.facebook.react.bridge.*;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.Error;
import software.sitb.react.io.FileUtils;

import javax.annotation.Nullable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
@SuppressWarnings("deprecation")
public class CameraModule extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "CameraModule";

    private ReactApplicationContext reactContext;

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SitbCameraModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {

        HashMap<String, Object> constants = new HashMap<>();
        constants.put("CameraType", new HashMap<String, Object>() {{
            put("front", Camera.CameraInfo.CAMERA_FACING_FRONT);
            put("back", Camera.CameraInfo.CAMERA_FACING_BACK);
        }});

        constants.put("Orientation", new HashMap<String, Object>() {{
            put("auto", 0);
        }});

        return Collections.unmodifiableMap(constants);
    }

    @ReactMethod
    public void capture(final ReadableMap options, final Promise promise) {

        new GuardedAsyncTask<Void, Integer>(reactContext) {
            @Override
            protected void doInBackgroundGuarded(Void... params) {
                Camera camera = CameraFactory.getInstance().acquireCameraInstance();

                if (null == camera) {
                    promise.reject(Error.EXCEPTION, "找不到相机");
                    return;
                }

                String title = "",
                        deprecation = "";

                double longitude = 0,
                        latitude = 0;
                long timestamp = 0;

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
                                longitude = coords.getDouble("longitude");
                            }
                            if (coords.hasKey("latitude")) {
                                latitude = coords.getDouble("latitude");
                            }

                            if (coords.hasKey("timestamp")) {
                                try {
                                    timestamp = Long.parseLong(coords.getString("timestamp"));
                                } catch (Exception ignored) {
                                }
                            } else {
                                timestamp = System.currentTimeMillis();
                            }
                        }
                    }
                }

//                CameraFactory.getInstance().setGpsData(latitude, longitude, timestamp);


                final String finalTitle = title;
                final String finalDeprecation = deprecation;
                final double finalLongitude = longitude;
                final double finalLatitude = latitude;
                final String finalTimestamp = timestamp + "";
                camera.takePicture(null, null, new Camera.PictureCallback() {

                    @Override
                    public void onPictureTaken(final byte[] data, Camera camera) {
                        camera.stopPreview();
                        camera.startPreview();
                        WritableMap response = new WritableNativeMap();

                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Images.Media.TITLE, finalTitle);
                        values.put(MediaStore.Images.Media.DESCRIPTION, finalDeprecation);
                        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
//                        values.put(MediaStore.Images.Media.LATITUDE, finalLatitude);
//                        values.put(MediaStore.Images.Media.LONGITUDE, finalLongitude);
//                        values.put(MediaStore.Images.Media.DATE_TAKEN, finalTimestamp);

                        Camera.Size size = camera.getParameters().getPictureSize();
                        values.put(MediaStore.Images.Media.WIDTH, size.width);
                        values.put(MediaStore.Images.Media.HEIGHT, size.height);

                        BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
                        Bitmap bitmap = BitmapFactory.decodeByteArray(data, 0, data.length, bitmapOptions);

                        String url = FileUtils.insertImage(
                                reactContext.getContentResolver(),
                                values,
                                bitmap
                        );
                        String path = FileUtils.getFilePathFromContentUri(
                                reactContext.getContentResolver(),
                                url,
                                new String[]{MediaStore.Images.Media.DATA}
                        );
                        FileUtils.setImageGps(path, finalLatitude, finalLongitude);

                        response.putString("path", url);
                        promise.resolve(response);
                    }
                });
            }
        }.execute();
    }


}
