//
//  GigyaSdkEvents.swift
//  react-native-gigya-sdk
//
//  Created by Shmuel, Sagi on 19/04/2021.
//

import Foundation
import React

@objc(GigyaSdkEvents)
class GigyaSdkEvents: RCTEventEmitter {
    public static var emitter: RCTEventEmitter!

    override init() {
        super.init()
        GigyaSdkEvents.emitter = self
    }

    open override func supportedEvents() -> [String] {
        return ["event"]
     }

}
