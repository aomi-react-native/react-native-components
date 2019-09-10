package software.sitb.react.local.authentication;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author Sean sean.snow@live.com createAt 2017/9/30
 */
public class LocalAuthenticationPackage extends DefaultReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(
                new LocalAuthentication(reactContext)
        );
    }
}
