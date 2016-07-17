//
// Created by 田尘殇 on 16/7/16.
// Copyright (c) 2016 Sitb Software. All rights reserved.
//

#import "CanvasViewManager.h"

@implementation CanvasViewManager

RCT_EXPORT_MODULE(SitbRCTCanvasView);


#pragma mark - view properties

RCT_EXPORT_VIEW_PROPERTY(lines, NSArray);

RCT_EXPORT_VIEW_PROPERTY(lineWidth, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor);

#pragma mark - view method

RCT_EXPORT_METHOD(
        capture:
        (NSString *) mimeType
        resolver:
        (RCTPromiseResolveBlock) resolve
        reject:
        (RCTPromiseRejectBlock) reject) {
    UIImage *image = [[self canvas] capture];
    NSData *imageData = nil;
    if ([mimeType isEqualToString:@"png"]) {
        imageData = UIImagePNGRepresentation(image);
    } else if ([mimeType isEqualToString:@"jpeg"]) {
        imageData = UIImageJPEGRepresentation(image, 1.0F);
    }

    resolve([imageData base64EncodedDataWithOptions:0]);
}

- (UIView *)view {
    self.canvas = [[CanvasView alloc] init];
    return self.canvas;
}

@end