#import <Foundation/Foundation.h>
#import <ImageIO/ImageIO.h>

@interface NSMutableDictionary(ImageMetadata)
- (void)setGpsMetadata:(NSDictionary *)inputMetadata;
@end

@implementation NSMutableDictionary(ImageMetadata)

- (void)setGpsMetadata:(NSDictionary *)inputMetadata {
    NSDictionary *inputMetadataLocation = inputMetadata[@"location"];
    if (inputMetadataLocation) {
        // Add GPS stuff
        self[(NSString *) kCGImagePropertyGPSDictionary] = [self getGPSDictionaryForLocation:inputMetadataLocation];
    }
}

- (NSMutableDictionary *)getGPSDictionaryForLocation:(NSDictionary *)location {
    NSMutableDictionary *gps = [NSMutableDictionary dictionary];
    NSDictionary *coords = location[@"coords"];
    // GPS tag version
    gps[(NSString *) kCGImagePropertyGPSVersion] = @"2.2.0.0";
    
    // Timestamp
    double timestamp = floor([location[@"timestamp"] doubleValue]);
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timestamp];
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"HH:mm:ss.SSSSSS"];
    [formatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    gps[(NSString *) kCGImagePropertyGPSTimeStamp] = [formatter stringFromDate:date];
    [formatter setDateFormat:@"yyyy:MM:dd"];
    gps[(NSString *) kCGImagePropertyGPSDateStamp] = [formatter stringFromDate:date];
    
    // Latitude
    double latitude = [coords[@"latitude"] doubleValue];
    if (latitude < 0) {
        latitude = -latitude;
        gps[(NSString *) kCGImagePropertyGPSLatitudeRef] = @"S";
    } else {
        gps[(NSString *) kCGImagePropertyGPSLatitudeRef] = @"N";
    }
    gps[(NSString *) kCGImagePropertyGPSLatitude] = [NSNumber numberWithFloat:latitude];
    
    // Longitude
    double longitude = [coords[@"longitude"] doubleValue];
    if (longitude < 0) {
        longitude = -longitude;
        gps[(NSString *) kCGImagePropertyGPSLongitudeRef] = @"W";
    } else {
        gps[(NSString *) kCGImagePropertyGPSLongitudeRef] = @"E";
    }
    gps[(NSString *) kCGImagePropertyGPSLongitude] = [NSNumber numberWithFloat:longitude];
    
    // Altitude
    double altitude = [coords[@"altitude"] doubleValue];
    if (!isnan(altitude)){
        if (altitude < 0) {
            altitude = -altitude;
            gps[(NSString *) kCGImagePropertyGPSAltitudeRef] = @"1";
        } else {
            gps[(NSString *) kCGImagePropertyGPSAltitudeRef] = @"0";
        }
        gps[(NSString *) kCGImagePropertyGPSAltitude] = [NSNumber numberWithFloat:altitude];
    }
    
    // Speed, must be converted from m/s to km/h
    double speed = [coords[@"speed"] doubleValue];
    if (speed >= 0){
        gps[(NSString *) kCGImagePropertyGPSSpeedRef] = @"K";
        gps[(NSString *) kCGImagePropertyGPSSpeed] = [NSNumber numberWithFloat:speed * 3.6];
    }
    
    // Heading
    double heading = [coords[@"heading"] doubleValue];
    if (heading >= 0){
        gps[(NSString *) kCGImagePropertyGPSTrackRef] = @"T";
        gps[(NSString *) kCGImagePropertyGPSTrack] = [NSNumber numberWithFloat:heading];
    }
    
    return gps;
}
@end

