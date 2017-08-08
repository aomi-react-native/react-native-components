package software.sitb.react.utils;

import android.app.PendingIntent;
import android.content.Intent;
import android.net.Uri;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import java.util.Arrays;

/**
 * @author Sean sean.snow@live.com createAt 2017/8/8
 */
@ReactModule(name = SmsManager.MODULE_NAME)
public class SmsManager extends DefaultReactContextBaseJavaModule {

    public static final String MODULE_NAME = "SitbSmsManager";

    public SmsManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * 发送短信
     *
     * @param recipients 收件人
     * @param body       短信内容
     * @param promise    响应结果处理函数
     */
    @ReactMethod
    public void sendSms(ReadableArray recipients, String body, Promise promise) {
        if (0 == recipients.size()) {
            promise.reject("EXCEPTION", "收件人不能为空");
            return;
        }

        StringBuilder recipientStr = new StringBuilder("smsto:");
        for (int i = 0; i < recipients.size(); i++) {
            recipientStr.append(recipients.getString(i)).append(",");
        }

        Uri uri = Uri.parse(recipientStr.toString());
        Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
        intent.putExtra("sms_body", body);

        getReactApplicationContext().startActivity(intent);
    }

}
