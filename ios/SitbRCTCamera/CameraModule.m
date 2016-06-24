//
//  CameraModule.m
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "CameraModule.h"

@implementation CameraModule

RCT_EXPORT_MODULE(SitbCameraModule);

- (NSDictionary<NSString *, id> *)constantsToExport {

    return @{
            @"CameraType" : @{
                    @"back" : @(CameraTypeBack),
                    @"front" : @(CameraTypeFront)
            },
            @"Orientation" : @{
                    @"auto" : @(OrientationAuto),
                    @"landscapeLeft" : @(OrientationLandscapeLeft),
                    @"landscapeRight" : @(OrientationLandscapeRight),
                    @"portrait" : @(OrientationPortrait),
                    @"portraitUpsideDown" : @(OrientationPortraitUpsideDown)
            }
    };
}

/**
 * @param options 拍照参数
 * @param resolve JS 异步成功回调函数
 * @param reject JS 异步失败回调函数
 */
RCT_EXPORT_METHOD(
        capture:
        (NSDictionary *) options
        resolve:
        (RCTPromiseResolveBlock) resolve
        reject:
        (RCTPromiseRejectBlock) reject
) {
    RCTLogInfo(@"捕获屏幕");
}


@end
