//
//  SitbRCTCameraManager
//  SitbRCTCamera
//
//  Created by 田尘殇 on 16/6/24.
//  Copyright © 2016年 Sitb. All rights reserved.
//

#import "CameraManager.h"

@implementation CameraManager

RCT_EXPORT_MODULE(SitbCameraManager);


/******************** Component PropTypes **********************/
RCT_EXPORT_VIEW_PROPERTY(type, NSInteger);

RCT_EXPORT_VIEW_PROPERTY(orientation, NSInteger);


/*********JavaScript View************/

- (UIView *)view {
    return [super view];
}





/*********JavaScript Method***********/




@end