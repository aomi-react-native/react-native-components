//
//  MediaManager.m
//  SitbRCTMediaBrowser
//
//  Created by 田尘殇 on 16/6/29.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "MediaManager.h"
#import <MobileCoreServices/MobileCoreServices.h>
#import "NSMutableDictionary+ImageMetadata.m";


#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@implementation MediaManager

RCT_EXPORT_MODULE(SitbRCTMediaManager)

/** 常量 */
- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"sourceType" : @{
                    @"photoLibrary" : @(UIImagePickerControllerSourceTypePhotoLibrary),
                    @"savedPhotosAlbum" : @(UIImagePickerControllerSourceTypeSavedPhotosAlbum),
                    @"camera" : @(UIImagePickerControllerSourceTypeCamera)
            },
            @"mediaType" : @{
                    @"Image" : @(MediaTypeImage),
                    @"Video" : @(MediaTypeVideo)
            },
            @"cameraType" : @{
                    @"front" : @(UIImagePickerControllerCameraDeviceFront),
                    @"back" : @(UIImagePickerControllerCameraDeviceRear)
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
    self.hasReturn = false;
    self.resolve = resolve;
    self.reject = reject;
    [self launchWithOptions:options];
}

/**
 * 启动系统相机
 */
RCT_EXPORT_METHOD(
        launchCamera:
        (NSDictionary *) options
        resolver:
        (RCTPromiseResolveBlock) resolve
        reject:
        (RCTPromiseRejectBlock) reject
) {
    self.hasReturn = false;
    self.resolve = resolve;
    self.reject = reject;
    self.options = options;
    [self launchWithOptions:options];
}


- (void)launchWithOptions:(NSDictionary *)options {
    self.pickerController = [[UIImagePickerController alloc] init];
    UIImagePickerControllerSourceType sourceType = (UIImagePickerControllerSourceType) ((NSNumber *) [options valueForKey:@"sourceType"]).intValue;
    self.pickerController.sourceType = sourceType;
    if (sourceType == UIImagePickerControllerSourceTypeCamera) {
        UIImagePickerControllerCameraDevice cameraDevice = (UIImagePickerControllerCameraDevice) ((NSNumber *) options[@"cameraType"]).intValue;
        self.pickerController.cameraDevice = cameraDevice;
    }


    MediaType mediaType = (MediaType) ((NSNumber *) options[@"mediaType"]).intValue;
    switch (mediaType) {
        case MediaTypeImage:
            self.pickerController.mediaTypes = @[(NSString *) kUTTypeImage];
            break;
        case MediaTypeVideo:
            self.pickerController.mediaTypes = @[(NSString *) kUTTypeVideo];
            break;
    }

    self.pickerController.allowsEditing = [options[@"allowsEditing"] boolValue];
    self.pickerController.delegate = self;

    self.pickerController.modalPresentationStyle = UIModalPresentationCurrentContext;
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        while (root.presentedViewController != nil) {
            root = root.presentedViewController;
        }
        [root presentViewController:self.pickerController animated:YES completion:nil];
    });
}

#pragma mark - UIImagePickerControllerDelegate

- (void)imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary *)info {
    [picker dismissViewControllerAnimated:YES completion:^() {

        NSMutableDictionary *response = [[NSMutableDictionary alloc] init];

        if (self.pickerController.sourceType == UIImagePickerControllerSourceTypeCamera) {
            RCTLog(@"拍摄成功");

            NSString *editPath = @"";
            if (self.pickerController.allowsEditing) {
                UIImage *edit = info[@"UIImagePickerControllerEditedImage"];
                editPath = [self saveTempImage:edit];
            }

            UIImage *image = info[@"UIImagePickerControllerOriginalImage"];

            NSDictionary *cameraMetadata = info[@"UIImagePickerControllerMediaMetadata"];
            NSDictionary *requestMetadata = self.options[@"metadata"];

            NSMutableDictionary *metadata = [[cameraMetadata copy] mutableCopy];
            [metadata addEntriesFromDictionary:requestMetadata];
            [metadata setGpsMetadata:requestMetadata];

            // It's unclear if writeImageToSavedPhotosAlbum is thread-safe
            dispatch_async(dispatch_get_main_queue(), ^{
                ALAssetsLibrary *assets = [[ALAssetsLibrary alloc] init];
                [assets writeImageToSavedPhotosAlbum:image.CGImage metadata:metadata completionBlock:^(NSURL *assetURL, NSError *saveError) {
                    if (saveError) {
                        self.reject(@"ERROR", @"保存图片失败", saveError);
                    } else {
                        self.resolve(@{
                                @"original" : @{
                                        @"path" : assetURL.absoluteString
                                },
                                @"edited" : @{
                                        @"path" : editPath
                                }
                        });
                    }
                }];
            });

        } else {
            RCTLog(@"相册获取成功");
            response[@"reference"] = @{
                    @"path" : ((NSURL *) info[@"UIImagePickerControllerReferenceURL"]).absoluteString
            };

            NSString *editedImageTempFile = @"";
            if (self.pickerController.allowsEditing) {
                UIImage *editedImage = info[@"UIImagePickerControllerEditedImage"];
                editedImageTempFile = [self saveTempImage:editedImage];
            }
            response[@"edited"] = @{
                    @"path" : editedImageTempFile
            };
            self.resolve(response);
        }
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [picker dismissViewControllerAnimated:YES completion:^() {
        if (!self.hasReturn) {
            self.reject(@"CANCEL", @"用户取消", nil);
            self.hasReturn = true;
        }
    }];
}

- (NSString *)saveTempImage:(UIImage *)image {
    NSString *documentsDirectory = NSTemporaryDirectory();
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"YYYYMMddhhmmssSSS"];
    NSString *date = [formatter stringFromDate:[NSDate date]];
    NSString *imageTempFile = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"temp_edited_%@.jpg", date]];
    [UIImageJPEGRepresentation(image, 1.0f) writeToFile:imageTempFile atomically:YES];
    return imageTempFile;
}

@end


#pragma clang diagnostic pop