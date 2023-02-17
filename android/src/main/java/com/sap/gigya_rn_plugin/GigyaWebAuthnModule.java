package com.sap.gigya_rn_plugin;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class GigyaWebAuthnModule extends ReactContextBaseJavaModule {

    @NonNull
    @Override
    public String getName() {
        return "GigyaWebAuthn";
    }

    private final ReactApplicationContext reactContext;

    private GigyaWebAuthnWrapper webAuthnWrapper;

    public static ActivityResultLauncher<IntentSenderRequest> resultLauncher;

    public GigyaWebAuthnModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        this.webAuthnWrapper = new GigyaWebAuthnWrapper();
    }

    @ReactMethod
    public void login(Promise promise) {
        this.webAuthnWrapper.login(promise, resultLauncher);
    }

    @ReactMethod
    public void register(Promise promise) {
        this.webAuthnWrapper.register(promise, resultLauncher);
    }

    @ReactMethod
    public void revoke(Promise promise) {
        this.webAuthnWrapper.revoke(promise);
    }
}
