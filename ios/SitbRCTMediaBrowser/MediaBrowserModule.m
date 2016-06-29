//
//  MediaBrowserModule.m
//  SitbRCTMediaBrowser
//
//  Created by 田尘殇 on 16/6/29.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "MediaBrowserModule.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <MobileCoreServices/MobileCoreServices.h>

@implementation MediaBrowserModule

RCT_EXPORT_MODULE(SitbRCTMediaBrowserModule)

/** 常量 */
- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"sourceType" : @{
                    @"photoLibrary" : @(UIImagePickerControllerSourceTypePhotoLibrary),
                    @"savedPhotosAlbum" : @(UIImagePickerControllerSourceTypeSavedPhotosAlbum)
            },
            @"mediaType" : @{
            }
    };
}


/*********JavaScript Method************/
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
    pickerController.mediaTypes = @[(NSString *) kUTTypeImage];
    pickerController.allowsEditing = YES;
    pickerController.delegate = self;
    pickerController

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


//
//- (void)imagePickerController:(UIImagePickerController *)picker
//        didFinishPickingImage:(UIImage *)image
//                  editingInfo:(NSDictionary *)editingInfo {
//    RCTLog(@"选取照片成功[%@]", [editingInfo valueForKey:@"UIImagePickerControllerReferenceURL"]);
//
//    self.resolve(@{
//            @"path" : editingInfo[@"UIImagePickerControllerReferenceURL"]
//    });
//
//}


@end

