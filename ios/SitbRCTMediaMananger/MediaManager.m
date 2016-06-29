//
//  MediaManager.m
//  SitbRCTMediaBrowser
//
//  Created by 田尘殇 on 16/6/29.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "MediaManager.h"
#import <MobileCoreServices/MobileCoreServices.h>


@implementation MediaManager

RCT_EXPORT_MODULE(SitbRCTMediaManager)

/** 常量 */
- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"sourceType" : @{
                    @"photoLibrary" : @(UIImagePickerControllerSourceTypePhotoLibrary),
                    @"savedPhotosAlbum" : @(UIImagePickerControllerSourceTypeSavedPhotosAlbum)
            },
            @"mediaType" : @{
                    @"Image" : @(MediaTypeImage),
                    @"Video" : @(MediaTypeVideo)
            }
    };
}


/*********JavaScript Method************/
/**
 * 启动手机图库浏览器
 */
RCT_EXPORT_METHOD(
        launchImageLibrary:
        (NSDictionary *) options
        resolver:
        (RCTPromiseResolveBlock) resolve
        reject:
        (RCTPromiseRejectBlock) reject
) {
    self.resolve = resolve;
    self.reject = reject;
    UIImagePickerController *pickerController = [[UIImagePickerController alloc] init];

    pickerController.sourceType = (UIImagePickerControllerSourceType) ((NSNumber *) [options valueForKey:@"sourceType"]).intValue;

    MediaType mediaType = (MediaType) ((NSNumber *) options[@"mediaType"]).intValue;
    switch (mediaType) {
        case MediaTypeImage:
            pickerController.mediaTypes = @[(NSString *) kUTTypeImage];
            break;
        case MediaTypeVideo:
            pickerController.mediaTypes = @[(NSString *) kUTTypeVideo];
            break;
    }

    pickerController.allowsEditing = [options[@"allowsEditing"] boolValue];
    pickerController.delegate = self;

    pickerController.modalPresentationStyle = UIModalPresentationCurrentContext;
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        while (root.presentedViewController != nil) {
            root = root.presentedViewController;
        }
        [root presentViewController:pickerController animated:YES completion:nil];
    });
}


#pragma mark - UIImagePickerControllerDelegate

- (void)imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary *)info {
    [picker dismissViewControllerAnimated:YES completion:^() {

        RCTLog(@"%@", info);
        RCTLog(@"选取照片成功[%@]", [info valueForKey:@"UIImagePickerControllerReferenceURL"]);

        NSURL *url = [info valueForKey:@"UIImagePickerControllerReferenceURL"];

        self.resolve(
                @{
                        @"path" : url.absoluteString,
                }
        );
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    self.reject(@"CANCEL", @"用户取消", nil);
}


@end

