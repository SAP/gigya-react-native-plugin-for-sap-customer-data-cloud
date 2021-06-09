package com.sap.gigya_rn_plugin;

import android.util.Log;

import com.facebook.react.BuildConfig;

/**
 * Plugin logger used for debug purposes only.
 */
public class GigyaSdkRNLogger {

    public static void log(String message) {
        if (BuildConfig.DEBUG) {
            Log.d("RN Gigya Plugin", message);
        }
    }
}
