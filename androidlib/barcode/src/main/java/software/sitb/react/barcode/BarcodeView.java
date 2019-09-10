package software.sitb.react.barcode;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.os.AsyncTask;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import software.sitb.react.camera.CameraView;
import software.sitb.react.camera.commons.CameraFacing;
import software.sitb.react.camera.commons.Orientation;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class BarcodeView extends CameraView implements Camera.PreviewCallback {

  private static final String TAG = "BarcodeView";

  private Map<DecodeHintType, Object> hints;

  private ReactContext context;

  private byte[] callbackBuffer;

  private int width;
  private int height;

  public BarcodeView(Context context) {
    super(context);
    this.context = (ReactContext) context;
    hints = new EnumMap<>(DecodeHintType.class);
    hints.put(DecodeHintType.POSSIBLE_FORMATS,
      Arrays.asList(BarcodeFormat.AZTEC, BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX));
    setCameraFacing(CameraFacing.BACK);
    setOrientation(Orientation.AUTO);
  }

  @Override
  public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
    super.onSurfaceTextureAvailable(surface, width, height);
    Camera.Parameters parameters = getCameraManager().getCamera().getParameters();
    Camera.Size previewSize = parameters.getPreviewSize();
    this.height = previewSize.height;
    this.width = previewSize.width;
    callbackBuffer = new byte[(this.height * this.width * 3) / 2];
    getCameraManager().setPreviewCallbackWithBuffer(this);
    getCameraManager().setCallbackBuffer(callbackBuffer);
  }

  @Override
  public void onPreviewFrame(final byte[] data, final Camera camera) {
    new AsyncTask<byte[], Void, Void>() {

      @Override
      protected Void doInBackground(byte[]... params) {
        decode(params[0]);
        return null;
      }

      private void decode(byte[] data) {

        Result rawResult = null;

        int subtendedWidth = width / 2;
        int subtendedHeight = height / 2;
        int excessWidth = width - subtendedWidth;
        int excessHeight = height - subtendedHeight;

        //long start = System.currentTimeMillis();
        PlanarYUVLuminanceSource source =
          new PlanarYUVLuminanceSource(data,
            width, height,
            excessWidth / 2, excessHeight / 2,
            subtendedWidth, subtendedHeight,
            false);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        try {
          rawResult = new MultiFormatReader().decode(bitmap, hints);
        } catch (ReaderException re) {
          // continue
        }
        if (rawResult == null) {
          getCameraManager().setCallbackBuffer(callbackBuffer);
        } else {
          Log.i(TAG, "Decode succeeded: " + rawResult.getText());
          getCameraManager().release();

          WritableMap result = Arguments.createMap();
          result.putString("format", rawResult.getBarcodeFormat().toString());
          result.putString("text", rawResult.getText());
          DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
          eventEmitter.emit("onSuccess", result);
        }
      }

    }.execute(data);
  }

}
