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
            @"SourceType" : @{
                    @"photoLibrary" : @(UIImagePickerControllerSourceTypePhotoLibrary),
                    @"savedPhotosAlbum" : @(UIImagePickerControllerSourceTypeSavedPhotosAlbum),
                    @"camera" : @(UIImagePickerControllerSourceTypeCamera)
            },
            @"MediaType" : @{
                    @"image" : @(MediaTypeImage),
                    @"video" : @(MediaTypeVideo)
            },
            @"CameraType" : @{
                    @"front" : @(UIImagePickerControllerCameraDeviceFront),
                    @"back" : @(UIImagePickerControllerCameraDeviceRear)
            },
            @"Quality" : @{
                    @"high" : @(UIImagePickerControllerQualityTypeHigh),
                    @"medium" : @(UIImagePickerControllerQualityTypeMedium),
                    @"low" : @(UIImagePickerControllerQualityTypeLow),
                    @"VGA640x480" : @(UIImagePickerControllerQualityType640x480),
                    @"VGA1280x720" : @(UIImagePickerControllerQualityTypeIFrame1280x720),
                    @"VGA960x540" : @(UIImagePickerControllerQualityTypeIFrame960x540)

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


/**
 * 根据指定的参数启动相机
 * @param options 相机启动参数
 */
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
        case MediaTypeImage: {
            self.pickerController.mediaTypes = @[(NSString *) kUTTypeImage];
            break;
        }
        case MediaTypeVideo: {
            self.pickerController.mediaTypes = @[(NSString *) kUTTypeVideo];
            UIImagePickerControllerQualityType quality = (UIImagePickerControllerQualityType) ((NSNumber *) options[@"quality"]).intValue;
            self.pickerController.videoQuality = quality;
            break;
        }
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

            UIImagePickerControllerQualityType quality = (UIImagePickerControllerQualityType) ((NSNumber *) self.options[@"quality"]).intValue;

            CGFloat qualityFloat = 1.0F;

            switch (quality) {
                case UIImagePickerControllerQualityTypeMedium:
                    qualityFloat /= 2;
                    break;
                case UIImagePickerControllerQualityTypeLow:
                    qualityFloat /= 3;
                    break;
                default:
                    break;
            }

            NSData *imageData = UIImageJPEGRepresentation(image, qualityFloat);
            CGImageSourceRef source = CGImageSourceCreateWithData((__bridge CFDataRef) imageData, NULL);
            NSMutableDictionary *imageMetadata = [(NSDictionary *) CFBridgingRelease(CGImageSourceCopyPropertiesAtIndex(source, 0, NULL)) mutableCopy];
            CGImageRef CGImage = CGImageSourceCreateImageAtIndex(source, 0, NULL);
            CGImageRef rotatedCGImage;
            int metadataOrientation = [imageMetadata[(NSString *) kCGImagePropertyOrientation] intValue];
            if (metadataOrientation == 6) {
                rotatedCGImage = [self newCGImageRotatedByAngle:CGImage angle:270];
            } else if (metadataOrientation == 1) {
                rotatedCGImage = [self newCGImageRotatedByAngle:CGImage angle:0];
            } else if (metadataOrientation == 3) {
                rotatedCGImage = [self newCGImageRotatedByAngle:CGImage angle:180];
            } else {
                rotatedCGImage = [self newCGImageRotatedByAngle:CGImage angle:0];
            }
            CGImageRelease(CGImage);
            // Erase metadata orientation
            [imageMetadata removeObjectForKey:(NSString *) kCGImagePropertyOrientation];
            // Erase stupid TIFF stuff
            [imageMetadata removeObjectForKey:(NSString *) kCGImagePropertyTIFFDictionary];
            // Set GPS
            [imageMetadata setGpsMetadata:self.options[@"metadata"]];
            [imageMetadata addEntriesFromDictionary:self.options[@"metadata"]];

            // Create destination thing
            NSMutableData *rotatedImageData = [NSMutableData data];
            CGImageDestinationRef destination = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)rotatedImageData, CGImageSourceGetType(source), 1, NULL);
            CFRelease(source);
            // add the image to the destination, reattaching metadata
            CGImageDestinationAddImage(destination, rotatedCGImage, (__bridge CFDictionaryRef) imageMetadata);
            // And write
            CGImageDestinationFinalize(destination);
            CFRelease(destination);

            // It's unclear if writeImageToSavedPhotosAlbum is thread-safe
            dispatch_async(dispatch_get_main_queue(), ^{
                ALAssetsLibrary *assets = [[ALAssetsLibrary alloc] init];
                [assets writeImageToSavedPhotosAlbum:rotatedCGImage metadata:imageMetadata completionBlock:^(NSURL *assetURL, NSError *saveError) {
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
    [formatter setDateFormat:@"YYYYMMddHHmmssSSS"];
    NSString *date = [formatter stringFromDate:[NSDate date]];
    NSString *imageTempFile = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"temp_edited_%@.jpg", date]];
    [UIImageJPEGRepresentation(image, 1.0f) writeToFile:imageTempFile atomically:YES];
    return imageTempFile;
}

- (CGImageRef)newCGImageRotatedByAngle:(CGImageRef)imgRef angle:(CGFloat)angle {
    CGFloat angleInRadians = (CGFloat) (angle * (M_PI / 180));
    CGFloat width = CGImageGetWidth(imgRef);
    CGFloat height = CGImageGetHeight(imgRef);

    CGRect imgRect = CGRectMake(0, 0, width, height);
    CGAffineTransform transform = CGAffineTransformMakeRotation(angleInRadians);
    CGRect rotatedRect = CGRectApplyAffineTransform(imgRect, transform);

    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef bmContext = CGBitmapContextCreate(NULL, (size_t) rotatedRect.size.width, (size_t) rotatedRect.size.height, 8, 0, colorSpace, (CGBitmapInfo) kCGImageAlphaPremultipliedFirst);

    CGContextSetAllowsAntialiasing(bmContext, TRUE);
    CGContextSetInterpolationQuality(bmContext, kCGInterpolationNone);

    CGColorSpaceRelease(colorSpace);

    CGContextTranslateCTM(bmContext, +(rotatedRect.size.width / 2), +(rotatedRect.size.height / 2));
    CGContextRotateCTM(bmContext, angleInRadians);
    CGContextTranslateCTM(bmContext, -(rotatedRect.size.width / 2), -(rotatedRect.size.height / 2));

    CGContextDrawImage(bmContext, CGRectMake((rotatedRect.size.width - width) / 2.0f, (rotatedRect.size.height - height) / 2.0f, width, height), imgRef);

    CGImageRef rotatedImage = CGBitmapContextCreateImage(bmContext);
    CFRelease(bmContext);
    return rotatedImage;
}


@end