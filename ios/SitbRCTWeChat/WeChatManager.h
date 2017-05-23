//
//  WeChatManager.h
//  WeChatManager
//
//  Created by 田尘殇 on 2017/5/17.
//  Copyright © 2017年 Sitb Software. All rights reserved.
//
#import <React/RCTBridgeModule.h>
#import "WXApi.h"


@interface WeChatManager : NSObject <RCTBridgeModule, WXApiDelegate>
@end
