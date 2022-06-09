package com.sap.gigya_rn_plugin;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gigya.android.sdk.biometric.GigyaPromptInfo;


public class GigyaSdkBiometricModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private static GigyaSdkBiometricWrapper gigyaBiometricSdk;

    public GigyaSdkBiometricModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        gigyaBiometricSdk = new GigyaSdkBiometricWrapper();
    }

    public static void setBiometricPromptInfo(GigyaPromptInfo info) {
        gigyaBiometricSdk.promptInfo = info;
    }

    @Override
    public String getName() {
        return "GigyaBiometric";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupported() {
        return gigyaBiometricSdk.isSupported();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isLocked() {
        return gigyaBiometricSdk.isLocked();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isOptIn() {
        return gigyaBiometricSdk.isOptIn();
    }

    @ReactMethod
    public void optIn(Promise promise) {
        gigyaBiometricSdk.optIn(getCurrentActivity(),  promise);
    }

    @ReactMethod
    public void optOut(Promise promise) {
        gigyaBiometricSdk.optOut(getCurrentActivity(), promise);
    }

    @ReactMethod
    public void lockSession(Promise promise) {
        gigyaBiometricSdk.lockSession(promise);
    }

    @ReactMethod
    public void unlockSession(Promise promise) {
        gigyaBiometricSdk.unlockSession(getCurrentActivity(),  promise);
    }

}
