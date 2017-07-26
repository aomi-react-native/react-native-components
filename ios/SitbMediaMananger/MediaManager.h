//
//  MediaManager.h
//  SitbRCTMediaBrowser
//
//  Created by 田尘殇 on 16/6/29.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, MediaType) {
    MediaTypeImage = 0,
    MediaTypeVideo = 1
};

@interface MediaManager : NSObject <RCTBridgeModule, UINavigationControllerDelegate, UIActionSheetDelegate, UIImagePickerControllerDelegate>

@property(nonatomic, copy) RCTPromiseResolveBlock resolve;
@property(nonatomic, copy) RCTPromiseRejectBlock reject;
@property UIImagePickerController *pickerController;
@property NSDictionary *options;

@end
