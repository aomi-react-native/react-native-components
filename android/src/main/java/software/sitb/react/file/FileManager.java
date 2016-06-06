package software.sitb.react.file;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import software.sitb.react.DefaultReactContextBaseJavaModule;
import software.sitb.react.Error;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * 文件工具
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class FileManager extends DefaultReactContextBaseJavaModule {

    private ReactApplicationContext context;

    public FileManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return "SitbRNFileManager";
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
        String path = getFilePathFromContentUri(uriStr, new String[]{MediaStore.Images.Media.DATA});
        readFile(path, promise);
    }

    /**
     * uri 转换为 file path
     *
     * @param uriStr 资源URI
     * @return file path
     */
    public String getFilePathFromContentUri(String uriStr, String[] filePathColumn) {
        Uri uri = Uri.parse(uriStr);
        Cursor cursor = this.context.getContentResolver().query(uri, filePathColumn, null, null, null);
        if (null != cursor) {
            cursor.moveToFirst();
            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String filePath = cursor.getString(columnIndex);
            cursor.close();

            return filePath;
        }

        return null;
    }
}
