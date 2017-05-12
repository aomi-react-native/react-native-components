package software.sitb.react.utils;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import software.sitb.react.commons.DefaultReactPackage;

import java.util.Collections;
import java.util.List;

/**
 * @author Sean sean.snow@live.com createAt 2017/5/12
 */
public class UtilsPackage extends DefaultReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Collections.<NativeModule>singletonList(new VersionManager(reactContext));
  }
}
