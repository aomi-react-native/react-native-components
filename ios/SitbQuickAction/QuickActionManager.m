//
// Created by 田尘殇 on 2017/7/28.
// Copyright (c) 2017 Sitb Software. All rights reserved.
//

#import "QuickActionManager.h"
#import <React/RCTLog.h>

NSString *const ShortcutItemClicked = @"ShortcutItemClicked";

NSString *const EventName = @"quickActionShortcut";

NSDictionary *QuickAction(UIApplicationShortcutItem *item) {
    if (!item) return nil;
    return @{
            @"type": item.type,
            @"title": item.localizedTitle,
            @"userInfo": item.userInfo ?: @{}
    };
}


@implementation QuickActionManager

@synthesize bridge = _bridge;

- (instancetype)init {
    if ((self = [super init])) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleQuickActionPress:)
                                                     name:ShortcutItemClicked
                                                   object:nil];
    }
    return self;
}

RCT_EXPORT_MODULE(SitbQuickActionManager)

- (NSArray<NSString *> *)supportedEvents {
    return @[EventName];
}

- (NSDictionary<NSString *, id> *)constantsToExport {
    return @{
            @"eventName": EventName
    };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}


// Map user passed array of UIApplicationShortcutItem
- (NSArray *)dynamicShortcutItemsForPassedArray:(NSArray *)passedArray {
    // FIXME: Dynamically map icons from UIApplicationShortcutIconType to / from their string counterparts
    // so we don't have to update this list every time Apple adds new system icons.
    NSDictionary *icons = @{
            @"Compose": @(UIApplicationShortcutIconTypeCompose),
            @"Play": @(UIApplicationShortcutIconTypePlay),
            @"Pause": @(UIApplicationShortcutIconTypePause),
            @"Add": @(UIApplicationShortcutIconTypeAdd),
            @"Location": @(UIApplicationShortcutIconTypeLocation),
            @"Search": @(UIApplicationShortcutIconTypeSearch),
            @"Share": @(UIApplicationShortcutIconTypeShare),
            @"Prohibit": @(UIApplicationShortcutIconTypeProhibit),
            @"Contact": @(UIApplicationShortcutIconTypeContact),
            @"Home": @(UIApplicationShortcutIconTypeHome),
            @"MarkLocation": @(UIApplicationShortcutIconTypeMarkLocation),
            @"Favorite": @(UIApplicationShortcutIconTypeFavorite),
            @"Love": @(UIApplicationShortcutIconTypeLove),
            @"Cloud": @(UIApplicationShortcutIconTypeCloud),
            @"Invitation": @(UIApplicationShortcutIconTypeInvitation),
            @"Confirmation": @(UIApplicationShortcutIconTypeConfirmation),
            @"Mail": @(UIApplicationShortcutIconTypeMail),
            @"Message": @(UIApplicationShortcutIconTypeMessage),
            @"Date": @(UIApplicationShortcutIconTypeDate),
            @"Time": @(UIApplicationShortcutIconTypeTime),
            @"CapturePhoto": @(UIApplicationShortcutIconTypeCapturePhoto),
            @"CaptureVideo": @(UIApplicationShortcutIconTypeCaptureVideo),
            @"Task": @(UIApplicationShortcutIconTypeTask),
            @"TaskCompleted": @(UIApplicationShortcutIconTypeTaskCompleted),
            @"Alarm": @(UIApplicationShortcutIconTypeAlarm),
            @"Bookmark": @(UIApplicationShortcutIconTypeBookmark),
            @"Shuffle": @(UIApplicationShortcutIconTypeShuffle),
            @"Audio": @(UIApplicationShortcutIconTypeAudio),
            @"Update": @(UIApplicationShortcutIconTypeUpdate)
    };

    NSMutableArray *shortcutItems = [NSMutableArray new];

    [passedArray enumerateObjectsUsingBlock:^(NSDictionary *item, NSUInteger idx, BOOL *stop) {
        NSString *iconName = item[@"icon"];

        // If passed iconName is enum, use system icon
        // Otherwise, load from bundle
        UIApplicationShortcutIcon *shortcutIcon;
        NSNumber *iconType = icons[iconName];

        if (iconType) {
            shortcutIcon = [UIApplicationShortcutIcon iconWithType:(UIApplicationShortcutIconType) [iconType intValue]];
        } else if (iconName) {
            shortcutIcon = [UIApplicationShortcutIcon iconWithTemplateImageName:iconName];
        }

        [shortcutItems addObject:[[UIApplicationShortcutItem alloc] initWithType:item[@"type"]
                                                                  localizedTitle:item[@"title"] ?: item[@"type"]
                                                               localizedSubtitle:item[@"subtitle"]
                                                                            icon:shortcutIcon
                                                                        userInfo:item[@"userInfo"]]];
    }];

    return shortcutItems;
}

RCT_EXPORT_METHOD(setShortcutItems:
    (NSArray *) shortcutItems) {
    NSArray *dynamicShortcuts = [self dynamicShortcutItemsForPassedArray:shortcutItems];
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].shortcutItems = dynamicShortcuts;
    });
}

RCT_EXPORT_METHOD(isSupported:
    (RCTResponseSenderBlock) callback) {
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL supported = [[UIApplication sharedApplication].delegate.window.rootViewController.traitCollection forceTouchCapability] == UIForceTouchCapabilityAvailable;
        callback(@[@(supported)]);
    });
}

RCT_EXPORT_METHOD(clearShortcutItems) {
    [UIApplication sharedApplication].shortcutItems = nil;
}

+ (void)onQuickActionPress:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded))completionHandler {
    RCTLogInfo(@"Quick action shortcut item pressed: %@", [shortcutItem type]);
    [[NSNotificationCenter defaultCenter] postNotificationName:ShortcutItemClicked
                                                        object:self
                                                      userInfo:QuickAction(shortcutItem)
    ];
    completionHandler(YES);

}

- (void)handleQuickActionPress:(NSNotification *)notification {
    [self sendEventWithName:EventName body:notification.userInfo];
}

@end
