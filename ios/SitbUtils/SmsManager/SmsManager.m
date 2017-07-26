//
// Created by 田尘殇 on 2017/7/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import "SmsManager.h"


@implementation SmsManager {

}

RCT_EXPORT_MODULE(SitbSmsManager);

RCT_EXPORT_METHOD(sendSms:
    (NSArray *) recipients
            body:
            (NSString *) body
            resolve:
            (RCTPromiseResolveBlock) resolve
            reject:
            (RCTPromiseRejectBlock) reject) {
    if ([MFMessageComposeViewController canSendText]) {
        MFMessageComposeViewController *picker = [[MFMessageComposeViewController alloc] init];
        picker.messageComposeDelegate = self;
        picker.body = body;
        picker.recipients = recipients;

        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
            while (root.presentedViewController != nil) {
                root = root.presentedViewController;
            }
            [root presentViewController:picker animated:YES completion:nil];
            resolve(@(true));
        });
    } else {
        reject(@"EXCEPTION", @"不能发送短信", nil);
    }

}

- (void)messageComposeViewController:(MFMessageComposeViewController *)controller
                 didFinishWithResult:(MessageComposeResult)result {

}


@end