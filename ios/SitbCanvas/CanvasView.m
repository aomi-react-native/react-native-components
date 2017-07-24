//
// Created by 田尘殇 on 16/7/16.
// Copyright (c) 2016 Sitb Software. All rights reserved.
//

#import "CanvasView.h"


@implementation CanvasView

- (void)drawRect:(CGRect)rect {
    if (self.lines == nil) {
        self.lines = [[NSMutableArray alloc] init];
    }
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetStrokeColorWithColor(context, [[self strokeColor] CGColor]);
    CGContextSetLineCap(context, kCGLineCapRound);
    CGContextSetLineJoin(context, kCGLineJoinRound);
    CGContextSetLineWidth(context, self.lineWidth);
    for (NSMutableArray *line in self.lines) {
        for (NSUInteger i = 0; i < [line count] - 1; i++) {
            NSDictionary *current = line[i];
            NSDictionary *next = line[i + 1];
            CGContextMoveToPoint(context, [current[@"x"] floatValue], [current[@"y"] floatValue]);
            CGContextAddLineToPoint(context, [next[@"x"] floatValue], [next[@"y"] floatValue]);
        }

        CGContextStrokePath(context);
    }
    CGContextStrokePath(context);
}

- (void)setLines:(NSMutableArray *)lines {
    _lines = lines;
    [self setNeedsDisplay];
}

- (UIImage *)capture {
    CGRect rect = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
    return [self captureViewWithFrame:rect];
}

- (UIImage *)captureViewWithFrame:(CGRect)fra {
    UIGraphicsBeginImageContext(self.frame.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    [self.layer renderInContext:context];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    CGImageRef ref = CGImageCreateWithImageInRect(img.CGImage, fra);
    UIImage *i = [UIImage imageWithCGImage:ref];
    CGImageRelease(ref);
    return i;
}

@end