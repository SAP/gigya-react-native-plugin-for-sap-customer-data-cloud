//
//  GigyaSdkWrapper.swift
//  DoubleConversion
//
//  Created by Shmuel, Sagi on 25/12/2019.
//

import Foundation
import React
import Gigya

enum GigyaMethods: String {
    case isLoggedIn
    case send
    case login
    case register
    case logout
    case getAccount
    case setAccount
    case socialLogin
    case addConnection
    case removeConnection
    case showScreenSet
}

enum GigyaInterruptionsSupported: String {
    case pendingRegistration
    case pendingVerification
    case conflictingAccount
    case unknown
}

protocol GigyaSdkWrapperProtocol {
    var currentResolver: GigyaResolverModelProtocol? { get }

    func isLoggedIn() -> Bool

    func initFor(apiKey: String, domain: String?)

    func sendEvent(_ name: GigyaMethods, params: [String: Any], promise: PromiseWrapper)

    func showScreenSet(name: String, params: [String: Any])

    func useResolver(method: String, params: [String: Any])
}

class GigyaSdkWrapper<T: GigyaAccountProtocol>: GigyaSdkWrapperProtocol {
    let gigya: GigyaCore<T>

    var promise: PromiseWrapper?

    var currentResolver: GigyaResolverModelProtocol?

    init(accountSchema: T.Type) {
        GigyaDefinitions.versionPrefix = "react_native_0.0.3_"
        gigya = Gigya.sharedInstance(accountSchema)
    }

    func sendEvent(_ name: GigyaMethods, params: [String: Any], promise: PromiseWrapper) {
        self.promise = promise

        switch name {
        case .send:
            self.send(api: params["api"] as! String, params: params["params"] as! [String : Any])
        case .register:
            guard let email = params["email"] as? String, let password = params["password"] as? String else {
                return
            }

            self.register(email: email, password: password, params: params["params"] as? [String : Any] ?? [:])
        case .login:
            guard let email = params["loginId"] as? String, let password = params["password"] as? String else {
                return
            }

            self.login(loginId: email, password: password, params: params["params"] as? [String : Any] ?? [:])
        case .logout:
            self.logout()
        case .getAccount:
            self.getAccount(params: params["params"] as? [String : Any] ?? [:])
        case .setAccount:
            self.setAccount(params: params["params"] as? [String : Any] ?? [:])
        case .socialLogin:
            self.socialLogin(provider: params["provider"] as? String ?? "", params: params["params"] as? [String : Any] ?? [:])
        case .addConnection:
            self.addConnection(provider: params["provider"] as? String ?? "", params: params["params"] as? [String : Any] ?? [:])
        case .removeConnection:
            self.removeConnection(provider: params["provider"] as? String ?? "")
        default:
            break
        }
    }

    func initFor(apiKey: String, domain: String?) {
        gigya.initFor(apiKey: apiKey, apiDomain: domain)
    }

    func isLoggedIn() -> Bool {
        return gigya.isLoggedIn()
    }

    func send(api: String, params: [String: Any]) {
        gigya.send(api: api, params: params) { (result) in
            switch result {
               case .success(let data):
                    let mapped: [String: Any] = data.mapValues { value in return value.value }

                    self.promise?.resolve(result: mapped)
               case .failure(let error):
                    self.promise?.reject(error: error.localizedDescription)
               }
        }
    }

    func register(email: String, password: String, params: [String: Any] ) {
        gigya.register(email: email, password: password, params: params) { [weak self] (result) in
            guard let self = self else { return }

            switch result {
            case .success(let data):
                let mapped: [String: Any] = self.accountToDic(account: data)
                self.promise?.resolve(result: mapped)
            case .failure(let error):
                if let interruption = error.interruption {
                    self.intteruptionHandle(interruption: interruption)
                }

                switch error.error {
                case .gigyaError(let data):
                    self.promise?.reject(error: data.errorMessage, errorCode: data.errorCode, data: data.toDictionary())
                default:
                    self.promise?.reject(error: error.error.localizedDescription)
                }
            }
        }
    }

    func login(loginId: String, password: String, params: [String: Any]) {
        gigya.login(loginId: loginId, password: password) { [weak self] (result) in
            guard let self = self else { return }

            switch result {
            case .success(let data):
                let mapped: [String: Any] = self.accountToDic(account: data)
                self.promise?.resolve(result: mapped)
            case .failure(let error):
                if let interruption = error.interruption {
                    self.intteruptionHandle(interruption: interruption)
                }

                switch error.error {
                case .gigyaError(let data):
                    self.promise?.reject(error: data.errorMessage, errorCode: data.errorCode, data: data.toDictionary())
                default:
                    self.promise?.reject(error: error.error.localizedDescription)
                }
            }
        }
    }

    func logout() {
        gigya.logout { (result) in
            switch result {
            case .success:
                self.promise?.resolve(result: [])
            case .failure(let error):
                self.promise?.reject(error: error.localizedDescription)
            }
        }
    }

    func getAccount(params: [String : Any]) {
        gigya.getAccount(false, params: params) { (result) in
            switch result {
            case .success(let data):
                let mapped: [String: Any] = self.accountToDic(account: data)
                self.promise?.resolve(result: mapped)
            case .failure(let error):
                self.promise?.reject(error: error.localizedDescription)
            }
        }
    }

    func setAccount(params: [String : Any]) {
        gigya.setAccount(with: params) { (result) in
            switch result {
            case .success(let data):
                let mapped: [String: Any] = self.accountToDic(account: data)
                self.promise?.resolve(result: mapped)
            case .failure(let error):
                self.promise?.reject(error: error.localizedDescription)
            }
        }
    }

    func socialLogin(provider: String, params: [String : Any]) {
        guard let providerx = GigyaSocialProviders(rawValue: provider),
              let viewController = RCTPresentedViewController() else {
            GigyaLogger.log(with: self, message: "Social provider not found.")
            return
        }

        gigya.login(with: providerx, viewController: viewController, params: params) { (result) in
            switch result {
            case .success(let data):
                let mapped: [String: Any] = self.accountToDic(account: data)
                self.promise?.resolve(result: mapped)
            case .failure(let error):
                if let interruption = error.interruption {
                    self.intteruptionHandle(interruption: interruption)
                }

                switch error.error {
                case .gigyaError(let data):
                    self.promise?.reject(error: data.errorMessage, errorCode: data.errorCode, data: data.toDictionary())
                default:
                    self.promise?.reject(error: error.error.localizedDescription)
                }            }
        }
    }

    func showScreenSet(name: String, params: [String: Any]) {
        guard let viewController = RCTPresentedViewController() else {
            GigyaLogger.log(with: self, message: "Presented viewController not found.")
            return
        }

        gigya.showScreenSet(with: name, viewController: viewController, params: params) { (result) in
            switch result {
            case .onBeforeValidation(event: let event):
                let data: [String: Any] = ["event": "onBeforeValidation", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onAfterValidation(event: let event):
                let data: [String: Any] = ["event": "onAfterValidation", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onBeforeSubmit(event: let event):
                let data: [String: Any] = ["event": "onBeforeSubmit", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onSubmit(event: let event):
                let data: [String: Any] = ["event": "onSubmit", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onAfterSubmit(event: let event):
                let data: [String: Any] = ["event": "onAfterSubmit", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onBeforeScreenLoad(event: let event):
                let data: [String: Any] = ["event": "onBeforeScreenLoad", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onAfterScreenLoad(event: let event):
                let data: [String: Any] = ["event": "onAfterScreenLoad", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onFieldChanged(event: let event):
                let data: [String: Any] = ["event": "onFieldChanged", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onHide(event: let event):
                let data: [String: Any] = ["event": "onHide", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onLogin(account: let account):
                let mapped: [String: Any] = self.accountToDic(account: account)
                let data: [String: Any] = ["event": "onLogin", "data": GigyaSdk.toJsonString(data: mapped)]

                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onLogout:
                let data: [String: Any] = ["event": "onLogout"]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onConnectionAdded:
                let data: [String: Any] = ["event": "onConnectionAdded"]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onConnectionRemoved:
                let data: [String: Any] = ["event": "onConnectionRemoved"]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .onCanceled:
                let data: [String: Any] = ["event": "onCanceled"]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            case .error(event: let event):
                let data: [String: Any] = ["event": "event", "data": event]
                GigyaSdkEvents.emitter.sendEvent(withName: "event", body: GigyaSdk.toJsonString(data: data))
            }

        }
    }

    func addConnection(provider: String, params: [String: Any]) {
        guard let providerx = GigyaSocialProviders(rawValue: provider),
              let viewController = RCTPresentedViewController() else {
            GigyaLogger.log(with: self, message: "Social provider not found.")
            return
        }
        gigya.addConnection(provider: providerx, viewController: viewController) { (result) in
            switch result {
            case .success:
                self.promise?.resolve(result: [])
            case .failure(let error):
                self.promise?.reject(error: error.localizedDescription)
            }
        }
    }

    func removeConnection(provider: String) {
        guard let providerx = GigyaSocialProviders(rawValue: provider)
            else {
            GigyaLogger.log(with: self, message: "Social provider not found.")
            return
        }

        gigya.removeConnection(provider: providerx) { (result) in
            switch result {
            case .success:
                self.promise?.resolve(result: [])
            case .failure(let error):
                self.promise?.reject(error: error.localizedDescription)
            }
        }
    }

    func accountToDic<T: GigyaAccountProtocol>(account: T) -> [String: Any]{
        do {
            let jsonEncoder = JSONEncoder()
            let jsonData = try jsonEncoder.encode(account)
            let dictionary = try JSONSerialization.jsonObject(with: jsonData, options: [])
                as? [String: Any]
            return dictionary ?? [:]
        } catch {
            print(error)
        }
        return [:]
    }

    /**
     Mapping typed account object.
     */
    func mapObject<T: Codable>(_ obj: T) -> [String: Any] {
        do {
            let jsonEncoder = JSONEncoder()
            let jsonData = try jsonEncoder.encode(obj)
            let dictionary = try JSONSerialization.jsonObject(with: jsonData, options: [])
                as? [String: Any]
            return dictionary ?? [:]
        } catch {
            print(error)
        }
        return [:]
    }

    func getDisplayedViewController() -> UIViewController? {
        if var topController = UIApplication.shared.keyWindow?.rootViewController {
            while let presentedViewController = topController.presentedViewController {
                topController = presentedViewController
            }
            return topController
        }
        return nil
    }

    func intteruptionHandle(interruption: GigyaInterruptions<T>) {
        switch interruption {
        case .pendingRegistration(resolver: let resolver):
            self.currentResolver = GigyaResolver(interrupt: .pendingRegistration, resolver: resolver)
        case .conflitingAccount(resolver: let resolver):
            self.currentResolver = GigyaResolver(interrupt: .conflictingAccount, resolver: resolver)
        default:
            break
        }
    }
}
