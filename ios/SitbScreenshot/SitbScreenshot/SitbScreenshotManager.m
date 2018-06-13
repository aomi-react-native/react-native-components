//
//  SitbScreenshotManager.m
//  SitbScreenshotManager
//
//  Created by 田尘殇 on 2018/6/10.
//  Copyright © 2018年 Sitb Software. All rights reserved.
//

#import "SitbScreenshotManager.h"
#import <React/RCTLog.h>

@implementation SitbScreenshotManager

RCT_EXPORT_MODULE(SitbScreenshotManager)

- (instancetype)init {
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(userDidTakeScreenshot:)
                                                     name:UIApplicationUserDidTakeScreenshotNotification object:nil];
    }

    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"UserDidTakeScreenshot"];
}

- (void)userDidTakeScreenshot:(NSNotification *)notification {
    RCTLog(@"检查到用户截取屏幕");
    [self sendEventWithName:@"UserDidTakeScreenshot"
                       body:@{@"name": @""}
    ];
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

@end
