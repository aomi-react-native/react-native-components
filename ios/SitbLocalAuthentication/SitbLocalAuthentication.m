//
//  SitbLocalAuthentication.m
//  SitbLocalAuthentication
//
//  Created by 田尘殇 on 2017/9/29.
//  Copyright © 2017年 Sitb Software. All rights reserved.
//

#import "SitbLocalAuthentication.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import <React/RCTLog.h>

@implementation SitbLocalAuthentication

RCT_EXPORT_MODULE(SitbLocalAuthentication)

RCT_EXPORT_METHOD(
            supportBiometrics:
            (RCTPromiseResolveBlock) resolve
            reject:
            (RCTPromiseRejectBlock) reject
) {
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    BOOL success;

    // test if we can evaluate the policy, this test will tell us if Touch ID is available and enrolled
    success = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
    if (success) {
        RCTLog(@"指纹解锁可用");
        resolve(@(true));
    } else {
        RCTLog(@"此设备指纹解锁不可用 %@", error);
        reject(@"EXCEPTION",@"此设备指纹解锁不可用",error);
    }

}

//指纹验证
RCT_EXPORT_METHOD(fingerprintValidate:(NSString *)tipMsg
                  resolve: (RCTPromiseResolveBlock) resolve
                  reject:
                  (RCTPromiseRejectBlock) reject){
    LAContext *context = [[LAContext alloc] init];
    
    // show the authentication UI with our reason string
    [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:tipMsg reply:
     ^(BOOL success, NSError *authenticationError) {
         if (success) {
             RCTLog(@"验证成功");
             resolve(@(true));
         } else {
             NSString *code = @"EXCEPTION";
             switch(authenticationError.code){
                 case LAErrorSystemCancel: {
                     RCTLog(@"切换到其他APP，系统取消验证Touch ID. Authentication was cancelled by the system");
                     code = @"SystemCancel";
                     break;
                 }
                 case LAErrorUserCancel:{
                     RCTLog(@"用户取消验证Touch ID. Authentication was cancelled by the user");
                     code = @"UserCancel";
                     break;
                 }
                 case LAErrorUserFallback: {
                     RCTLog(@"用户选择其他验证方式，切换主线程处理. User selected to enter custom password");
                     code = @"UserFallback";
                     break;
                 }
                 default:
                     RCTLog(@"位置错误 %ld", authenticationError.code);
                     break;
             }
             RCTLog(@"验证失败: %@ ",authenticationError.localizedDescription);
             reject(code, @"验证失败", authenticationError);
         }
     }];
}
@end
