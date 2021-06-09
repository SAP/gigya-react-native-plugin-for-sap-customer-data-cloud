//
//  GigyaSdkEvents.m
//  gigya-react-native-plugin
//
//  Created by Shmuel, Sagi on 19/04/2021.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GigyaSdkEvents, NSObject)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXTERN_METHOD(supportedEvents)

@end

