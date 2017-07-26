//
// Created by 田尘殇 on 2017/7/26.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import <React/RCTLog.h>
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
    self.resolve = resolve;
    self.reject = reject;
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
        });
    } else {
        reject(@"EXCEPTION", @"不能发送短信", nil);
    }

}

- (void)messageComposeViewController:(MFMessageComposeViewController *)controller
                 didFinishWithResult:(MessageComposeResult)result {
    dispatch_async(dispatch_get_main_queue(), ^{
        [controller dismissViewControllerAnimated:YES completion:nil];
        switch (result) {
            case MessageComposeResultSent:
                RCTLog(@"信息传送成功");
                self.resolve(@(true));
                break;
            case MessageComposeResultFailed:
                RCTLog(@"信息传送失败");
                self.reject(@"FAILURE", @"信息传送失败", nil);
                break;
            case MessageComposeResultCancelled:
                RCTLog(@"信息被用户取消传送");
                self.reject(@"CANCEL", @"信息被用户取消传送", nil);
                break;
        }
    });
}


@end