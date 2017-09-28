//
//  DeviceManager.m
//  SitbRCTUtils
//
//  Created by 田尘殇 on 2017/5/27.
//  Copyright © 2017年 Sitb Software. All rights reserved.
//

#import "SitbDeviceManager.h"
#import <UIKit/UIDevice.h>

@implementation SitbDeviceManager

RCT_EXPORT_MODULE(SitbDeviceManager)

RCT_EXPORT_METHOD(
            getDeviceInfo:
            (RCTPromiseResolveBlock) resolve
            reject:
            (RCTPromiseRejectBlock) reject) {


    UIDevice *device = [UIDevice currentDevice];

    resolve(@{
            @"systemName": [device systemName],
            @"systemVersion": [device systemVersion],
            @"model": [device model],
            @"name": [device name],
            @"localizedModel": [device localizedModel],
            @"identifier": [[device identifierForVendor] UUIDString],
            @"locale": [NSLocale preferredLanguages][0],
            @"country": [[NSLocale currentLocale] objectForKey:NSLocaleCountryCode],
            @"bundleId": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"],
            @"versionName":[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] ?: [NSNull null],
            @"versionCode": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"]
    });

}

@end
