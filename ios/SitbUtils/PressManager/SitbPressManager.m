//
// Created by 田尘殇 on 2017/6/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import "SitbPressManager.h"
#import <React/RCTUIManager.h>

@interface CustomUITapGestureRecognizer : UITapGestureRecognizer

@property NSInteger viewTag;

@end

@implementation CustomUITapGestureRecognizer
@end


@implementation SitbPressManager {

}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(SitbPressManager)

- (NSArray<NSString *> *)supportedEvents {
    return @[@"SitbPressManagerPressEvent"];
}

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
    [self sendEventWithName:@"SitbPressManagerPressEvent" body:[NSString stringWithFormat:@"%i", press.viewTag]];
}


@end
