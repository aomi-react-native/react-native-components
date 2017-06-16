//
// Created by 田尘殇 on 16/8/5.
// Copyright (c) 2016 Sitb Software. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>


@interface OrientationManager : RCTEventEmitter <RCTBridgeModule>

+ (void)setOrientation:(UIInterfaceOrientationMask)orientation;

+ (UIInterfaceOrientationMask)getOrientation;

@end
