package com.sap.gigya_rn_plugin;

import com.facebook.react.bridge.Promise;
import com.gigya.android.sdk.account.models.GigyaAccount;
import com.gigya.android.sdk.api.GigyaApiResponse;
import com.gigya.android.sdk.network.GigyaError;
import com.gigya.android.sdk.utils.CustomGSONDeserializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Map;

public class GigyaSdkPromiseWrapper<T extends GigyaAccount> {

    private final Gson gson;
    public Promise promise;

    public GigyaSdkPromiseWrapper() {
        final Type type = (new TypeToken<Map<String, Object>>() {
        }).getType();
        gson = new GsonBuilder().registerTypeAdapter(type, new CustomGSONDeserializer()).create();
    }

    public void dispose() {
        this.promise = null;
    }

    public void resolve(T account) {
        if (promise == null) return;
        promise.resolve(gson.toJson(account));
    }

    public void resolve(GigyaApiResponse response) {
        if (promise == null) return;
        promise.resolve(response.asJson());
    }

    public void reject(GigyaError error) {
        if (promise == null) return;
        promise.reject(String.valueOf(error.getErrorCode()), error.getData());
    }

    public void reject(GigyaApiResponse response) {
        if (promise == null) return;
        promise.reject(String.valueOf(response.getErrorCode()), response.asJson());
    }

}