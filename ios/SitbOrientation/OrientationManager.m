//
// Created by 田尘殇 on 16/8/5.
// Copyright (c) 2016 Sitb Software. All rights reserved.
//

#import "OrientationManager.h"

@implementation OrientationManager

static UIInterfaceOrientationMask _orientation = UIInterfaceOrientationMaskAll;


RCT_EXPORT_MODULE(SitbRCTOrientationManager)

- (NSArray<NSString *> *)supportedEvents {
    return @[@"deviceOrientationDidChange"];
}

- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"Orientation" : @{
                    @"unknown" : @(UIDeviceOrientationUnknown),
                    @"portrait" : @(UIDeviceOrientationPortrait),
                    @"portraitUpsideDown" : @(UIDeviceOrientationPortraitUpsideDown),
                    @"landscapeLeft" : @(UIDeviceOrientationLandscapeLeft),
                    @"landscapeRight" : @(UIDeviceOrientationLandscapeRight),
                    @"faceUp" : @(UIDeviceOrientationFaceUp),
                    @"faceDown" : @(UIDeviceOrientationFaceDown)
            }
    };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}


- (instancetype)init {
    if ((self = [super init])) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange:) name:@"UIDeviceOrientationDidChangeNotification" object:nil];
    }
    return self;

}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)deviceOrientationDidChange:(id)deviceOrientationDidChange {
//    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
//    [self sendEventWithName:@"deviceOrientationDidChange" body:@(orientation)];
}

# pragma mark 获取当前设备方向

RCT_EXPORT_METHOD(
        getOrientation:
        (RCTPromiseResolveBlock) resolve
        reject:
        (RCTPromiseRejectBlock) reject) {

    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    resolve(@(orientation));
}

# pragma mark 设置设备方向

RCT_EXPORT_METHOD(setOrientation:
(NSInteger) orientation
        andLock:
        (BOOL) lock) {
    if (lock) {
        [OrientationManager setOrientation:[self getMaskFromDeviceOrientation:(UIDeviceOrientation) orientation]];
    }else{
        [OrientationManager setOrientation:UIInterfaceOrientationMaskAll];
    }
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
        [[UIDevice currentDevice] setValue:@(orientation) forKey:@"orientation"];
    }];

}

# pragma mark 恢复设备方向为默认值

RCT_EXPORT_METHOD(setOrientationToDefault) {
    [OrientationManager setOrientation:UIInterfaceOrientationMaskAll];
    [self setOrientation:UIDeviceOrientationPortrait andLock:false];
}

- (UIInterfaceOrientationMask)getMaskFromDeviceOrientation:(UIDeviceOrientation)deviceOrientation {
    switch (deviceOrientation) {
        case UIDeviceOrientationUnknown:
            return UIInterfaceOrientationMaskAll;
        case UIDeviceOrientationPortrait:
            return UIInterfaceOrientationMaskPortrait;
        case UIDeviceOrientationPortraitUpsideDown:
            return UIInterfaceOrientationMaskPortraitUpsideDown;
        case UIDeviceOrientationLandscapeLeft:
            return UIInterfaceOrientationMaskLandscapeLeft;
        case UIDeviceOrientationLandscapeRight:
            return UIInterfaceOrientationMaskLandscapeRight;
        case UIDeviceOrientationFaceUp:
            return _orientation;
        case UIDeviceOrientationFaceDown:
            return _orientation;
    }
}

+ (void)setOrientation:(UIInterfaceOrientationMask)orientation {
    _orientation = orientation;
}

+ (UIInterfaceOrientationMask)getOrientation {
    return _orientation;
}


@end