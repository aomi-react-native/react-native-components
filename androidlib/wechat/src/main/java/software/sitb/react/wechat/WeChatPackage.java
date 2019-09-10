package software.sitb.react.wechat;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author Sean sean.snow@live.com createAt 2017/5/23
 */
public class WeChatPackage extends DefaultReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(new WeChatManager(reactContext));
    }
}
