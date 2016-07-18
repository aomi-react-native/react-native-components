package software.sitb.canvas;

import android.graphics.Color;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import software.sitb.react.commons.DefaultReactContextBaseJavaModule;

import java.util.ArrayList;
import java.util.List;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CanvasViewManager extends SimpleViewManager<CanvasView> {

    @Override
    public String getName() {
        return "SitbRCTCanvasView";
    }

    @Override
    protected CanvasView createViewInstance(ThemedReactContext reactContext) {
        return new CanvasView(reactContext);
    }

    @ReactMethod
    public void capture(String mimeType, Promise promise) {

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

}
