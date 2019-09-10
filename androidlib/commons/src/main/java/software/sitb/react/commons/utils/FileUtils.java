package software.sitb.react.commons.utils;

import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

/**
 * 文件工具
 *
 * @author 田尘殇Sean sean.snow@live.com
 */
public class FileUtils {

  private static final String TAG = "FileUtils";

  /**
   * uri 转换为 file path
   *
   * @param uriStr 资源URI
   * @return file path
   */
  public static String getFilePathFromContentUri(ContentResolver contentResolver, String uriStr) {
    Uri uri = Uri.parse(uriStr);
    return getFilePathFromContentUri(contentResolver, uri);
  }

  public static String getFilePathFromContentUri(ContentResolver contentResolver, Uri uri) {
    Cursor cursor = contentResolver.query(uri, new String[]{MediaStore.Images.Media.DATA}, null, null, null);
    if (null != cursor) {
      cursor.moveToFirst();
      int columnIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATA);
      String filePath = cursor.getString(columnIndex);
      cursor.close();

      return filePath;
    }

    return null;
  }
}
