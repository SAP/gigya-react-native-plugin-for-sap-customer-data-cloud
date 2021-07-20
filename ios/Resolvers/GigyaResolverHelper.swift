//
//  GigyaResolverHelper.swift
//  gigya-react-native-plugin
//
//  Created by Shmuel, Sagi on 12/05/2021.
//

import Gigya

extension GigyaSdkWrapper {
    func useResolver(method: String, params: [String: Any], promise: PromiseWrapper) {
        self.promise = promise

        guard let resolver = currentResolver else {
            return
        }

        switch resolver.interrupt {
        case .pendingRegistration:
            switch method {
            case "setAccount":
                guard let resolverInstance: GigyaResolver<PendingRegistrationResolver<T>> = resolver as? GigyaResolver<PendingRegistrationResolver<T>> else {
                    return
                }

                resolverInstance.resolver?.setAccount(params: params)
            default:
                break
            }
            break
        case .pendingVerification:
            break
        case .conflictingAccount:
            guard let resolverInstance: GigyaResolver<LinkAccountsResolver<T>> = resolver as? GigyaResolver<LinkAccountsResolver<T>> else {
                return
            }

            switch method {
            case "getConflictingAccount":

                promise.resolve(result: mapObject(resolverInstance.resolver?.conflictingAccount))
            case "linkToSite":
                resolverInstance.resolver?.linkToSite(loginId: params["loginId"] as! String, password: params["password"] as! String)
            case "linkToSocial":
                guard let viewController = getDisplayedViewController(),
                        let providerString = params["provider"] as? String,
                        let provider = GigyaSocialProviders(rawValue: providerString)
                        else {
                      // error
                      return
                  }

                resolverInstance.resolver?.linkToSocial(provider: provider, viewController: viewController)
            default:
                break
            }

            break
        case .unknown:
            break
        }
    }
}
