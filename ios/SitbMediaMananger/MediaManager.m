//
//  MediaManager.m
//  SitbRCTMediaBrowser
//
//  Created by 田尘殇 on 16/6/29.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "MediaManager.h"
#import <MobileCoreServices/MobileCoreServices.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wextra-tokens"

#import "NSMutableDictionary+ImageMetadata.m";


#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@implementation MediaManager

RCT_EXPORT_MODULE(SitbRCTMediaManager)

/** 常量 */
- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"SourceType": @{
                    @"photoLibrary": @(UIImagePickerControllerSourceTypePhotoLibrary),
                    @"savedPhotosAlbum": @(UIImagePickerControllerSourceTypeSavedPhotosAlbum),
                    @"camera": @(UIImagePickerControllerSourceTypeCamera)
            },
            @"MediaType": @{
                    @"image": @(MediaTypeImage),
                    @"video": @(MediaTypeVideo)
            },
            @"CameraType": @{
                    @"front": @(UIImagePickerControllerCameraDeviceFront),
                    @"back": @(UIImagePickerControllerCameraDeviceRear)
            },
            @"Quality": @{
                    @"high": @(UIImagePickerControllerQualityTypeHigh),
                    @"medium": @(UIImagePickerControllerQualityTypeMedium),
                    @"low": @(UIImagePickerControllerQualityTypeLow),
                    @"VGA640x480": @(UIImagePickerControllerQualityType640x480),
                    @"VGA1280x720": @(UIImagePickerControllerQualityTypeIFrame1280x720),
                    @"VGA960x540": @(UIImagePickerControllerQualityTypeIFrame960x540)

            },
            @"PhotoAlbumAuthorizationStatus": @{
                    @"denied": @(PHAuthorizationStatusDenied),
                    @"restricted": @(PHAuthorizationStatusRestricted),
                    @"notDetermined": @(PHAuthorizationStatusNotDetermined),
                    @"authorized": @(PHAuthorizationStatusAuthorized)
            }
    };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
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
    self.resolve = resolve;
    self.reject = reject;
    self.options = options;
    [self launchWithOptions:options];
}

RCT_EXPORT_METHOD(getPhotoAlbumAuthorizationStatus:
    (RCTPromiseResolveBlock) resolve
            reject:
            (RCTPromiseRejectBlock) reject) {
    // 0.判断状态
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusDenied) {
        RCTLogInfo(@"用户拒绝当前应用访问相册,我们需要提醒用户打开访问开关");
        resolve(@(status));
    } else if (status == PHAuthorizationStatusRestricted) {
        RCTLogInfo(@"家长控制,不允许访问");
        resolve(@(status));
    } else if (status == PHAuthorizationStatusNotDetermined) {
        RCTLogInfo(@"用户还没有做出选择");
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus reqStatus) { //弹出访问权限提示框
            resolve(@(reqStatus));
        }];
    } else if (status == PHAuthorizationStatusAuthorized) {
        RCTLogInfo(@"用户允许当前应用访问相册");
        resolve(@(status));
    }
}


/**
 * 根据指定的参数启动相机
 * @param options 相机启动参数
 */
- (void)launchWithOptions:(NSDictionary *)options {
    self.pickerController = [[UIImagePickerController alloc] init];
    UIImagePickerControllerSourceType sourceType = (UIImagePickerControllerSourceType) [options[@"sourceType"] intValue];
    self.pickerController.sourceType = sourceType;
    if (sourceType == UIImagePickerControllerSourceTypeCamera) {
        UIImagePickerControllerCameraDevice cameraDevice = (UIImagePickerControllerCameraDevice) [options[@"cameraType"] intValue];
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
            UIImagePickerControllerQualityType quality = (UIImagePickerControllerQualityType) [options[@"quality"] intValue];
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

            MediaType mediaType = (MediaType) ((NSNumber *) self.options[@"mediaType"]).intValue;
            switch (mediaType) {
                case MediaTypeImage:
                    RCTLog(@"拍摄照片成功");
                    [self handleCaptureImageWithInfo:info];
                    break;
                case MediaTypeVideo:
                    break;
            }
        } else {
            RCTLog(@"相册获取成功");
            response[@"reference"] = @{
                    @"path": ((NSURL *) info[@"UIImagePickerControllerReferenceURL"]).absoluteString
            };

            NSString *editedImageTempFile = @"";
            if (self.pickerController.allowsEditing) {
                UIImage *editedImage = info[@"UIImagePickerControllerEditedImage"];
                editedImageTempFile = [self saveTempImage:editedImage];
            }
            response[@"edited"] = @{
                    @"path": editedImageTempFile
            };
            self.resolve(response);
        }
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [picker dismissViewControllerAnimated:YES completion:^() {
        self.reject(@"CANCEL", @"用户取消", nil);
    }];
}

#pragma mark - 保存图片信息, 处理图片的大小, 旋转和meta信息

- (void)handleCaptureImageWithInfo:(NSDictionary *)info {

    NSString *editPath = @"";
    if (self.pickerController.allowsEditing) {
        UIImage *edit = info[@"UIImagePickerControllerEditedImage"];
        editPath = [self saveTempImage:edit];
    }

    UIImage *image = info[@"UIImagePickerControllerOriginalImage"];

    NSDictionary *size = self.options[@"size"];
    if (size) {
        CGSize newSize;
        newSize.width = [size[@"width"] floatValue];
        newSize.height = [size[@"height"] floatValue];

        CGFloat scale = [self calcScaleRate:image.size targetSize:newSize];
        if (scale > 1) {
            newSize.width = image.size.width / scale;
            newSize.height = image.size.height / scale;
            image = [self zoomImage:image toSize:newSize];
        }
    }

    UIImagePickerControllerQualityType quality = (UIImagePickerControllerQualityType) [self.options[@"quality"] intValue];

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
    [imageMetadata addEntriesFromDictionary:info[@"UIImagePickerControllerMediaMetadata"]];
    // Erase metadata orientation
    [imageMetadata removeObjectForKey:(NSString *) kCGImagePropertyOrientation];
    // Erase stupid TIFF stuff
    [imageMetadata removeObjectForKey:(NSString *) kCGImagePropertyTIFFDictionary];
    // Set GPS
    [imageMetadata setGpsMetadata:self.options[@"metadata"]];
    [imageMetadata addEntriesFromDictionary:self.options[@"metadata"]];

    // Create destination thing
    NSMutableData *rotatedImageData = [NSMutableData data];
    CGImageDestinationRef destination = CGImageDestinationCreateWithData((__bridge CFMutableDataRef) rotatedImageData, CGImageSourceGetType(source), 1, NULL);
    CFRelease(source);
    // add the image to the destination, reattaching metadata
    CGImageDestinationAddImage(destination, rotatedCGImage, (__bridge CFDictionaryRef) imageMetadata);
    // And write
    CGImageDestinationFinalize(destination);
    CFRelease(destination);

    image = [UIImage imageWithCGImage:rotatedCGImage];

    __block NSString *assetId = nil;
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
        assetId = [PHAssetCreationRequest creationRequestForAssetFromImage:image].placeholderForCreatedAsset.localIdentifier;
    }                                 completionHandler:^(BOOL success, NSError *_Nullable error) {
        if (error) {
            self.reject(@"ERROR", @"保存图片失败", error);
        } else {
            self.resolve(@{
                    @"original": @{
                            @"path": assetId
                    },
                    @"edited": @{
                            @"path": editPath
                    }
            });
        }
    }];
}

/**
 * 缩放图片
 * @param image 需要缩放的图片
 * @param size 新的图片大小
 */
#pragma mark - 设置图片大小

- (UIImage *)zoomImage:(UIImage *)image toSize:(CGSize)size {
    UIGraphicsBeginImageContext(size);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}

- (CGFloat)calcScaleRate:(CGSize)orgSize targetSize:(CGSize)tarSize {

    CGFloat tempMin = MIN(tarSize.width, tarSize.height);
    CGFloat tempMax = MAX(tarSize.width, tarSize.height);

    CGSize trgSizeP = CGSizeMake(tempMin, tempMax);
    CGSize trgSizeL = CGSizeMake(tempMax, tempMin);

    CGSize targetSize = (orgSize.width < orgSize.height) ? trgSizeP : trgSizeL;

    CGFloat pRate = orgSize.height / targetSize.height;
    CGFloat lRate = orgSize.width / targetSize.width;

    RCTLog(@"P...%f...%f", MAX(pRate, lRate), MIN(pRate, lRate));
    return MIN(pRate, lRate);
}

/**
 * 保存一个文件到临时目录
 */
#pragma mark - 保存一个文件到临时目录

- (NSString *)saveTempImage:(UIImage *)image {
    NSString *documentsDirectory = NSTemporaryDirectory();
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"YYYYMMddHHmmssSSS"];
    NSString *date = [formatter stringFromDate:[NSDate date]];
    NSString *imageTempFile = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"temp_edited_%@.jpg", date]];
    [UIImageJPEGRepresentation(image, 1.0f) writeToFile:imageTempFile atomically:YES];
    return imageTempFile;
}

/**
 * 旋转图片
 */
#pragma mark - 旋转图片

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

#pragma clang diagnostic pop
