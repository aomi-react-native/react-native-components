package software.sitb.react.io;

import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.Error;

import java.io.*;

/**
 * 文件工具
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class FileUtils extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "FileUtils";

    private ReactApplicationContext context;

    public FileUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return "SitbFileManager";
    }

    /**
     * 读取文件
     *
     * @param path    文件路径
     * @param promise 异步回调
     */
    @ReactMethod
    public void readFile(String path, final Promise promise) {
        if (path == null || path.trim().isEmpty()) {
            promise.reject(Error.PARAMS_ERROR, "path is not empty", new IllegalArgumentException("path is not empty"));
        } else {
            FileInputStream inputStream = null;
            ByteArrayOutputStream outputStream = null;
            try {
                inputStream = new FileInputStream(path);
                outputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[256 * 256];
                int len;
                while ((len = inputStream.read(buffer)) > 0) {
                    outputStream.write(buffer, 0, len);
                }
                byte[] result = outputStream.toByteArray();
                promise.resolve(Base64.encodeToString(result, Base64.NO_WRAP));
            } catch (IOException e) {
                promise.reject(Error.EXCEPTION, e.getMessage(), e);
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException ignored) {
                    }
                }

                if (outputStream != null) {
                    try {
                        outputStream.close();
                    } catch (IOException ignored) {
                    }
                }
            }
        }
    }

    /**
     * 通过URI获取一个图片
     *
     * @param uriStr  图片URI
     * @param promise 异步回调
     */
    @ReactMethod
    public void getPhotoByContentUri(String uriStr, Promise promise) {
        String path = getFilePathFromContentUri(
                this.context.getContentResolver(),
                uriStr,
                new String[]{MediaStore.Images.Media.DATA}
        );
        readFile(path, promise);
    }

    /**
     * uri 转换为 file path
     *
     * @param uriStr 资源URI
     * @return file path
     */
    public static String getFilePathFromContentUri(ContentResolver contentResolver, String uriStr, String[] filePathColumn) {
        Uri uri = Uri.parse(uriStr);
        Cursor cursor = contentResolver.query(uri, filePathColumn, null, null, null);
        if (null != cursor) {
            cursor.moveToFirst();
            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String filePath = cursor.getString(columnIndex);
            cursor.close();

            return filePath;
        }

        return null;
    }


    public static void compressImage(ContentResolver contentResolver, Uri uri, int quality) {
        OutputStream imageOut = null;
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri);
            imageOut = contentResolver.openOutputStream(uri);
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, imageOut);
        } catch (IOException e) {
            Log.e(TAG, "压缩图片失败", e);
        } finally {
            if (null != imageOut)
                try {
                    imageOut.close();
                } catch (IOException ignored) {
                }
        }
    }

    public static void autofixOrientation(ContentResolver contentResolver, String path) {
        int degree = readPictureDegree(path);
        Bitmap bitmap = BitmapFactory.decodeFile(path);
        Bitmap newBitmap = rotaingImageView(degree, bitmap);
        OutputStream imageOut = null;
        try {
            imageOut = contentResolver.openOutputStream(Uri.fromFile(new File(path)));
            newBitmap.compress(Bitmap.CompressFormat.JPEG, 100, imageOut);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != imageOut)
                try {
                    imageOut.close();
                } catch (IOException ignored) {
                }
        }
    }

    public static void setImageGps(String path, double latitude, double longitude) {
        try {
            ExifInterface exif = new ExifInterface(path);
            exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE, toGps(latitude));
            exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE_REF, latitude > 0 ? "N" : "S");
            exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE, toGps(longitude));
            exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE_REF, longitude > 0 ? "E" : "W");
            exif.saveAttributes();
        } catch (IOException e) {
            Log.e(TAG, "设置GPS失败", e);
        }
    }

    public static String toGps(double gps) {
        int a = (int) gps;
        double bb = (gps - a) * 60;
        int b = (int) bb;
        double cc = bb - b;
        String c = (cc * 60) + "";
        return a + "," + b + "," + c + "";
    }

    /**
     * 读取图片属性：旋转的角度
     *
     * @param path 图片绝对路径
     * @return degree旋转的角度
     */
    public static int readPictureDegree(String path) {
        int degree = 0;
        try {
            ExifInterface exifInterface = new ExifInterface(path);
            int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    degree = 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    degree = 180;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    degree = 270;
                    break;
            }
        } catch (IOException e) {
            Log.e(TAG, "读取图片信息失败", e);
        }
        return degree;
    }

    /**
     * 旋转图片
     *
     * @param angle  度数
     * @param bitmap 图片
     * @return Bitmap
     */
    public static Bitmap rotaingImageView(int angle, Bitmap bitmap) {
        //旋转图片 动作
        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        // 创建新的图片
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    }
}
