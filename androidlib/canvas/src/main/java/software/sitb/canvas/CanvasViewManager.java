package software.sitb.canvas;

import android.graphics.Bitmap;
import android.graphics.Color;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.List;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CanvasViewManager extends SimpleViewManager<CanvasView> {

    private static final String NAME = "SitbRCTCanvasView";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    protected CanvasView createViewInstance(ThemedReactContext reactContext) {
        return new CanvasView(reactContext);
    }

    @ReactProp(name = "lines")
    public void setLines(CanvasView view, ReadableArray lines) {
        List<List<Point>> result = new ArrayList<>(lines.size());
        for (int i = 0; i < lines.size(); i++) {
            ReadableArray line = lines.getArray(i);
            List<Point> linePoints = new ArrayList<>();
            for (int j = 0; j < line.size(); j++) {
                ReadableMap point = line.getMap(j);
                float x = (float) point.getDouble("x");
                float y = (float) point.getDouble("y");
                linePoints.add(new Point(x, y));
            }
            result.add(linePoints);
        }
        view.setLines(result);
    }

    @ReactProp(name = "lineWidth")
    public void setLineWidth(CanvasView view, float lineWidth) {
        view.setLineWidth(lineWidth);
    }

    @ReactProp(name = "strokeColor")
    public void setStrokeColor(CanvasView view, String strokeColor) {
        view.setStrokeColor(Color.parseColor(strokeColor));
    }

    @ReactProp(name = "format")
    public void setFormat(CanvasView view, String format) {
        view.setFormat(Bitmap.CompressFormat.valueOf(format.toUpperCase()));
    }

    @ReactProp(name = "setStrokeColorAndroid")
    public void setSetCaptureData(CanvasView view, Callback setCaptureDataAndroid) {
        view.setCaptureData(setCaptureDataAndroid);
    }

}
