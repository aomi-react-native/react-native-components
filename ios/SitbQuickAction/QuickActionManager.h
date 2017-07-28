//
// Created by 田尘殇 on 2017/7/28.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface QuickActionManager : RCTEventEmitter <RCTBridgeModule>

+ (void)onQuickActionPress:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded))completionHandler;

@end