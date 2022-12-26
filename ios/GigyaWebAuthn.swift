//
//  GigyaWebAuthn.swift
//  gigya-react-native-plugin-for-sap-customer-data-cloud
//
//  Created by Sagi Shmuel on 03/10/2022.
//

import Foundation
import Gigya
import React
import LocalAuthentication

@objc(GigyaWebAuthn)
public class GigyaWebAuthn: NSObject {
    static var gigya: GigyaSdkWrapperProtocol?

    var promise = PromiseWrapper()

    override init() {
        super.init()
    }
    
    @objc(login:rejecter:)
    func login(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.webAuthnLogin, params: [:], promise: promise)
    }
    
    @objc(register:rejecter:)
    func register(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.webAuthnRegister, params: [:], promise: promise)
    }
    
    @objc(revoke:rejecter:)
    func revoke(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.webAuthnRevoke, params: [:], promise: promise)
    }

}
