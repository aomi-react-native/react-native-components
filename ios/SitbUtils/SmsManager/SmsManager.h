//
// Created by 田尘殇 on 2017/7/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <MessageUI/MFMessageComposeViewController.h>

@interface SmsManager : NSObject <RCTBridgeModule, MFMessageComposeViewControllerDelegate>
@end