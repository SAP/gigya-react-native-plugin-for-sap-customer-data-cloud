package com.sap.gigya_rn_plugin;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gigya.android.sdk.auth.passkeys.PasskeysAuthenticationProvider;

import java.lang.ref.WeakReference;

public class GigyaWebAuthnModule extends ReactContextBaseJavaModule {

    @NonNull
    @Override
    public String getName() {
        return "GigyaWebAuthn";
    }

    private final ReactApplicationContext reactContext;

    private GigyaWebAuthnWrapper webAuthnWrapper;
    
    private PasskeysAuthenticationProvider passkeyAuthProvider;

    public static ActivityResultLauncher<IntentSenderRequest> resultLauncher;

    public GigyaWebAuthnModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        this.webAuthnWrapper = new GigyaWebAuthnWrapper();
    }

    private void initializePasskeyAuthProviderIfNeeded() {
        if (this.passkeyAuthProvider == null && this.reactContext.getCurrentActivity() != null) {
            this.passkeyAuthProvider = new PasskeysAuthenticationProvider(
                new WeakReference<>(this.reactContext.getCurrentActivity())
            );
            GigyaSdkModule.gigyaSdk.gigyaInstance.setPasskeyAuthenticatorProvider(this.passkeyAuthProvider);
        }
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

    @ReactMethod
    public void passkeyLogin(Promise promise) {
        initializePasskeyAuthProviderIfNeeded();
        this.webAuthnWrapper.passkeyLogin(promise);
    }

    @ReactMethod
    public void passkeyRegister(Promise promise) {
        initializePasskeyAuthProviderIfNeeded();
        this.webAuthnWrapper.passkeyRegister(promise);
    }

    @ReactMethod
    public void passkeyRevoke(String id, Promise promise) {
        this.webAuthnWrapper.passkeyRevoke(id, promise);
    }

    @ReactMethod
    public void passkeyGetCredentials(Promise promise) {
        this.webAuthnWrapper.passkeyGetCredentials(promise);
    }
    
}
