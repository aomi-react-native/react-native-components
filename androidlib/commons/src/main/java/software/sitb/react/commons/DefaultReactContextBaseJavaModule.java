package software.sitb.react.commons;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public abstract class DefaultReactContextBaseJavaModule extends ReactContextBaseJavaModule {

    protected ReactApplicationContext reactContext;

    public DefaultReactContextBaseJavaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    /**
     * 向JS发送事件
     *
     * @param event 事件名称
     * @param data  数据
     */
    public void sendEvent(String event, WritableMap data) {
        DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        eventEmitter.emit(event, data);
    }
}
