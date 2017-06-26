//
// Created by 田尘殇 on 2017/6/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import "SitbPressManager.h"
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>

@interface CustomUITapGestureRecognizer : UITapGestureRecognizer

@property RCTResponseSenderBlock onPress;

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
    (NSInteger *) btnTag
            onPress:
            (RCTResponseSenderBlock) onPress) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *button = [self.bridge.uiManager viewForReactTag:@((NSInteger) btnTag)];
        CustomUITapGestureRecognizer *tap = [[CustomUITapGestureRecognizer alloc] initWithTarget:self action:@selector(handlePress:)];
        tap.onPress = onPress;
        [button addGestureRecognizer:tap];
    });
}

- (void)handlePress:(CustomUITapGestureRecognizer *)press {
    press.onPress((id) @{});
}


@end
