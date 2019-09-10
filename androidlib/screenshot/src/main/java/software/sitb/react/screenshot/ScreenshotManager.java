package software.sitb.react.screenshot;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

/**
 * @author Sean sean.snow@live.com createAt 2017/7/14
 */
public class ScreenshotManager extends DefaultReactContextBaseJavaModule {

    private static final String TAG = "ScreenshotManager";

    private static final String EVENT_NAME = "UserDidTakeScreenshot";

    private static final String[] KEYWORDS = {
            "screenshot", "screen_shot", "screen-shot", "screen shot",
            "screencapture", "screen_capture", "screen-capture", "screen capture",
            "screencap", "screen_cap", "screen-cap", "screen cap"
    };

    /**
     * 读取媒体数据库时需要读取的列
     */
    private static final String[] MEDIA_PROJECTIONS = {
            MediaStore.Images.ImageColumns.DATA,
            MediaStore.Images.ImageColumns.DATE_TAKEN,
    };

    /**
     * 内部存储器内容观察者
     */
    private MediaContentObserver internalObserver;

    /**
     * 外部存储器内容观察者
     */
    private MediaContentObserver externalObserver;

    /**
     * 已回调过的路径
     */
    private final static List<String> callbackPaths = new ArrayList<>();


    public ScreenshotManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SitbScreenshotManager";
    }

    @ReactMethod
    public void startListener() {
        if (null != internalObserver || null != externalObserver) {
            Log.d(TAG, "已经在监听屏幕截图了");
            return;
        }

        HandlerThread handlerThread = new HandlerThread("Screenshot_Observer");
        handlerThread.start();
        Handler handler = new Handler(handlerThread.getLooper());

        // 初始化
        internalObserver = new MediaContentObserver(MediaStore.Images.Media.INTERNAL_CONTENT_URI, handler);
        externalObserver = new MediaContentObserver(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, handler);

        getReactApplicationContext().getContentResolver().registerContentObserver(
                MediaStore.Images.Media.INTERNAL_CONTENT_URI,
                false,
                internalObserver
        );
        getReactApplicationContext().getContentResolver().registerContentObserver(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                false,
                externalObserver
        );
    }

    @ReactMethod
    public void stopListener() {
        try {
            if (null != internalObserver) {
                getReactApplicationContext().getContentResolver().unregisterContentObserver(internalObserver);
            }
            if (null != externalObserver) {
                getReactApplicationContext().getContentResolver().unregisterContentObserver(externalObserver);
            }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
        }
    }

    private void handleMediaContentChange(Uri contentUri) {
        Cursor cursor = null;
        try {
            // 数据改变时查询数据库中最后加入的一条数据
            cursor = getReactApplicationContext().getContentResolver().query(
                    contentUri,
                    MEDIA_PROJECTIONS,
                    null,
                    null,
                    MediaStore.Images.ImageColumns.DATE_ADDED + " desc limit 1"
            );

            if (cursor == null) {
                return;
            }
            if (!cursor.moveToFirst()) {
                return;
            }

            // 获取各列的索引
            int dataIndex = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
            int dateTakenIndex = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATE_TAKEN);

            // 获取行数据
            String data = cursor.getString(dataIndex);
            long dateTaken = cursor.getLong(dateTakenIndex);

            // 处理获取到的第一行数据
            handleMediaRowData(data, dateTaken);

        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
        }
    }

    /**
     * 处理监听到的资源
     */
    private void handleMediaRowData(String data, long dateTaken) {
        if (checkScreenShot(data, dateTaken)) {
            Log.d(TAG, data + " " + dateTaken);
            if (!hasCallback(data)) {
                sendEvent(EVENT_NAME, Arguments.createMap());
            }
        } else {
            Log.w(TAG, "Media content changed, but not screenshot: path = " + data + "; date = " + dateTaken);
        }
    }

    /**
     * 判断是否是截屏
     */
    private boolean checkScreenShot(String data, long dateTaken) {

        data = data.toLowerCase();
        // 判断图片路径是否含有指定的关键字之一, 如果有, 则认为当前截屏了
        for (String keyWork : KEYWORDS) {
            if (data.contains(keyWork)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断是否已回调过, 某些手机ROM截屏一次会发出多次内容改变的通知; <br/>
     * 删除一个图片也会发通知, 同时防止删除图片时误将上一张符合截屏规则的图片当做是当前截屏.
     */
    private boolean hasCallback(String imagePath) {
        if (callbackPaths.contains(imagePath)) {
            Log.d(TAG, "ScreenShot: imgPath has done imagePath = " + imagePath);
            return true;
        }
        // 大概缓存15~20条记录便可
        if (callbackPaths.size() >= 20) {
            for (int i = 0; i < 5; i++) {
                callbackPaths.remove(0);
            }
        }
        callbackPaths.add(imagePath);
        return false;
    }

    /**
     * 媒体内容观察者(观察媒体数据库的改变)
     */
    private class MediaContentObserver extends ContentObserver {

        private Uri mContentUri;

        public MediaContentObserver(Uri contentUri, Handler handler) {
            super(handler);
            mContentUri = contentUri;
        }

        @Override
        public void onChange(boolean selfChange) {
            super.onChange(selfChange);
            Log.d(TAG, mContentUri.toString());
            handleMediaContentChange(mContentUri);
        }
    }

}
