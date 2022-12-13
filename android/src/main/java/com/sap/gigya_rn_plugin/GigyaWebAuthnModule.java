package com.sap.gigya_rn_plugin;

import android.app.Activity;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gigya.android.sdk.Gigya;

public class GigyaWebAuthnModule extends ReactContextBaseJavaModule {

    @NonNull
    @Override
    public String getName() {
        return "GigyaWebAuthn";
    }

    private final ReactApplicationContext reactContext;

    private GigyaWebAuthnWrapper webAuthnWrapper;

    private ActivityResultLauncher<IntentSenderRequest> resultLauncher;

    public GigyaWebAuthnModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        this.webAuthnWrapper = new GigyaWebAuthnWrapper();
        attachResultLauncherToActivity();
    }

    private void attachResultLauncherToActivity() {
        Activity activity = this.reactContext.getCurrentActivity();
        if (activity == null) return;
        if (this.reactContext.getCurrentActivity() instanceof ComponentActivity) {
            resultLauncher = ((ComponentActivity) activity).registerForActivityResult(
                    new ActivityResultContracts.StartIntentSenderForResult(),
                    new ActivityResultCallback<ActivityResult>() {
                        @Override
                        public void onActivityResult(ActivityResult result) {
                            Gigya.getInstance().WebAuthn().handleFidoResult(result);
                        }
                    }

            );
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
}
