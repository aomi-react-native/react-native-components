package software.sitb.react.media;

import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import com.facebook.react.bridge.*;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

import static android.app.Activity.RESULT_OK;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class MediaManager extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "MediaManager";

    private static final int OPEN_IMAGE_LIBRARY_REQUEST_CODE = 777_0;

    private static final int OPEN_CAMERA_REQUEST_CODE = 777_1;

    private static final int OPEN_EDIT_REQUEST_CODE = 777_2;

    private ReactApplicationContext reactContext;

    private ActivityEventListener openImageListener;
    private ActivityEventListener openCameraListener;
    private ActivityEventListener openEditListener;

    public MediaManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SitbRCTMediaManager";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> sourceType = new HashMap<>(2);
        sourceType.put("photoLibrary", SourceType.PhotoLibrary.ordinal());
        sourceType.put("savedPhotosAlbum", SourceType.SavedPhotosAlbum.ordinal());
        sourceType.put("camera", SourceType.Camera.ordinal());

        HashMap<String, Object> mediaType = new HashMap<>(2);
        mediaType.put("image", MediaType.Image.ordinal());
        mediaType.put("video", MediaType.Video.ordinal());

        HashMap<String, Object> cameraType = new HashMap<>(2);
        cameraType.put("back", CameraType.Back.ordinal());
        cameraType.put("front", CameraType.Front.ordinal());

        HashMap<String, Object> quality = new HashMap<>(4);
        quality.put("high", Quality.High.ordinal());
        quality.put("medium", Quality.Medium.ordinal());
        quality.put("low", Quality.Low.ordinal());


        HashMap<String, Object> constants = new HashMap<>();
        constants.put("SourceType", sourceType);
        constants.put("MediaType", mediaType);
        constants.put("CameraType", cameraType);
        constants.put("Quality", quality);
        return constants;
    }

    @ReactMethod
    public void launchImageLibrary(final ReadableMap options, final Promise promise) {
        final boolean allowsEditing = options.getBoolean("allowsEditing");
        final Uri[] uri = new Uri[1];
        openImageListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_IMAGE_LIBRARY_REQUEST_CODE == requestCode) {
                    if (resultCode == RESULT_OK) {
                        Log.d(TAG, "处理成功");

                        WritableMap response = new WritableNativeMap();

                        if (allowsEditing) {
                            String url = uri[0].toString();
                            WritableMap edited = new WritableNativeMap();
                            edited.putString("path", url);
                            response.putMap("edited", edited);
                        } else {
                            WritableMap reference = new WritableNativeMap();
                            reference.putString("path", data.getData().toString());
                            response.putMap("reference", reference);
                        }
                        promise.resolve(response);
                    } else {
                        Log.d(TAG, "取消");
                        promise.reject("CANCEL", "用户取消");
                    }

                    reactContext.removeActivityEventListener(openImageListener);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {
                Log.d(TAG, "on new intent");
            }
        };

        this.reactContext.addActivityEventListener(openImageListener);
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        if (allowsEditing) {
            uri[0] = this.setEditingParams(intent);
        }

        // 打开相册
        this.reactContext.startActivityForResult(intent, OPEN_IMAGE_LIBRARY_REQUEST_CODE, null);
    }

    @ReactMethod
    public void launchCamera(final ReadableMap options, final Promise promise) {
        final Uri[] uri = new Uri[1];
        double longitude = 0,
                latitude = 0;
        if (options.hasKey("metadata")) {
            ReadableMap metadata = options.getMap("metadata");
            if (metadata.hasKey("location")) {
                ReadableMap location = metadata.getMap("location");
                if (location.hasKey("coords")) {
                    ReadableMap coords = location.getMap("coords");
                    if (coords.hasKey("longitude")) {
                        try {
                            longitude = coords.getDouble("longitude");
                        } catch (Exception ignored) {
                        }
                    }
                    if (coords.hasKey("latitude")) {
                        try {
                            latitude = coords.getDouble("latitude");
                        } catch (Exception ignored) {
                        }
                    }
                }
            }
        }
        final double finalLatitude = latitude;
        final double finalLongitude = longitude;
        openCameraListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_CAMERA_REQUEST_CODE == requestCode) {
                    if (RESULT_OK == resultCode) {
                        Log.d(TAG, "拍照成功");
                        Uri imageUri = uri[0];

                        int width = 0;
                        int height = 0;
                        if (options.hasKey("size")) {
                            ReadableMap size = options.getMap("size");
                            width = size.getInt("width");
                            height = size.getInt("height");
                        }

                        String path = FileUtils.getFilePathFromContentUri(
                                reactContext.getContentResolver(),
                                imageUri.toString(),
                                new String[]{MediaStore.Images.Media.DATA}
                        );

                        FileUtils.fixOrientationAndScale(reactContext.getContentResolver(), path, width, height);
                        if (options.hasKey("quality")) {
                            // 压缩图片
                            Quality quality = Quality.values()[options.getInt("quality")];
                            switch (quality) {
                                case High:
                                    break;
                                case Medium:
                                    FileUtils.compressImage(reactContext.getContentResolver(), imageUri, 100 / 2);
                                    break;
                                case Low:
                                    FileUtils.compressImage(reactContext.getContentResolver(), imageUri, 100 / 3);
                                    break;
                            }
                        }
                        FileUtils.setImageGps(path, finalLatitude, finalLongitude);

                        WritableMap response = new WritableNativeMap();
                        WritableMap original = new WritableNativeMap();
                        original.putString("path", imageUri.toString());
                        response.putMap("original", original);
                        promise.resolve(response);
                    } else {
                        Log.d(TAG, "拍照取消");
                        promise.reject("CANCEL", "用户取消");
                    }
                    reactContext.removeActivityEventListener(openCameraListener);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        };
        this.reactContext.addActivityEventListener(openCameraListener);
        // 打开相机
        Intent intent = null;
        MediaType mediaType = MediaType.values()[options.getInt("mediaType")];
        switch (mediaType) {
            case Image:
                intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                break;
            case Video:
                intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
                break;
        }
        CameraType cameraType = CameraType.values()[options.getInt("cameraType")];
        switch (cameraType) {
            case Front:
                break;
            case Back:
                break;
        }
        String title = "",
                description = "";
        if (options.hasKey("title")) {
            title = options.getString("title");
        }
        if (options.hasKey("description")) {
            description = options.getString("description");
        }

        if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
            long timestamp = System.currentTimeMillis();
            ContentValues values = new ContentValues(9);
            values.put(MediaStore.Images.Media.TITLE, title);
            values.put(MediaStore.Images.Media.DESCRIPTION, description);
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
            values.put(MediaStore.Images.Media.DATE_TAKEN, timestamp);
            values.put(MediaStore.Images.Media.DISPLAY_NAME, "IMG_" + timestamp + ".jpg");
            values.put(MediaStore.Images.Media.DATE_TAKEN, timestamp);

            uri[0] = reactContext.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

            // 需要对图片设置压缩,所以不适用自带GPS设置
//            intent.putExtra(MediaStore.Images.Media.LATITUDE, latitude);
//            intent.putExtra(MediaStore.Images.Media.LONGITUDE, longitude);

            intent.putExtra(MediaStore.EXTRA_OUTPUT, uri[0]);
        }


        this.reactContext.startActivityForResult(intent, OPEN_CAMERA_REQUEST_CODE, null);
    }

    @ReactMethod
    public void launchEditing(String path, final Promise promise) {
        final Uri[] result = new Uri[1];
        openEditListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_EDIT_REQUEST_CODE == requestCode) {
                    if (RESULT_OK == resultCode) {
                        Log.d(TAG, "编辑成功");

                        WritableMap response = new WritableNativeMap();
                        WritableMap edited = new WritableNativeMap();
                        edited.putString("path", result[0].toString());
                        response.putMap("edited", edited);
                        promise.resolve(response);
                    } else {
                        Log.w(TAG, "编辑失败");
                        promise.reject("EXCEPTION", "编辑失败");
                    }
                    reactContext.removeActivityEventListener(openEditListener);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        };
        this.reactContext.addActivityEventListener(openEditListener);
        // 打开照片编辑
        Intent intent = new Intent("com.android.camera.action.CROP"); //剪裁
        intent.setDataAndType(Uri.parse(path), "image/*");
        result[0] = setEditingParams(intent);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, result[0]);
        reactContext.startActivityForResult(intent, OPEN_EDIT_REQUEST_CODE, null);
    }

    private Uri setEditingParams(Intent intent) {
        intent.putExtra("crop", "true");
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        intent.putExtra("outputX", 200);
        intent.putExtra("outputY", 200);
        intent.putExtra("noFaceDetection", true);
        intent.putExtra("return-data", true);
        intent.putExtra("outputFormat", Bitmap.CompressFormat.JPEG.toString());
        Uri uri = reactContext.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, new ContentValues());
        intent.putExtra(MediaStore.EXTRA_OUTPUT, uri);
        return uri;
    }

    public enum SourceType {
        PhotoLibrary,
        SavedPhotosAlbum,
        Camera
    }

    public enum MediaType {
        Image,
        Video
    }

    public enum CameraType {
        Back,
        Front
    }

    public enum Quality {
        High,
        Medium,
        Low
    }

}
