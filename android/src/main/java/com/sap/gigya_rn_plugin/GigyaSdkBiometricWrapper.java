package com.sap.gigya_rn_plugin;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.gigya.android.sdk.account.models.GigyaAccount;
import com.gigya.android.sdk.biometric.GigyaBiometric;
import com.gigya.android.sdk.biometric.GigyaPromptInfo;
import com.gigya.android.sdk.biometric.IGigyaBiometricCallback;
import com.gigya.android.sdk.utils.CustomGSONDeserializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Map;

public class GigyaSdkBiometricWrapper<T extends GigyaAccount> {

    private static final String ERROR_RECOGNITION_FAILURE = "Fingerprint recognition failed";

    public GigyaBiometric gigyaBiometricInstance;

    private final Gson gson;

    public static GigyaPromptInfo promptInfo;

    public GigyaSdkBiometricWrapper() {
        gigyaBiometricInstance = GigyaBiometric.getInstance();

        final Type type = (new TypeToken<Map<String, Object>>() {
        }).getType();
        gson = new GsonBuilder().registerTypeAdapter(type, new CustomGSONDeserializer()).create();

        // Set default prompt information.
        promptInfo = new GigyaPromptInfo("Please authenticate", "Place your finger on the sensor", "");
    }

    public boolean isSupported() {
        return gigyaBiometricInstance.isAvailable();
    }

    public boolean isLocked() {
        return gigyaBiometricInstance.isLocked();
    }

    public boolean isOptIn() {
        return gigyaBiometricInstance.isOptIn();
    }

    void optIn(Activity activity, final Promise promise) {
        gigyaBiometricInstance.optIn(activity, promptInfo,
                new IGigyaBiometricCallback() {
                    @Override
                    public void onBiometricOperationCanceled() {
                        promise.reject("opt in canceled");
                    }

                    @Override
                    public void onBiometricOperationSuccess(@NonNull GigyaBiometric.Action action) {
                        if (action.equals(GigyaBiometric.Action.OPT_IN)) {
                            promise.resolve(true);
                        }
                    }

                    @Override
                    public void onBiometricOperationFailed(String s) {
                        if (rejectBiometricFailure(s)) {
                            promise.reject(s);
                        }
                    }
                });
    }

    void optOut(Activity activity, final Promise promise) {
        gigyaBiometricInstance.optOut(activity, promptInfo,
                new IGigyaBiometricCallback() {
                    @Override
                    public void onBiometricOperationCanceled() {
                        promise.reject("opt in canceled");
                    }

                    @Override
                    public void onBiometricOperationSuccess(@NonNull GigyaBiometric.Action action) {
                        if (action.equals(GigyaBiometric.Action.OPT_OUT)) {
                            promise.resolve(true);
                        }
                       
                    }

                    @Override
                    public void onBiometricOperationFailed(String s) {
                        if (rejectBiometricFailure(s)) {
                            promise.reject(s);
                        }
                    }
                });
    }

    void lockSession(final Promise promise) {
        gigyaBiometricInstance.lock(new IGigyaBiometricCallback() {

            @Override
            public void onBiometricOperationCanceled() {
                promise.reject("opt in canceled");
            }

            @Override
            public void onBiometricOperationSuccess(@NonNull GigyaBiometric.Action action) {
                if (action.equals(GigyaBiometric.Action.LOCK)) {
                    promise.resolve(true);
                }
                
            }

            @Override
            public void onBiometricOperationFailed(String s) {
                promise.reject(s);
            }
        });

    }

    void unlockSession(Activity activity, final Promise promise) {
        gigyaBiometricInstance.unlock(activity, promptInfo,
                new IGigyaBiometricCallback() {
                    @Override
                    public void onBiometricOperationCanceled() {
                        promise.reject("opt in canceled");
                    }

                    @Override
                    public void onBiometricOperationSuccess(@NonNull GigyaBiometric.Action action) {
                        if (action.equals(GigyaBiometric.Action.UNLOCK)) {
                            promise.resolve(true);
                        }
                        
                    }

                    @Override
                    public void onBiometricOperationFailed(String s) {
                        if (rejectBiometricFailure(s)) {
                            promise.reject(s);
                        }
                    }
                });
    }

    boolean rejectBiometricFailure(String propagated) {
        return !propagated.equals(ERROR_RECOGNITION_FAILURE);
    }

}