//
//  GigyaExtension.swift
//  AwesomeProject
//
//  Created by Shmuel, Sagi on 26/12/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import gigya_react_native_plugin_for_sap_customer_data_cloud
import Gigya

@objc public class GigyaExtension: NSObject {
  @objc func setMySchema() {
    GigyaSdk.setSchema(HostModel.self)
  }
}

struct HostModel: GigyaAccountProtocol {
    var UID: String?

    var profile: GigyaProfile?

    var UIDSignature: String?

    var apiVersion: Int?

    var created: String?

    var createdTimestamp: Double?

    var isActive: Bool?

    var isRegistered: Bool?

    var isVerified: Bool?

    var lastLogin: String?

    var lastLoginTimestamp: Double?

    var lastUpdated: String?

    var lastUpdatedTimestamp: Double?

    var loginProvider: String?

    var oldestDataUpdated: String?

    var oldestDataUpdatedTimestamp: Double?

    var registered: String?

    var registeredTimestamp: Double?

    var signatureTimestamp: String?

    var socialProviders: String?

    var verified: String?

    var verifiedTimestamp: Double?


}
