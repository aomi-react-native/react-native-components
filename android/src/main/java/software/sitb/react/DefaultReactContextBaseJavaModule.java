package software.sitb.react;

import android.content.Context;
import android.support.annotation.Nullable;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * 基本的React Java 模块，提供向JS发送event的公共方法
 *
 * @author Sean sean.snow@live.com
 *         date 2015/12/2
 */
public abstract class DefaultReactContextBaseJavaModule extends ReactContextBaseJavaModule {

    protected ReactApplicationContext reactContext;

    public DefaultReactContextBaseJavaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    /**
     * 给他JS发送事件
     *
     * @param eventName 事件名称
     * @param params    参数
     */
    public void sendEvent(String eventName, @Nullable WritableMap params) {
        String msg = String.format("向JS发送%s事件,参数->%s", eventName, params);
        Log.d("JavaScriptEvent", msg);
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    protected Context getContext() {
        return this.reactContext.getApplicationContext();
    }


}
