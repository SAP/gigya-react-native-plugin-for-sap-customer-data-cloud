//
//  GigyaBiometric.m
//  gigya-react-native-plugin-for-sap-customer-data-cloud
//
//  Created by Sagi Shmuel on 23/05/2022.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GigyaWebAuthn, NSObject)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXTERN_METHOD(login:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(register:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(revoke:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)


@end
