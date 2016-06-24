//
//  CameraModule.h
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "RCTLog.h"

typedef NS_ENUM(NSInteger, CameraType) {
    CameraTypeFront = AVCaptureDevicePositionFront,
    CameraTypeBack = AVCaptureDevicePositionBack
};

typedef NS_ENUM(NSInteger, Orientation) {
    OrientationAuto = 0,
    OrientationLandscapeLeft = AVCaptureVideoOrientationLandscapeLeft,
    OrientationLandscapeRight = AVCaptureVideoOrientationLandscapeRight,
    OrientationPortrait = AVCaptureVideoOrientationPortrait,
    OrientationPortraitUpsideDown = AVCaptureVideoOrientationPortraitUpsideDown
};

@interface CameraModule : NSObject <RCTBridgeModule>
@end
