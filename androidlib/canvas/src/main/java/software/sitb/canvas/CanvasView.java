package software.sitb.canvas;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import com.facebook.react.bridge.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author 田尘殇Sean sean.snow@live.com
 */
public class CanvasView extends View {

    // 画笔路径
    private Path path;

    // 画笔
    private Paint paint;

    private float lineWidth;
    private int strokeColor;

    private Set<Point> points = new HashSet<>(50);

    private Bitmap.CompressFormat format;

    public CanvasView(Context context) {
        super(context);
        path = new Path();

        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeCap(Paint.Cap.ROUND);
        paint.setDither(true);
        paint.setFilterBitmap(true);
        paint.setSubpixelText(true);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        paint.setStrokeWidth(lineWidth);
        paint.setColor(strokeColor);
        canvas.drawPath(path, paint);
    }

    public void setLines(List<List<Point>> lines) {
        if (lines == null || lines.isEmpty()) {
            this.points.clear();
            path.reset();
            invalidate();
        } else {
            for (List<Point> line : lines) {
                for (int i = 0; i < line.size(); i++) {
                    Point point = line.get(i);
                    if (this.points.contains(point)) {
                        continue;
                    }
                    this.points.add(point);
                    float x = point.x;
                    float y = point.y;
                    if (i == 0) {
                        path.moveTo(x, y);
                    } else {
                        path.lineTo(x, y);
                        path.moveTo(x, y);
                    }
                }
            }
            invalidate();
        }
    }

    public void setLineWidth(float lineWidth) {
        this.lineWidth = lineWidth;
    }

    public void setStrokeColor(int strokeColor) {
        this.strokeColor = strokeColor;
    }


    public void setCaptureData(final Callback callback) {
        new GuardedAsyncTask<Void, Integer>((ReactContext) getContext()) {
            @Override
            protected void doInBackgroundGuarded(Void... params) {
                Bitmap screenshot = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(screenshot);
                canvas.translate(-getScrollX(), -getScrollY());
                draw(canvas);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                screenshot.compress(format, 100, outputStream);

                String data = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
                try {
                    outputStream.close();
                } catch (IOException e) {
                    Log.e("", e.getMessage(), e);
                }
                WritableMap event = Arguments.createMap();
                event.putString("data", data);

            }
        }.execute();
    }

    public void setFormat(Bitmap.CompressFormat format) {
        this.format = format;
    }
}
