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

    @objc(passkeyRevoke:resolver:rejecter:)
    func passkeyRevoke(_ keyId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.webAuthnRevokeId, params: ["id": keyId], promise: promise)
    }

    @objc(passkeyGetCredentials:rejecter:)
    func passkeyGetCredentials(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.webAuthnGetCredentials, params: [:], promise: promise)
    }

}
