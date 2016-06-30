package software.sitb.react.media;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import com.facebook.react.bridge.*;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.io.FileUtils;

import javax.annotation.Nullable;
import java.io.File;
import java.io.IOException;
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
        sourceType.put("photoLibrary", 0);
        sourceType.put("savedPhotosAlbum", 1);

        HashMap<String, Object> mediaType = new HashMap<>(2);
        mediaType.put("Image", 0);
        mediaType.put("Video", 1);

        HashMap<String, Object> cameraType = new HashMap<>(2);
        cameraType.put("back", 0);
        cameraType.put("front", 1);


        HashMap<String, Object> constants = new HashMap<>();
        constants.put("sourceType", sourceType);
        constants.put("mediaType", mediaType);
        constants.put("cameraType", cameraType);
        return constants;
    }

    @ReactMethod
    public void launchImageLibrary(final ReadableMap options, final Promise promise) {
        final boolean allowsEditing = options.getBoolean("allowsEditing");

        openImageListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_IMAGE_LIBRARY_REQUEST_CODE == requestCode) {
                    if (resultCode == RESULT_OK) {
                        Log.d(TAG, "处理成功");
                        String url = data.getData().toString();
                        WritableMap response = new WritableNativeMap();

                        if (allowsEditing) {
                            WritableMap edited = new WritableNativeMap();
                            edited.putString("path", url);
                            response.putMap("edited", edited);
                        } else {
                            WritableMap reference = new WritableNativeMap();
                            reference.putString("path", url);
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
        };

        this.reactContext.addActivityEventListener(openImageListener);
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        if (allowsEditing) {
            this.setEditingParams(intent);
        }

        // 打开相册
        this.reactContext.startActivityForResult(intent, OPEN_IMAGE_LIBRARY_REQUEST_CODE, null);
    }

    @ReactMethod
    public void launchCamera(final ReadableMap options, final Promise promise) {

        openCameraListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_CAMERA_REQUEST_CODE == requestCode) {
                    if (RESULT_OK == resultCode) {
                        Log.d(TAG, "拍照成功");
                        Uri uri = data.getData();
                        String url = uri.toString();
                        double longitude = 0,
                                latitude = 0;

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
                                }
                            }
                        }
                        String path = FileUtils.getFilePathFromContentUri(
                                reactContext.getContentResolver(),
                                url,
                                new String[]{MediaStore.Images.Media.DATA}
                        );
                        FileUtils.setImageGps(path, latitude, longitude);
                        WritableMap response = new WritableNativeMap();
                        response.putString("path", url);
                        promise.resolve(response);
                    } else {
                        Log.d(TAG, "拍照取消");
                        promise.reject("CANCEL", "用户取消");
                    }
                    reactContext.removeActivityEventListener(openCameraListener);
                }
            }
        };
        this.reactContext.addActivityEventListener(openCameraListener);
        // 打开相机
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        this.reactContext.startActivityForResult(intent, OPEN_CAMERA_REQUEST_CODE, null);
    }

    @ReactMethod
    public void launchEditing(String path, final Promise promise) {
        openEditListener = new ActivityEventListener() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                if (OPEN_EDIT_REQUEST_CODE == requestCode) {
                    if (RESULT_OK == resultCode) {
                        Log.d(TAG, "编辑成功");
                        Uri uri = data.getData();
                        WritableMap response = new WritableNativeMap();
                        response.putString("path", uri.toString());
                        promise.resolve(response);
                    } else {
                        Log.w(TAG, "编辑失败");
                        promise.reject("EXCEPTION", "编辑失败");
                    }
                    reactContext.removeActivityEventListener(openEditListener);
                }
            }
        };
        this.reactContext.addActivityEventListener(openEditListener);
        // 打开照片编辑
        Intent intent = new Intent("com.android.camera.action.CROP"); //剪裁
        intent.setDataAndType(Uri.parse(path), "image/*");
        setEditingParams(intent);
        reactContext.startActivityForResult(intent, OPEN_EDIT_REQUEST_CODE, null);
    }

    public void setEditingParams(Intent intent) {

        intent.putExtra("crop", "true");
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        intent.putExtra("outputX", 200);
        intent.putExtra("outputY", 200);
        intent.putExtra("noFaceDetection", true);
        intent.putExtra("return-data", true);
        intent.putExtra("outputFormat", Bitmap.CompressFormat.JPEG.toString());

        try {
            File cacheDir = this.reactContext.getExternalCacheDir();
            if (null == cacheDir)
                throw new IOException("无法读取数据目录");
            String filePath = cacheDir.getAbsolutePath() + File.separatorChar + System.currentTimeMillis() + ".jpg";
            Uri tempUri = Uri.fromFile(new File(filePath));
            intent.putExtra(MediaStore.EXTRA_OUTPUT, tempUri);
        } catch (Exception e) {
//            promise.reject("EXCEPTION", "获取目录失败", e);
        }
    }

}
