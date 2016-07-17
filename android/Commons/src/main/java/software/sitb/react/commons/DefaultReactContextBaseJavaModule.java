package software.sitb.react.commons;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public abstract class DefaultReactContextBaseJavaModule extends ReactContextBaseJavaModule {

    protected ReactApplicationContext context;

    public DefaultReactContextBaseJavaModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}
