//
//  GigyaBiometric.m
//  gigya-react-native-plugin-for-sap-customer-data-cloud
//
//  Created by Sagi Shmuel on 23/05/2022.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GigyaBiometric, NSObject)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isSupported)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isLocked)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isOptIn)

RCT_EXTERN_METHOD(optIn:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(optOut:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(lockSession:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unlockSession:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)


@end
