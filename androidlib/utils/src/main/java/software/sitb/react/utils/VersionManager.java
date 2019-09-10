package software.sitb.react.utils;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import com.facebook.react.bridge.*;
import okhttp3.OkHttpClient;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;
import software.sitb.react.commons.utils.FileUtils;

/**
 * @author Sean sean.snow@live.com createAt 2017/5/12
 */
public class VersionManager extends DefaultReactContextBaseJavaModule {

  private static final String TAG = "VersionManager";

  private ReactApplicationContext context;

  public VersionManager(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
  }

  @Override
  public String getName() {
    return "SitbVersionManager";
  }

  @ReactMethod
  public void getPackageInfo(Promise promise) {
    try {
      PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
      WritableMap response = Arguments.createMap();
      response.putString("packageName", info.packageName);
      response.putInt("versionCode", info.versionCode);
      response.putString("versionName", info.versionName);

      promise.resolve(response);
    } catch (PackageManager.NameNotFoundException e) {
      Log.e(TAG, "获取PackageInfo信息失败", e);
      promise.reject(e);
    }

  }

  @ReactMethod
  public void installApk(ReadableMap args, final Promise promise) {
    final DownloadManager downloadManager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
    String downloadUrl = args.getString("downloadUrl");

    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(downloadUrl));

    if (args.hasKey("title")) {
      request.setTitle(args.getString("title"));
    }

    if (args.hasKey("description")) {
      request.setDescription(args.getString("description"));
    }

    final long downloadId = downloadManager.enqueue(request);

    Log.d(TAG, "download id = " + downloadId);


    BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        long completeDownloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
        if (completeDownloadId == downloadId) {
          Log.d(TAG, "app 下载成功");
          Uri uri = downloadManager.getUriForDownloadedFile(downloadId);
          Log.d(TAG, "SDK_INT");

          Uri apkUri;
          if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
            apkUri = uri;
          } else {
            String filePath = FileUtils.getFilePathFromContentUri(context.getContentResolver(), uri);
            Log.d(TAG, "file path: " + filePath);
            apkUri = Uri.parse("file://" + filePath);
          }

          Intent installIntent = new Intent(Intent.ACTION_VIEW);
          installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
          installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
          context.startActivity(installIntent);
          context.unregisterReceiver(this);
        }
      }
    };
    context.registerReceiver(broadcastReceiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
  }

}
