package com.sap.gigya_rn_plugin;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;

import com.facebook.react.bridge.Promise;
import com.gigya.android.sdk.GigyaCallback;
import com.gigya.android.sdk.GigyaLoginCallback;
import com.gigya.android.sdk.account.models.GigyaAccount;
import com.gigya.android.sdk.api.GigyaApiResponse;
import com.gigya.android.sdk.network.GigyaError;

public class GigyaWebAuthnWrapper<T extends GigyaAccount> {

    private GigyaSdkPromiseWrapper promiseWrapper = new GigyaSdkPromiseWrapper();

    public void register(Promise promise, ActivityResultLauncher<IntentSenderRequest> resultLauncher) {
        promiseWrapper.promise = promise;
        GigyaSdkModule.gigyaSdk.gigyaInstance.WebAuthn().register(
                resultLauncher, new GigyaCallback<GigyaApiResponse>() {
                    @Override
                    public void onSuccess(GigyaApiResponse response) {
                        promiseWrapper.resolve(response);
                    }

                    @Override
                    public void onError(GigyaError error) {
                        promiseWrapper.reject(error);
                    }
                });
    }

    public void login(Promise promise, ActivityResultLauncher<IntentSenderRequest> resultLauncher) {
        promiseWrapper.promise = promise;
        GigyaSdkModule.gigyaSdk.gigyaInstance.WebAuthn().login(resultLauncher, new GigyaLoginCallback<T>() {

            @Override
            public void onSuccess(T account) {
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError error) {
                promiseWrapper.reject(error);
            }
        });
    }

    public void revoke(Promise promise) {
        promiseWrapper.promise = promise;
        GigyaSdkModule.gigyaSdk.gigyaInstance.WebAuthn().revoke(new GigyaCallback<GigyaApiResponse>() {
            @Override
            public void onSuccess(GigyaApiResponse response) {
                promiseWrapper.resolve(response);
            }

            @Override
            public void onError(GigyaError error) {
                promiseWrapper.reject(error);
            }
        });
    }

}
