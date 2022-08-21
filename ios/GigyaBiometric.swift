//
//  GigyaBiometric.swift
//  gigya-react-native-plugin-for-sap-customer-data-cloud
//
//  Created by Sagi Shmuel on 23/05/2022.
//

import Foundation
import Gigya
import React
import LocalAuthentication

@objc(GigyaBiometric)
public class GigyaBiometric: NSObject {
    static var gigya: GigyaSdkWrapperProtocol?

    var promise = PromiseWrapper()

    override init() {
        super.init()
    }

    // GigyaSdk.gigya

    @objc(isSupported)
    func isSupported() -> Any {
        let localAuthenticationContext = LAContext()
        if localAuthenticationContext.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil) {
            return true
        }
        
        return false
    }
    
    @objc(isLocked)
    func isLocked() -> Any {
        return GigyaSdk.gigya?.isLocked() ?? false
    }
    
    @objc(isOptIn)
    func isOptIn() -> Any {
        return GigyaSdk.gigya?.isOptIn() ?? false
    }
    
    @objc(optIn:rejecter:)
    func optIn(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.optIn, params: [:], promise: promise)
    }
    
    @objc(optOut:rejecter:)
    func optOut(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.optOut, params: [:], promise: promise)
    }
    
    @objc(lockSession:rejecter:)
    func lockSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.lockSession, params: [:], promise: promise)
    }
    
    @objc(unlockSession:rejecter:)
    func unlockSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.unlockSession, params: [:], promise: promise)
    }

}
