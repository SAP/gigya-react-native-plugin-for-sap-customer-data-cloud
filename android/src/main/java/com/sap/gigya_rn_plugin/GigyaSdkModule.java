package com.sap.gigya_rn_plugin;

import android.app.Application;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.gigya.android.sdk.account.models.GigyaAccount;

import java.util.HashMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class GigyaSdkModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private static GigyaSdkWrapper gigyaSdk;

    public GigyaSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "GigyaSdk";
    }

    /**
     * Set the Core SDK custom schema object.
     * Method must be called in your implementing application class.
     */
    public static <T extends GigyaAccount> void setSchema(@Nonnull Application application, @Nonnull Class<T> accountSchema) {
        gigyaSdk = new GigyaSdkWrapper<>(application, accountSchema);
    }

    @ReactMethod
    public void initFor(String apikey, String apiDomain) {
        gigyaSdk.initFor(apikey, apiDomain);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isLoggedIn() {
        final boolean isLoggedIn = gigyaSdk.gigyaInstance.isLoggedIn();
        return isLoggedIn;
    }

    @ReactMethod
    public void getSession(Promise promise) {
        gigyaSdk.getSession(promise);
    }

    @ReactMethod
    public void setSession(@Nonnull String token, @Nonnull String secret, @Nonnull Double expiration, Promise promise) {
        gigyaSdk.setSession(token, secret, expiration, promise);
    }

    @ReactMethod
    public void send(@Nonnull String api, @Nullable String params, Promise promise) {
        gigyaSdk.send(api, params, promise);
    }

    @ReactMethod
    public void register(@Nonnull String email, @Nonnull String password, @Nonnull String params, Promise promise) {
        gigyaSdk.register(email, password, params, promise);
    }

    @ReactMethod
    public void login(@Nonnull String loginId, @Nonnull String password, @Nonnull String params, Promise promise) {
        gigyaSdk.login(loginId, password, params, promise);
    }

    @ReactMethod
    public void logout(Promise promise) {
        gigyaSdk.logout(promise);
    }

    @ReactMethod
    public void getAccount(@Nonnull String params, Promise promise) {
        gigyaSdk.getAccount(params, promise);
    }

    @ReactMethod
    public void setAccount(@Nonnull String params, Promise promise) {
        gigyaSdk.setAccount(params, promise);
    }

    @ReactMethod
    public void socialLogin(@Nonnull String provider, @Nonnull String params, Promise promise) {
        gigyaSdk.socialLogin(provider, params, promise);
    }

    @ReactMethod
    public void sso(@Nonnull String params, Promise promise) {
        gigyaSdk.sso(params, promise);
    }

    @ReactMethod
    public void addConnection(@Nonnull String provider, @Nonnull String params, Promise promise) {
        gigyaSdk.addConnection(provider, params, promise);
    }

    @ReactMethod
    public void removeConnection(@Nonnull String provider, Promise promise) {
        gigyaSdk.removeConnection(provider, promise);
    }

    @ReactMethod
    public void resolve(@Nonnull String method, @Nonnull String params, Promise promise) {
        gigyaSdk.resolve(method, params, promise);
    }

    @ReactMethod
    public void showScreenSet(@Nonnull String name, @Nonnull String params) {
        gigyaSdk.showScreenSet(name, params, this.reactContext);
    }

}
