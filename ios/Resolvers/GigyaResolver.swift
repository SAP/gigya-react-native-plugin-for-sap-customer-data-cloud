//
//  GigyaResolver.swift
//  gigya-react-native-plugin
//
//  Created by Shmuel, Sagi on 10/05/2021.
//

import Gigya

protocol GigyaResolverModelProtocol {
    var interrupt: GigyaInterruptionsSupported { get }
}

class GigyaResolver<T>: GigyaResolverModelProtocol {
    var interrupt: GigyaInterruptionsSupported
    var resolver: T?
    var regToken: String?

    init(interrupt: GigyaInterruptionsSupported, resolver: T) {
        self.resolver = resolver
        self.interrupt = interrupt
    }
}
