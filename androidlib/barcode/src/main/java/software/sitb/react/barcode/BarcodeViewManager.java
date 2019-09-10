package software.sitb.react.barcode;

import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;

import java.io.IOException;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class BarcodeViewManager extends SimpleViewManager<BarcodeView> {

  private BarcodeView view;

  private ReactContext context;

  @Override
  public String getName() {
    return "SitbBarcodeView";
  }

  @Override
  protected BarcodeView createViewInstance(ThemedReactContext reactContext) {
    BarcodeView view = new BarcodeView(reactContext);
    this.view = view;
    return view;
  }

  @ReactMethod
  public void stopCapture() {
    this.view.getCameraManager().release();
  }

  @ReactMethod
  public void scanImage(ReadableMap options, Promise promise) {
    Map<DecodeHintType, Object> hints = new EnumMap<>(DecodeHintType.class);
    hints.put(DecodeHintType.POSSIBLE_FORMATS, Arrays.asList(BarcodeFormat.AZTEC, BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX));
    if (options.hasKey("characterSet")) {
      hints.put(DecodeHintType.CHARACTER_SET, options.getString("characterSet")); // 设置二维码内容的编码
    }

    if (!options.hasKey("path")) {
      promise.reject("EXCEPTION", "缺少图片路径");
      return;
    }
    String path = options.getString("path");

    Uri uri = Uri.parse(path);
    try {
      Bitmap bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), uri);
      BitmapLuminanceSource source = new BitmapLuminanceSource(bitmap);
      BinaryBitmap binaryBitmap = new BinaryBitmap(new HybridBinarizer(source));
      Result rawResult = new MultiFormatReader().decode(binaryBitmap, hints);
      if (null == rawResult) {
        promise.reject("EXCEPTION", "没有发现数据");
      } else {
        WritableMap result = Arguments.createMap();
        result.putString("format", rawResult.getBarcodeFormat().toString());
        result.putString("text", rawResult.getText());
        promise.resolve(result);
      }
    } catch (IOException | NotFoundException e) {
      promise.reject(e.getMessage(), e);
    }


  }

  public void setContext(ReactContext context) {
    this.context = context;
  }

  public static class BitmapLuminanceSource extends LuminanceSource {

    private byte[] bitmapPixels;

    protected BitmapLuminanceSource(Bitmap bitmap) {
      super(bitmap.getWidth(), bitmap.getHeight());

      // 首先，要取得该图片的像素数组内容
      int[] data = new int[bitmap.getWidth() * bitmap.getHeight()];
      this.bitmapPixels = new byte[bitmap.getWidth() * bitmap.getHeight()];
      bitmap.getPixels(data, 0, getWidth(), 0, 0, getWidth(), getHeight());

      // 将int数组转换为byte数组
      for (int i = 0; i < data.length; i++) {
        this.bitmapPixels[i] = (byte) data[i];
      }
    }

    @Override
    public byte[] getRow(int y, byte[] row) {
      System.arraycopy(bitmapPixels, y * getWidth(), row, 0, getWidth());
      return row;
    }

    @Override
    public byte[] getMatrix() {
      return bitmapPixels;
    }
  }

}
