//
//  CameraView.h
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@class CameraManager;


@interface CameraView : UIView

// 前置相机还是后置相机
@property NSInteger *cameraFacing;

// 照片方向
@property(nonatomic) NSInteger orientation;

// 捕获图像事件
@property(nonatomic, copy) RCTBubblingEventBlock onCaptureOutputBuffer;

// 捕获二维码事件
@property(nonatomic, copy) RCTBubblingEventBlock onBarCodeRead;

@property(nonatomic, strong) NSArray *barCodeTypes;

- (id)initWithManager:(CameraManager *)manager bridge:(RCTBridge *)bridge;


@end
