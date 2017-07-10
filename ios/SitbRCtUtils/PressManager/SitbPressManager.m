//
// Created by 田尘殇 on 2017/6/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import "SitbPressManager.h"
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTEventEmitter.h>

@interface SitbPressManagerEventModule : RCTEventEmitter <RCTBridgeModule>
@end

@implementation SitbPressManagerEventModule

RCT_EXPORT_MODULE(SitbPressManagerEventModule)

- (NSArray<NSString *> *)supportedEvents {
    return @[@"SitbPressManagerPressEvent"];
}

@end


@interface CustomUITapGestureRecognizer : UITapGestureRecognizer

@property NSInteger viewTag;

@end

@implementation CustomUITapGestureRecognizer
@end


@implementation SitbPressManager {

}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(SitbPressManager)

/**
 * 给按钮新增点击事件
 * @return
 */
RCT_EXPORT_METHOD(onPress:
    (NSInteger) btnTag) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *button = [self.bridge.uiManager viewForReactTag:@(btnTag)];
        CustomUITapGestureRecognizer *tap = [[CustomUITapGestureRecognizer alloc] initWithTarget:self action:@selector(handlePress:)];
        tap.viewTag = btnTag;
        [button addGestureRecognizer:tap];
    });
}

- (void)handlePress:(CustomUITapGestureRecognizer *)press {
    SitbPressManagerEventModule *eventModule = [self.bridge moduleForClass:[SitbPressManagerEventModule class]];
    [eventModule sendEventWithName:@"SitbPressManagerPressEvent" body:[NSString stringWithFormat:@"%i", press.viewTag]];
}


@end
