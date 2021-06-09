//
//  PromiseWrapper.swift
//  DoubleConversion
//
//  Created by Shmuel, Sagi on 23/12/2019.
//

import Foundation
import React

class PromiseWrapper {
    var promiseResolve: RCTPromiseResolveBlock?
    var promiseReject: RCTPromiseRejectBlock?

    @discardableResult
    func set(promiseResolve: @escaping RCTPromiseResolveBlock, promiseReject: @escaping RCTPromiseRejectBlock) -> Bool {
        self.promiseReject = promiseReject
        self.promiseResolve = promiseResolve

        return true
    }

    func resolve(result: Any) {
        guard let promiseResolve = promiseResolve else {
            return
        }

        let res = GigyaSdk.toJsonString(data: result as? [String : Any] ?? [:])
        promiseResolve(res)

        self.clear()
    }

    func reject(error: String?, errorCode: Int = -1, data: [String: Any] = [:]) {
        guard let promiseReject = promiseReject else {
            return
        }

        let e = NSError(domain: "gigyaError", code: errorCode, userInfo: nil)
        promiseReject(error, GigyaSdk.toJsonString(data: data), e)

        self.clear()
    }

    func clear() {
        self.promiseResolve = nil
        self.promiseReject = nil
    }
}
