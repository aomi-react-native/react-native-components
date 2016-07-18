package software.sitb.canvas;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.View;

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

    private Set<Point> points = new HashSet<>(50);

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
                        invalidate();
                    }
                }
            }
        }
    }


    public void setLineWidth(float lineWidth) {
        paint.setStrokeWidth(lineWidth);
        invalidate();
    }

    public void setStrokeColor(int strokeColor) {
        paint.setColor(strokeColor);
        invalidate();
    }
}
