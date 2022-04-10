package com.sap.gigya_rn_plugin;

import android.app.Application;
import android.content.pm.PackageInfo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.gigya.android.sdk.Gigya;
import com.gigya.android.sdk.GigyaCallback;
import com.gigya.android.sdk.GigyaDefinitions;
import com.gigya.android.sdk.GigyaLoginCallback;
import com.gigya.android.sdk.GigyaPluginCallback;
import com.gigya.android.sdk.account.models.GigyaAccount;
import com.gigya.android.sdk.api.GigyaApiResponse;
import com.gigya.android.sdk.api.IApiRequestFactory;
import com.gigya.android.sdk.interruption.IPendingRegistrationResolver;
import com.gigya.android.sdk.interruption.link.ILinkAccountsResolver;
import com.gigya.android.sdk.interruption.tfa.TFAResolverFactory;
import com.gigya.android.sdk.interruption.tfa.models.TFAProviderModel;
import com.gigya.android.sdk.network.GigyaError;
import com.gigya.android.sdk.session.SessionInfo;
import com.gigya.android.sdk.ui.plugin.GigyaPluginEvent;
import com.gigya.android.sdk.utils.CustomGSONDeserializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class GigyaSdkWrapper<T extends GigyaAccount> {

    public Gigya<T> gigyaInstance;

    private final Gson gson;

    private GigyaSDKResolverHelper resolverHelper = new GigyaSDKResolverHelper();

    private GigyaSdkPromiseWrapper promiseWrapper = new GigyaSdkPromiseWrapper();

    public GigyaSdkWrapper(Application application, Class<T> accountSchema) {
        Gigya.setApplication(application);
        gigyaInstance = Gigya.getInstance(accountSchema);

        final Type type = (new TypeToken<Map<String, Object>>() {
        }).getType();
        gson = new GsonBuilder().registerTypeAdapter(type, new CustomGSONDeserializer()).create();

        try {
            IApiRequestFactory ref = Gigya.getContainer().get(IApiRequestFactory.class);
            ref.setSDK("react_native_" + "0.0.5" + "_android_" + Gigya.VERSION);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    void initFor(@Nonnull String apikey, @Nullable String apiDomain) {
        if (apiDomain == null) {
            gigyaInstance.init(apikey);
            return;
        }
        gigyaInstance.init(apikey, apiDomain);
    }

    void getSession(Promise promise) {
        GigyaSdkRNLogger.log("getSession: called");
        final String sessionJson = mapObjectToJson(gigyaInstance.getSession());
        promise.resolve(sessionJson);
    }

    void setSession(@Nonnull String token, @Nonnull String secret, @Nonnull Double expiration, Promise promise) {
        GigyaSdkRNLogger.log("setSession: called");
        final SessionInfo session = new SessionInfo(secret, token, expiration.longValue());
        gigyaInstance.setSession(session);

        final String sessionJson = mapObjectToJson(session);
        promise.resolve(sessionJson);
    }

    void send(String api, String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("send: called");
        promiseWrapper.promise = promise;
        gigyaInstance.send(api, mapParams(jsonParameters), new GigyaCallback<GigyaApiResponse>() {            @Override
            public void onSuccess(GigyaApiResponse gigyaApiResponse) {
                GigyaSdkRNLogger.log("send: success with response: " + gigyaApiResponse.asJson());
                promiseWrapper.resolve(gigyaApiResponse);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("send: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void register(String email, String password, String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("register: called");
        promiseWrapper.promise = promise;
        gigyaInstance.register(email, password, mapParams(jsonParameters), new GigyaLoginCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("register: success with response: ");
                resolverHelper.clear();
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("register: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }

            @Override
            public void onConflictingAccounts(@NonNull GigyaApiResponse response, @NonNull ILinkAccountsResolver resolver) {
                resolverHelper.interrupt = "conflictingAccount";
                resolverHelper.linkAccountsResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingRegistration(@NonNull GigyaApiResponse response, @NonNull IPendingRegistrationResolver resolver) {
                resolverHelper.interrupt = "pendingRegistration";
                resolverHelper.pendingRegistrationResolver = resolver;
                promiseWrapper.reject(response);;
            }

            @Override
            public void onPendingVerification(@NonNull GigyaApiResponse response, @Nullable String regToken) {
                promiseWrapper.reject(response);
            }
        });
    }

    void login(@Nonnull String loginId, @Nonnull String password, @Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("login: called");
        promiseWrapper.promise = promise;
        gigyaInstance.login(loginId, password, mapParams(jsonParameters), new GigyaLoginCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("login: success with response: ");
                resolverHelper.clear();
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("register: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }

            @Override
            public void onConflictingAccounts(@NonNull GigyaApiResponse response, @NonNull ILinkAccountsResolver resolver) {
                resolverHelper.interrupt = "conflictingAccount";
                resolverHelper.linkAccountsResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingRegistration(@NonNull GigyaApiResponse response, @NonNull IPendingRegistrationResolver resolver) {
                resolverHelper.interrupt = "pendingRegistration";
                resolverHelper.pendingRegistrationResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingVerification(@NonNull GigyaApiResponse response, @Nullable String regToken) {
                promiseWrapper.reject(response);
            }
        });
    }

    void logout(Promise promise) {
        GigyaSdkRNLogger.log("logout: called");
        promiseWrapper.promise = promise;
        gigyaInstance.logout(new GigyaCallback<GigyaApiResponse>() {
            @Override
            public void onSuccess(GigyaApiResponse gigyaApiResponse) {
                resolverHelper.clear();
                GigyaSdkRNLogger.log("logout: success");
                promiseWrapper.resolve(gigyaApiResponse);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("logout: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void getAccount(@Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("getAccount: called");
        promiseWrapper.promise = promise;
        gigyaInstance.getAccount(true, mapParams(jsonParameters), new GigyaCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("getAccount: success");
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("getAccount: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void setAccount(@Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("setAccount: called");
        promiseWrapper.promise = promise;
        final Map<String, Object> mappedAccountParams = mapSetAccountParameters(jsonParameters);
        gigyaInstance.setAccount(mappedAccountParams, new GigyaCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("setAccount: success");
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("setAccount: error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void socialLogin(@Nonnull String provider, @Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("social login (" + provider + ") : called");
        promiseWrapper.promise = promise;
        gigyaInstance.login(provider, mapParams(jsonParameters), new GigyaLoginCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("social login : success");
                resolverHelper.clear();
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("social login : error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }

            @Override
            public void onConflictingAccounts(@NonNull GigyaApiResponse response, @NonNull ILinkAccountsResolver resolver) {
                resolverHelper.interrupt = "conflictingAccount";
                resolverHelper.linkAccountsResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingRegistration(@NonNull GigyaApiResponse response, @NonNull IPendingRegistrationResolver resolver) {
                resolverHelper.interrupt = "pendingRegistration";
                resolverHelper.pendingRegistrationResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingVerification(@NonNull GigyaApiResponse response, @Nullable String regToken) {
                promiseWrapper.reject(response);
            }
        });
    }

   void sso(@Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("sso login: called");
        promiseWrapper.promise = promise;
        gigyaInstance.login(GigyaDefinitions.Providers.SSO, mapParams(jsonParameters), new GigyaLoginCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("social login : success");
                resolverHelper.clear();
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("social login : error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }

            @Override
            public void onConflictingAccounts(@NonNull GigyaApiResponse response, @NonNull ILinkAccountsResolver resolver) {
                resolverHelper.interrupt = "conflictingAccount";
                resolverHelper.linkAccountsResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingRegistration(@NonNull GigyaApiResponse response, @NonNull IPendingRegistrationResolver resolver) {
                resolverHelper.interrupt = "pendingRegistration";
                resolverHelper.pendingRegistrationResolver = resolver;
                promiseWrapper.reject(response);
            }

            @Override
            public void onPendingVerification(@NonNull GigyaApiResponse response, @Nullable String regToken) {
                promiseWrapper.reject(response);
            }
        });
    }
    
    void addConnection(@Nonnull String provider, @Nonnull String jsonParameters, Promise promise) {
        GigyaSdkRNLogger.log("addConnection: called");
        promiseWrapper.promise = promise;
        gigyaInstance.addConnection(provider, mapParams(jsonParameters), new GigyaLoginCallback<T>() {
            @Override
            public void onSuccess(T account) {
                GigyaSdkRNLogger.log("addConnection : success");
                promiseWrapper.resolve(account);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("addConnection : error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void removeConnection(@Nonnull String provider, Promise promise) {
        GigyaSdkRNLogger.log("removeConnection: called");
        promiseWrapper.promise = promise;
        gigyaInstance.removeConnection(provider, new GigyaCallback<GigyaApiResponse>() {
            @Override
            public void onSuccess(GigyaApiResponse gigyaApiResponse) {
                GigyaSdkRNLogger.log("removeConnection : success");
                promiseWrapper.resolve(gigyaApiResponse);
            }

            @Override
            public void onError(GigyaError gigyaError) {
                GigyaSdkRNLogger.log("removeConnection : error with message: " + gigyaError.getLocalizedMessage());
                promiseWrapper.reject(gigyaError);
            }
        });
    }

    void resolve(@Nonnull String method, @Nonnull String jsonParameters, @Nonnull Promise promise) {
        GigyaSdkRNLogger.log("resolve: called with method:" + method);
        promiseWrapper.promise = promise;
        final Map<String, Object> params = mapParams(jsonParameters);
        switch(resolverHelper.interrupt) {
            case "pendingRegistration": {
                if (method.equals("setAccount")) {
                    final Map<String, Object> mappedAccountParams = mapSetAccountParameters(jsonParameters);
                    resolverHelper.pendingRegistrationResolver.setAccount(mappedAccountParams);
                }
                break;
            }
            case "conflictingAccount": {
                switch(method) {
                    case "getConflictingAccount": {
                        final String conflictingAccountsJson = mapObjectToJson(resolverHelper.linkAccountsResolver.getConflictingAccounts());
                        promise.resolve(conflictingAccountsJson);
                        break;   
                    }
                    case "linkToSite": {
                        resolverHelper.linkAccountsResolver.linkToSite((String) params.get("loginId"), (String) params.get("password"));
                        break;
                    }
                    case "linkToSocial": {
                        final String provider = (String) params.get("provider");
                        resolverHelper.linkAccountsResolver.linkToSocial(provider);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    void showScreenSet(@Nonnull String name, @Nonnull String jsonParameters, @Nonnull ReactApplicationContext rnContext) {
        GigyaSdkRNLogger.log("show screen-sets : called");
        gigyaInstance.showScreenSet(name, true, mapParams(jsonParameters), new GigyaPluginCallback<T>() {
            @Override
            public void onError(GigyaPluginEvent event) {
                emitScreenSetEvent("onError", event.getEventMap(), rnContext);
            }

            @Override
            public void onCanceled() {
                emitScreenSetEvent("onCanceled", null, rnContext);
            }

            @Override
            public void onBeforeValidation(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onBeforeValidation", event.getEventMap(), rnContext);
            }

            @Override
            public void onAfterValidation(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onAfterValidation", event.getEventMap(), rnContext);
            }

            @Override
            public void onBeforeSubmit(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onBeforeSubmit", event.getEventMap(), rnContext);
            }

            @Override
            public void onSubmit(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onSubmit", event.getEventMap(), rnContext);
            }

            @Override
            public void onAfterSubmit(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onAfterSubmit", event.getEventMap(), rnContext);
            }

            @Override
            public void onBeforeScreenLoad(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onBeforeScreenLoad", event.getEventMap(), rnContext);
            }

            @Override
            public void onAfterScreenLoad(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onAfterScreenLoad", event.getEventMap(), rnContext);
            }

            @Override
            public void onFieldChanged(@NonNull GigyaPluginEvent event) {
                emitScreenSetEvent("onFieldChanged", event.getEventMap(), rnContext);
            }

            @Override
            public void onHide(@NonNull GigyaPluginEvent event, String reason) {
                emitScreenSetEvent("onHide", event.getEventMap(), rnContext);
            }

            @Override
            public void onLogin(@NonNull T accountObj) {
                emitScreenSetEvent("onLogin", mapObject(accountObj), rnContext);
            }

            @Override
            public void onLogout() {
                emitScreenSetEvent("onLogout", null, rnContext);
            }

            @Override
            public void onConnectionAdded() {
                emitScreenSetEvent("onConnectionAdded", null, rnContext);
            }

            @Override
            public void onConnectionRemoved() {
                emitScreenSetEvent("onConnectionRemoved", null, rnContext);
            }
        });
    }

    /**
     * Event emitter for screen0-set event channel.
     */
    private void emitScreenSetEvent(@Nonnull String name, @Nullable Map<String, Object> data, ReactApplicationContext rnContext) {
        GigyaSdkRNLogger.log("emitScreenSetEvent : " + name);
        final Map<String, Object> mapped = new HashMap<>();
        mapped.put("event", name);
        if (data != null) {
            mapped.put("data", data);
        }
        rnContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("event", mapObjectToJson(mapped));
    }

    /**
     * Map parameter map from JSON string to usable map for SDK communications.
     */
    private Map<String, Object> mapParams(@Nonnull String json) {
        if (json.isEmpty()) return new HashMap<>();
        Map<String, Object> mapped = mapJson(json);
        return mapped;
    }

    /**
     * Map typed object to a Map<String, Any> object in order to pass on to
     * the method channel response.
     */
    private <V> Map<String, Object> mapObject(V object) {
        final String jsonString = gson.toJson(object);
        final Type type = (new TypeToken<Map<String, Object>>() {
        }).getType();
        return gson.fromJson(jsonString, type);
    }

    /**
     * Map object to JSON String.
     */
    private <V> String mapObjectToJson(V object) {
        String json = gson.toJson(object);
        return json;
    }

    /**
     * Map a JSON string to a Map<String, Any> object in order to pass on to
     * the method channel response.
     */
    private Map<String, Object> mapJson(String jsonString) {
        final Type type = (new TypeToken<Map<String, Object>>() {
        }).getType();
        return gson.fromJson(jsonString, type);
    }

     /**
     * Mapping specific set account parameters given a JSON String.
     *
     * @see <a href="https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/41398a8670b21014bbc5a10ce4041860.html?q=accounts.setAccountInfo</a>
     */
    private Map<String, Object> mapSetAccountParameters(String jsonString) {
        final Map<String, Object> mapped = mapJson(jsonString);
        for (Map.Entry<String, Object> entry : mapped.entrySet()) {
            if (entry.getValue() instanceof Map) {
                mapped.put(entry.getKey(), gson.toJson(entry.getValue()));
            }
        }
        return mapped;
    }

}