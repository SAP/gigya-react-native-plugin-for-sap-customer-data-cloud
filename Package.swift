// swift-tools-version: 5.9
import PackageDescription
import Foundation

let packageRoot = URL(fileURLWithPath: #filePath).deletingLastPathComponent().path
let xcfwBase = packageRoot + "/../../ios/Pods/React-Core-prebuilt/React.xcframework"
// Both slices — Xcode picks the one matching the build SDK
let reactSimSlice = xcfwBase + "/ios-arm64_x86_64-simulator"
let reactDevSlice = xcfwBase + "/ios-arm64"
let reactHeadersDir = packageRoot + "/../../ios/Pods/React-Core-prebuilt/Headers"

let package = Package(
    name: "gigya-react-native-plugin-for-sap-customer-data-cloud",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "gigya-react-native-plugin-for-sap-customer-data-cloud",
            targets: ["GigyaReactNativePlugin", "GigyaReactNativePluginBridge"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/SAP/gigya-swift-sdk.git",
            from: "1.8.0"
        ),
    ],
    targets: [
        .target(
            name: "GigyaReactNativePlugin",
            dependencies: [
                .product(name: "Gigya", package: "gigya-swift-sdk"),
            ],
            path: "ios",
            exclude: [
                "GigyaSdk.xcodeproj",
                "GigyaSdk.xcworkspace",
                "GigyaSdk-Bridging-Header.h",
                "RCTBridge",
                "React",
                ".DS_Store",
            ],
            publicHeadersPath: ".",
            swiftSettings: [
                .unsafeFlags([
                    "-F", reactSimSlice,
                    "-F", reactDevSlice,
                    "-I", reactHeadersDir,
                ]),
            ]
        ),
        .target(
            name: "GigyaReactNativePluginBridge",
            path: "ios/RCTBridge",
            publicHeadersPath: ".",
            cSettings: [
                .unsafeFlags([
                    "-F", reactSimSlice,
                    "-F", reactDevSlice,
                    "-I", reactHeadersDir,
                ]),
            ]
        ),
    ]
)
