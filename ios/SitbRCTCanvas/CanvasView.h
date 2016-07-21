//
// Created by 田尘殇 on 16/7/16.
// Copyright (c) 2016 Sitb Software. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CanvasView : UIView

@property(nonatomic, strong) NSMutableArray *lines;
@property(nonatomic, strong) UIColor *strokeColor;
@property(nonatomic) CGFloat lineWidth;

- (UIImage *)capture;
@end