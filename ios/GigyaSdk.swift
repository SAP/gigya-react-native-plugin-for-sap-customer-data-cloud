//
//  GigyaSdk.swift
//  DoubleConversion
//
//  Created by Shmuel, Sagi on 22/12/2019.
//

import Foundation
import Gigya
import React

@objc(GigyaSdk)
public class GigyaSdk: NSObject {
    static var gigya: GigyaSdkWrapperProtocol?

    var promise = PromiseWrapper()

    override init() {
        super.init()
    }

    public static func setSchema<T: GigyaAccountProtocol>(_ schema: T.Type) {
        let gigya = GigyaSdkWrapper(accountSchema: schema)

         GigyaSdk.gigya = gigya
    }

    @objc(initFor:apiDomain:)
    init(apiKey: String, apiDomain: String?) {
        GigyaSdk.gigya?.initFor(apiKey: apiKey, domain: apiDomain)
    }

    @objc(isLoggedIn)
    func isLoggedIn() -> Any {
        return GigyaSdk.gigya?.isLoggedIn() ?? false
    }

    @objc(getSession:rejecter:)
    func getSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.getSession, params: [:], promise: promise)
    }

    @objc(setSession:secret:expiration:resolver:rejecter:)
    func setSession(_ token: String, secret: String, expiration: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let newParams: [String : Any] = ["token": token, "secret": secret, "expiration": expiration];
        GigyaSdk.gigya?.sendEvent(.setSession, params: newParams, promise: promise)
    }

    @objc(send:params:resolver:rejecter:)
    func send(_ api: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params);
        let newParams: [String : Any] = ["api": api, "params": jsonToParams]
        GigyaSdk.gigya?.sendEvent(.send, params: newParams, promise: promise)
    }

    @objc(register:password:params:resolver:rejecter:)
    func register(_ email: String, password: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParams: [String : Any] = ["email": email, "password": password, "params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.register, params: newParams, promise: promise)
    }

    @objc(login:password:params:resolver:rejecter:)
    func login(_ loginId: String, password: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)
        let newParams: [String : Any] = ["loginId": loginId, "password": password, "params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.login, params: newParams, promise: promise)
    }

    @objc(getAccount:resolver:rejecter:)
    func getAccount(_ params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParams: [String : Any] = ["params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.getAccount, params: newParams, promise: promise)
    }

    @objc(setAccount:resolver:rejecter:)
    func setAccount(_ params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParams: [String : Any] = ["params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.setAccount, params: newParams, promise: promise)
    }

    @objc(socialLogin:params:resolver:rejecter:)
    func socialLogin(_ provider: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParmas: [String: Any] = ["provider": provider, "params": jsonToParams]
        GigyaSdk.gigya?.sendEvent(.socialLogin, params: newParmas, promise: promise)
    }
    
    @objc(sso:resolver:rejecter:)
    func socialLogin(_ params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParmas: [String: Any] = ["params": jsonToParams]
        GigyaSdk.gigya?.sendEvent(.sso, params: newParmas, promise: promise)
    }

    @objc(addConnection:resolver:rejecter:)
    func addConnection(_ params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParams: [String : Any] = ["params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.addConnection, params: newParams, promise: promise)
    }

    @objc(removeConnection:resolver:rejecter:)
    func removeConnection(_ params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)

        let newParams: [String : Any] = ["params": jsonToParams];
        GigyaSdk.gigya?.sendEvent(.removeConnection, params: newParams, promise: promise)
    }

    @objc(showScreenSet:params:)
    func showScreenSet(name: String, params: String) {
        let jsonToParams = GigyaSdk.toJson(data: params)

        GigyaSdk.gigya?.showScreenSet(name: name, params: jsonToParams)
    }

    @objc(logout:rejecter:)
    func logout(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        GigyaSdk.gigya?.sendEvent(.logout, params: [:], promise: promise)
    }

    @objc(resolve:params:resolver:rejecter:)
    func resolve(method: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        promise.set(promiseResolve: resolve, promiseReject: reject)

        let jsonToParams = GigyaSdk.toJson(data: params)
        GigyaSdk.gigya?.useResolver(method: method, params: jsonToParams, promise: promise)
    }

    static func toJson(data: String) -> [String: Any] {
        do {
            let dictionary = try JSONSerialization.jsonObject(with: data.data(using: .utf8)!, options: [.mutableContainers])
                as? [String: Any]
            return dictionary ?? [:]
        } catch let error {
            GigyaLogger.log(with: self, message: error.localizedDescription)
        }

        return [:]
    }

    static func toJsonString(data: [String: Any]) -> String {
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
            let decoded = String(data: jsonData, encoding: .utf8)
            return decoded ?? ""
        } catch _ {
            return "{}"
        }
    }

}
