//
//  SitbRCTCameraManager
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import <React/RCTViewManager.h>
#import <AVFoundation/AVFoundation.h>

@class CameraView;

@interface CameraManager : RCTViewManager <AVCaptureVideoDataOutputSampleBufferDelegate>

//捕获设备，通常是前置摄像头，后置摄像头，麦克风（音频输入）
@property(nonatomic, strong) AVCaptureDevice *device;

//AVCaptureDeviceInput 代表输入设备，他使用AVCaptureDevice 来初始化
@property(nonatomic, strong) AVCaptureDeviceInput *audioCaptureDeviceInput;
@property(nonatomic, strong) AVCaptureDeviceInput *videoCaptureDeviceInput;

// output
@property(nonatomic, strong) AVCaptureVideoDataOutput *videoDataOutput;

@property(nonatomic, strong) AVCapturePhotoSettings *photoSettings;

@property(nonatomic, strong) NSArray *barCodeTypes;

@property(nonatomic, strong) id runtimeErrorHandlingObserver;

@property(nonatomic, assign) BOOL mirrorImage;

//session：由他把输入输出结合在一起，并开始启动捕获设备（摄像头）
@property(nonatomic, strong) AVCaptureSession *session;

//图像预览层，实时显示捕获的图像
@property(nonatomic, strong) AVCaptureVideoPreviewLayer *previewLayer;

// View
@property(nonatomic, strong) CameraView *cameraView;

//
@property(nonatomic, strong) dispatch_queue_t sessionQueue;
@property(nonatomic, strong) dispatch_queue_t sampleBufferQueue;
@property(nonatomic, strong) dispatch_queue_t sendBufferQueue;

@property(nonatomic, assign) NSInteger presetCamera;

// 设备方向
@property UIDeviceOrientation deviceOrientation;

/********props********/
// 照片方向
@property(nonatomic, assign) AVCaptureVideoOrientation orientation;

// JavaScript props
@property(nonatomic, copy) RCTBubblingEventBlock onCaptureOutputBuffer;

- (void)initializeCaptureSessionInput:(NSString *)type;

- (void)stopCapture;

- (void)startSession;

- (void)stopSession;

- (AVCaptureDevice *)deviceWithMediaType:(NSString *)mediaType preferringPosition:(AVCaptureDevicePosition)position;


@end
