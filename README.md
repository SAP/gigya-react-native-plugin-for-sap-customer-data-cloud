# React Native plug-in for SAP Customer Data Cloud
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud)](https://api.reuse.software/info/github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud)

## Description
A React Native plugin for interfacing with SAP Customer Data Cloud. This plugin provides quick access to core elements & business API flows available within SAP Customer Data Cloud; designed for React Native mobile applications.

## Developers Preview Status
This plugin is currently in an early developers preview stage.

## Requirements
Android SDK support requires Android SDK 14 and above.
iOS support requires iOS 10 and above.

## Download and Installation
Add the plugin in your **package.json** file.

## Setup & Gigya core integration

### Android setup

Add the following to your *MainApplication.java* file:

```java
@Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    // Set and initialize the account schema for the Gigya core SDK.
    GigyaSdkModule.setSchema(this, GigyaAccount.class);
  }
```

### iOS setup

Navigate to **AppDelegate.m** and add the following under the:
 **(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions** method.

```objc
GigyaExtension * gigya = [[GigyaExtension alloc] init];
[gigya setMySchema];
```

To apply your custom schema, you will need to create a 'swift bridge' file and register it as follows:

```swift 
@objc public class GigyaExtension: NSObject {
    @objc func setMySchema() {
        GigyaSdk.setSchema(HostModel.self)
    }
}
```
And then call the function from your **AppDelegate.m** file.

## SDK initialization

In your application code, you can initialize the Gigya SDK using the following call:

```javascript
Gigya.initFor("Your API KEY", "API DOMAIN");
```

If you do not specify the "API DOMAIN" (as implemented in the sample application) the SDK will use the default **us1.gigya.com** domain.

## Run the example application

To run the example application included in the repository:
1. Checkout the repository code.
2. Navigate to the example folder and run the *yarn install* command.
3. Navigate to the example/ios folder and run the *pod install* command.

** Android - If changing the API key, make sure to update the signingConfigs section as the example app includes a specific keystore path 
used for testing purposes *** 

```
signingConfigs {

        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
```

## Sending a simple request

Sending a request is available using the plugin's **send** method.
```javascript
try {
      const send = await Gigya.send("socialize.getSDKConfig");
      console.log("send: " + JSON.stringify(senddd));
    } catch (error) {
      console.log("errorSend:" + error);
    }
```

## Business APIs

The plugin provides an interface to these core SDK business APIs:
**login, register, getAccount, setAccount, isLoggedIn ,logOut, addConnection, removeConnection**
Implement them using the same request structure as shown above. 
The example application includes various different implementations.

## Social login

Use the "socialLogin" interface to perform social login using supported providers.
The React Native plugin supports the same *providers supported by the Core Gigya SDK. 

Supported social login providers:
google, facebook, line, wechat, apple, amazon, linkedin, yahoo.

For example:

```javascript
const send = await Gigya.socialLogin("facebook");
```

## Embedded social providers

Specific social providers (Facebook, Google) require additional setup. This is due to their requirement for specific (embedded native) SDKs.

To register social providers you will need to create a 'swift bridge' file (same as with using a custom schema).
Don't forget to add the relevant wrappers to the ios folder.

### Facebook

Follow the core SDK documentation and instructions for setting up Facebook login.
[Android documentation](https://sap.github.io/gigya-android-sdk/sdk-core/#facebook)
[iOS documentation](https://sap.github.io/gigya-android-sdk/sdk-core/#facebook)

### Google

Follow the core SDK documentation and instructions for setting up Google login.
[Android documentation](https://sap.github.io/gigya-android-sdk/sdk-core/#google)
[iOS documentation](https://sap.github.io/gigya-swift-sdk/GigyaSwift/#google)

### LINE

To provide support for LINE as a provider, please follow it's core SDK documentation.
[Android documentation](https://sap.github.io/gigya-android-sdk/sdk-core/#line)
[iOS documentation](https://sap.github.io/gigya-swift-sdk/GigyaSwift/#line)

### WeChat

To provider support for WeChat as a provider, please follow the core SDK documentation.
[Android documentation](https://sap.github.io/gigya-android-sdk/sdk-core/#wechat)
[iOS documentation](https://sap.github.io/gigya-swift-sdk/GigyaSwift/#wechat)

## Using screen-sets

The plugin supports the use of Web screen-sets using the following:
```javascript
Gigya.showScreenSet("Default-RegistrationLogin", (event, data) => {
      console.log(`event: ${event}`);
      if (event == "onLogin") {
        updateIsLoggedIn(Gigya.isLoggedIn())
      }
    })
```
Optional {params} map is available.

As in the core SDKs, the plugin provides a streaming channel that will stream the
Screen-Sets events (event, map).

event - actual event name.
data - event data map.

## Mobile SSO

The plugin supports the native SDK's "Single Sign On feature".
[Andorid](https://sap.github.io/gigya-android-sdk/sdk-core/#sso-single-sign-on)
[iOS](https://sap.github.io/gigya-swift-sdk/GigyaSwift/#sso-single-sign-on)

Please make sure to implement the nessesary steps described for each platform.

To initiate the flow run the following snippet.
```javascript
 const send = await Gigya.sso();
 });
```

## Resolving interruptions

Much like our core SDKs, resolving interruptions is available using the plugin.

Current supporting interruptions:
* pendingRegistration
* conflictingAccounts

Example for resolving **conflictingAccounts** interruptions:
```javascript
try {
      const send = await Gigya.register(login, password, { 'sessionExpiration': 0 });
      console.log("send: " + JSON.stringify(senddd));
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {
      console.log("register error:" + error);

      const e = error as GigyaError;
      switch (e.getInterruption()) {
        case GigyaInterruption.conflictingAccounts: {
          const resolver = Gigya.resolverFactory.getResolver(e) as LinkAccountResolver;

          console.log("link:")
          console.log(resolver.regToken)

          break
        }
      }
    }
```
Once you reference your resolver, create your relevant UI to refelct if a site or social linking is
required (see example app for details) and use the relevant method.

Example of resolving link to the site when trying to link a new social account to a site account.
```javascript
const loginToSite = await resolver.linkToSite(userData.login, userData.password)
```

## Biometrics support

The plugin offers biometric support for Android/iOS for these flows.

```
An end user logs in.
An end user opts in to biometric authentication.
This will require the end user to verify his fingerprint.
The app is locked or being cleared from memory.
The end user is required to unlock the app in order to restore his session.
This will require the end user to verify his fingerprint.
The end user opts out of biometric authentication
```
The biometric fingerprint feature is a security encryption on top of an existing session of your app, therefore, calling any biometric
operations requires a valid session.

Please make sure you are following native implementations:

# iOS
1. The device has a Passcode.
2. The device has a TouchID/FaceID available.

**FaceID**
In order to use FaceID in a compatible device, you must include following key to your Info.plist file.

**NSFaceIDUsageDescription = (String) “Your custom message”**
Additionally, when you want to set a custom text in Touch ID prompt , you can include the following key:

**GigyaTouchIDMessage = (String) “Your custom message” (default = “Please authenticate to proceed”).**

# Android

1. Android SDK 23 and above is required.
2. The device has a fingerprint sensor available.
3. A minimum of 1 fingerprint already enrolled in the device.
4. Relevant permissions are already requested in the library manifest:
      android.permission.USE_FINGERPRINT
      android.permission.USE_BIOMETRIC

**Declaring you prompt display**
The Andorid biometric authentication uses a prompt display. You are able to customize the text shown by declaring your
own ***BiometricPromptIfo*** object.

In you application class (After initating the SDK), you can add the following:
```java
GigyaSdkBiometricModule.setBiometricPromptInfo(new GigyaPromptInfo(
                "Title", "Subtitle", "Description"
        ));
```

If no prompt info is supplied the prompt window will use default English texts.






## Known Issues
None

## How to obtain support
* [Via Github issues](https://github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud/issues)
* [Via SAP standard support](https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/4167e8a470b21014bbc5a10ce4041860.html)

## Contributing
Via pull request to this repository.
Please read the CONTRIBUTING file for guidelines.

## To-Do (upcoming changes)
None

## Licensing
Please see our [LICENSE](https://github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud/blob/main/LICENSE) for copyright and license information.
