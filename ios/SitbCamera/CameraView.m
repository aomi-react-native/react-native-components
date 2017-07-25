//
//  CameraView.m
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//
#import "CameraView.h"
#import "CameraManager.h"


@interface CameraView ()

@property(nonatomic, weak) CameraManager *manager;
@property(nonatomic, weak) RCTBridge *bridge;

@end

@implementation CameraView {
    BOOL _multipleTouches;
    BOOL _onFocusChanged;
    BOOL _defaultOnFocusComponent;
    BOOL _onZoomChanged;
    BOOL _previousIdleTimerDisabled;
}


/**
 * 初始化View
 */
- (id)initWithManager:(CameraManager *)manager bridge:(RCTBridge *)bridge {
    if ((self = [super init])) {
        self.manager = manager;
        self.bridge = bridge;
        [self.manager initializeCaptureSessionInput:AVMediaTypeVideo];
        [self.manager startSession];

        _multipleTouches = NO;
        _onFocusChanged = NO;
        _defaultOnFocusComponent = YES;
        _onZoomChanged = NO;
        _previousIdleTimerDisabled = [UIApplication sharedApplication].idleTimerDisabled;
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.manager.previewLayer.frame = self.bounds;
    [self setBackgroundColor:[UIColor blackColor]];
    [self.layer insertSublayer:self.manager.previewLayer atIndex:0];
}

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex {
    [super insertReactSubview:view atIndex:atIndex];
    [self insertSubview:view atIndex:atIndex + 1];
}

- (void)removeReactSubview:(UIView *)subview {
    [super removeReactSubview:subview];
    [subview removeFromSuperview];
}

- (void)removeFromSuperview {
    [self.manager stopSession];
    [super removeFromSuperview];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceOrientationDidChangeNotification object:nil];
    [UIApplication sharedApplication].idleTimerDisabled = _previousIdleTimerDisabled;
}


- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    // Update the touch state.
    if ([[event touchesForView:self] count] > 1) {
        _multipleTouches = YES;
    }

}



//- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
//    if (!_onFocusChanged) return;
//
//    BOOL allTouchesEnded = ([touches count] == [[event touchesForView:self] count]);
//
//    // Do not conflict with zooming and etc.
//    if (allTouchesEnded && !_multipleTouches) {
//        UITouch *touch = [[event allTouches] anyObject];
//        CGPoint touchPoint = [touch locationInView:touch.view];
//        // Focus camera on this point
//        [self.manager focusAtThePoint:touchPoint];
//
//        if (self.camFocus) {
//            [self.camFocus removeFromSuperview];
//        }
//        NSDictionary *event = @{
//                @"target": self.reactTag,
//                @"touchPoint": @{
//                        @"x": [NSNumber numberWithDouble:touchPoint.x],
//                        @"y": [NSNumber numberWithDouble:touchPoint.y]
//                }
//        };
//        [self.bridge.eventDispatcher sendInputEventWithName:@"focusChanged" body:event];
//
//        // Show animated rectangle on the touched area
//        if (_defaultOnFocusComponent) {
//            self.camFocus = [[RCTCameraFocusSquare alloc] initWithFrame:CGRectMake(touchPoint.x - 40, touchPoint.y - 40, 80, 80)];
//            [self.camFocus setBackgroundColor:[UIColor clearColor]];
//            [self addSubview:self.camFocus];
//            [self.camFocus setNeedsDisplay];
//
//            [UIView beginAnimations:nil context:NULL];
//            [UIView setAnimationDuration:1.0];
//            [self.camFocus setAlpha:0.0];
//            [UIView commitAnimations];
//        }
//    }
//
//    if (allTouchesEnded) {
//        _multipleTouches = NO;
//    }
//
//}


//- (void)handlePinchToZoomRecognizer:(UIPinchGestureRecognizer *)pinchRecognizer {
//    if (!_onZoomChanged) return;
//
//    if (pinchRecognizer.state == UIGestureRecognizerStateChanged) {
//        [self.manager zoom:pinchRecognizer.velocity reactTag:self.reactTag];
//    }
//}

- (void)setOrientation:(NSInteger)orientation {
    [self.manager setOrientation:(AVCaptureVideoOrientation) orientation];
}

- (void)setOnCaptureOutputBuffer:(RCTBubblingEventBlock)onCaptureOutputBuffer {
    [self.manager setOnCaptureOutputBuffer:onCaptureOutputBuffer];
}

- (void)setOnBarCodeRead:(RCTBubblingEventBlock)onBarCodeRead {
    [self.manager setOnBarCodeRead:onBarCodeRead];
}

- (void)setBarCodeTypes:(NSArray *)barCodeTypes {
    [self.manager setBarCodeTypes:barCodeTypes];
}

@end