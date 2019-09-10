package software.sitb.react.camera;

import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.provider.MediaStore;
import com.facebook.react.bridge.*;
import com.facebook.react.common.network.OkHttpCallUtil;
import com.facebook.react.module.annotations.ReactModule;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import java.io.*;

/**
 * @author Sean sean.snow@live.com createAt 2017/4/18
 */
@ReactModule(name = CameraRollManager.NAME)
public class CameraRollManager extends DefaultReactContextBaseJavaModule {

  protected static final String NAME = "SitbCameraRollManager";

  private static final OkHttpClient client = new OkHttpClient();

  private static final String ERROR_UNABLE_TO_LOAD = "E_UNABLE_TO_LOAD";
  private static final String ERROR_UNABLE_TO_LOAD_PERMISSION = "E_UNABLE_TO_LOAD_PERMISSION";
  private static final String ERROR_UNABLE_TO_SAVE = "E_UNABLE_TO_SAVE";


  public CameraRollManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  /**
   * Save an image to the gallery (i.e. {@link MediaStore.Images}). This copies the original file
   * from wherever it may be to the external storage pictures directory, so that it can be scanned
   * by the MediaScanner.
   *
   * @param tag     the file:// or base64 or net uri URI of the image to save
   * @param promise to be resolved or rejected
   */
  @ReactMethod
  public void saveToCameraRoll(String tag, String type, Promise promise) {
    if (tag.startsWith("http://") || tag.startsWith("https://")) {
      new SaveToCameraRoll(getReactApplicationContext(), tag, promise)
        .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    } else {
      new com.facebook.react.modules.camera.CameraRollManager(getReactApplicationContext())
        .saveToCameraRoll(tag, type, promise);
    }
  }


  private static class SaveToCameraRoll extends GuardedAsyncTask<Void, Void> {

    private String url;
    private Promise promise;
    private ReactContext reactContext;
    private String filename;

    public SaveToCameraRoll(ReactContext reactContext, String url, Promise promise) {
      super(reactContext);
      this.reactContext = reactContext;
      this.url = url;
      this.promise = promise;
      this.filename = System.currentTimeMillis() + ".jpg";
    }

    @Override
    protected void doInBackgroundGuarded(Void... voids) {
      try {
        Response response = client.newCall(new Request.Builder()
          .url(this.url)
          .build()).execute();
        if (response.isSuccessful()) {
          InputStream inputStream = response.body().byteStream();

          File exportDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
          exportDir.mkdirs();
          if (!exportDir.isDirectory()) {
            promise.reject(ERROR_UNABLE_TO_LOAD, "External media storage directory not available");
            return;
          }
          File dest = new File(exportDir, filename);
          int n = 0;
          String sourceName, sourceExt;
          if (filename.indexOf('.') >= 0) {
            sourceName = filename.substring(0, filename.lastIndexOf('.'));
            sourceExt = filename.substring(filename.lastIndexOf('.'));
          } else {
            sourceName = filename;
            sourceExt = "";
          }
          while (!dest.createNewFile()) {
            dest = new File(exportDir, sourceName + "_" + (n++) + sourceExt);
          }

          FileOutputStream outputStream = new FileOutputStream(dest);
          int oneByte;
          while ((oneByte = inputStream.read()) != -1) {
            outputStream.write(oneByte);
          }

          inputStream.close();
          outputStream.close();

          MediaScannerConnection.scanFile(
            reactContext,
            new String[]{dest.getAbsolutePath()},
            null,
            new MediaScannerConnection.OnScanCompletedListener() {
              @Override
              public void onScanCompleted(String path, Uri uri) {
                if (uri != null) {
                  promise.resolve(uri.toString());
                } else {
                  promise.reject(ERROR_UNABLE_TO_SAVE, "Could not add image to gallery");
                }
              }
            });
        }
      } catch (IOException e) {
        promise.reject(e);
      }

    }
  }
}
