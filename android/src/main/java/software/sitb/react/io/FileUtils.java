package software.sitb.react.io;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
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

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

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


    public static String saveImageToCameraColl(
            Context context,
            byte[] data,
            String title,
            String description,
            String longitude,
            String latitude,
            String timestamp
    ) {
        BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
        Bitmap bitmap = BitmapFactory.decodeByteArray(data, 0, data.length, bitmapOptions);
        ContentValues values = new ContentValues();

        values.put(MediaStore.Images.Media.TITLE, title);
        values.put(MediaStore.Images.Media.DESCRIPTION, description);
        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
        values.put(MediaStore.Images.Media.LATITUDE, latitude);
        values.put(MediaStore.Images.Media.LONGITUDE, longitude);
        values.put(MediaStore.Images.Media.DATE_TAKEN, timestamp);

        return insertImage(
                context.getContentResolver(),
                values,
                bitmap
        );
    }

    public static void compressImage(ContentResolver contentResolver, Uri uri, int quality) {
        OutputStream imageOut = null;
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri);
            imageOut = contentResolver.openOutputStream(uri);
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, imageOut);
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

    public static String insertImage(ContentResolver cr, ContentValues values, Bitmap source) {

        Uri url = null;
        String stringUrl = null;    /* value to be returned */

        try {
            url = cr.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

            if (source != null && url != null) {
                OutputStream imageOut = cr.openOutputStream(url);
                try {
                    source.compress(Bitmap.CompressFormat.JPEG, 50, imageOut);
                } finally {
                    if (imageOut != null) {
                        imageOut.close();
                    }
                }

                long id = ContentUris.parseId(url);

                // Wait until MINI_KIND thumbnail is generated.
                Bitmap miniThumb = MediaStore.Images.Thumbnails.getThumbnail(cr, id, MediaStore.Images.Thumbnails.MINI_KIND, null);

                // This is for backward compatibility.
                //Bitmap microThumb = StoreThumbnail(cr, miniThumb, id, 50F, 50F, MediaStore.Images.Thumbnails.MICRO_KIND);
                StoreThumbnail(cr, miniThumb, id, 50F, 50F, MediaStore.Images.Thumbnails.MICRO_KIND);
            } else {
                Log.e(TAG, "Failed to create thumbnail, removing original");
                assert url != null;
                cr.delete(url, null, null);
                url = null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to insert image", e);
            if (url != null) {
                cr.delete(url, null, null);
                url = null;
            }
        }

        if (url != null) {
            stringUrl = url.toString();
        }

        return stringUrl;
    }

    private static Bitmap StoreThumbnail(ContentResolver cr, Bitmap source, long id, float width, float height, int kind) {
        // create the matrix to scale it
        Matrix matrix = new Matrix();

        float scaleX = width / source.getWidth();
        float scaleY = height / source.getHeight();

        matrix.setScale(scaleX, scaleY);

        Bitmap thumb = Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);

        ContentValues values = new ContentValues(4);
        values.put(MediaStore.Images.Thumbnails.KIND, kind);
        values.put(MediaStore.Images.Thumbnails.IMAGE_ID, (int) id);
        values.put(MediaStore.Images.Thumbnails.HEIGHT, thumb.getHeight());
        values.put(MediaStore.Images.Thumbnails.WIDTH, thumb.getWidth());

        Uri url = cr.insert(MediaStore.Images.Thumbnails.EXTERNAL_CONTENT_URI, values);

        try {
            assert url != null;
            OutputStream thumbOut = cr.openOutputStream(url);

            thumb.compress(Bitmap.CompressFormat.JPEG, 100, thumbOut);
            assert thumbOut != null;
            thumbOut.close();
            return thumb;
        } catch (IOException ex) {
            return null;
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
}
