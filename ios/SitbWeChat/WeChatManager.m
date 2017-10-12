//
//  WeChatManager.m
//  WeChatManager
//
//  Created by 田尘殇 on 2017/5/17.
//  Copyright © 2017年 Sitb Software. All rights reserved.
//

#import "WeChatManager.h"
#import <React/RCTLog.h>
#import <React/RCTImageLoader.h>

typedef NS_ENUM(NSInteger, ShareType) {
    TEXT = 0,
    IMAGE = 1,
    MUSIC = 2,
    VIDEO = 3,
    WEBPAGE = 4
};

@implementation WeChatManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(WeChatManager);

- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"type": @{
                    @"text": @(TEXT),
                    @"image": @(IMAGE),
                    @"music": @(MUSIC),
                    @"video": @(VIDEO),
                    @"webPage": @(WEBPAGE)
            },
            @"scene": @{
                    @"session": @(WXSceneSession),
                    @"timeLine": @(WXSceneTimeline),
                    @"favorite": @(WXSceneFavorite)
            }
    };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(
            registerApp:
            (NSString *) appId) {
    BOOL result = [WXApi registerApp:appId];
    RCTLog(@"向微信注册APP %@, result -> %d", appId, result);
}


/**
 * 分享给指定的回话
 * @param resolve 异步执行成功
 * @return
 */
RCT_EXPORT_METHOD(
            share:
            (NSDictionary *) data
            resolve:
            (RCTPromiseResolveBlock) resolve
            reject:
            (RCTPromiseRejectBlock) reject) {
    [self shareToWeChatWithData:data scene:((NSNumber *) data[@"scene"]).intValue resolve:resolve reject:reject];
}

- (void)shareToWeChatWithData:(NSDictionary *)data
                        scene:(int)scene
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {

    NSString *image = data[@"image"];
    if (image.length && _bridge.imageLoader) {
        CGSize size;
        CGFloat thumbImageSize = 80;
        if (data[@"thumbImageSize"]) {
            thumbImageSize = [data[@"thumbImageSize"] floatValue];
        }
        size = CGSizeMake(thumbImageSize, thumbImageSize);

        [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:image]
                                                size:size
                                               scale:1
                                             clipped:FALSE
                                          resizeMode:(RCTResizeMode) UIViewContentModeScaleToFill
                                       progressBlock:nil
                                    partialLoadBlock:nil
                                     completionBlock:^(NSError *error, UIImage *img) {
                                         [self shareToWeChatWithData:data scene:scene image:img resolve:resolve reject:reject];
                                     }
        ];
    } else {
        [self shareToWeChatWithData:data scene:scene image:nil resolve:resolve reject:reject];
    }


}

- (void)shareToWeChatWithData:(NSDictionary *)data
                        scene:(int)scene
                        image:(UIImage *)image
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
    SendMessageToWXReq *req = [SendMessageToWXReq new];
    req.scene = scene;


    ShareType type = (ShareType) ((NSNumber *) data[@"type"]).intValue;

    if (type == TEXT) {
        NSString *text = data[@"text"];
        req.bText = YES;
        req.text = text;
    } else {
        req.bText = NO;

        WXMediaMessage *message = [WXMediaMessage message];
        message.title = data[@"title"];
        message.description = data[@"description"];
        message.mediaTagName = data[@"mediaTagName"];
        message.messageAction = data[@"messageAction"];
        message.messageExt = data[@"messageExt"];
        if (image) {
            [message setThumbImage:image];
        }

        switch (type) {
            case TEXT:
                break;
            case IMAGE: {
                WXImageObject *imageObject = [WXImageObject object];
                imageObject.imageData = UIImagePNGRepresentation(image);
                message.mediaObject = imageObject;
                break;
            }
            case MUSIC: {
                break;
            }
            case VIDEO:
                break;
            case WEBPAGE: {
                WXWebpageObject *webpageObject = [WXWebpageObject object];
                webpageObject.webpageUrl = data[@"webPageUrl"];
                message.mediaObject = webpageObject;
                break;
            }
        }
        req.message = message;
    }
    BOOL success = [WXApi sendReq:req];

    if (success) {
        RCTLog(@"微信分享成功");
        resolve(@"");
    } else {
        RCTLog(@"微信分享失败");
        reject(@"3000", @"微信分享失败", nil);
    }
}


- (void)onReq:(BaseReq *)req {
    if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
        // 微信请求App提供内容， 需要app提供内容后使用sendRsp返回
        NSString *strTitle = [NSString stringWithFormat:@"微信请求App提供内容"];
        NSString *strMsg = @"微信请求App提供内容，App要调用sendResp:GetMessageFromWXResp返回给微信";
        RCTLog(@"%@,%@", strTitle, strMsg);
    } else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
        ShowMessageFromWXReq *temp = (ShowMessageFromWXReq *) req;
        WXMediaMessage *msg = temp.message;

        //显示微信传过来的内容
        WXAppExtendObject *obj = msg.mediaObject;

        NSString *strTitle = [NSString stringWithFormat:@"微信请求App显示内容"];
        NSString *strMsg = [NSString stringWithFormat:@"标题：%@ \n内容：%@ \n附带信息：%@ \n缩略图:%u bytes\n\n", msg.title, msg.description, obj.extInfo, msg.thumbData.length];
        RCTLog(@"%@,%@", strTitle, strMsg);
    } else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
        //从微信启动App
        NSString *strTitle = [NSString stringWithFormat:@"从微信启动"];
        NSString *strMsg = @"这是从微信启动的消息";

        RCTLog(@"%@,%@", strTitle, strMsg);
    }
}

- (void)onResp:(BaseResp *)resp {
    if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
        NSString *strTitle = [NSString stringWithFormat:@"发送媒体消息结果"];
        NSString *strMsg = [NSString stringWithFormat:@"errcode:%d", resp.errCode];
        RCTLog(@"%@,%@", strTitle, strMsg);
    }
}

@end
