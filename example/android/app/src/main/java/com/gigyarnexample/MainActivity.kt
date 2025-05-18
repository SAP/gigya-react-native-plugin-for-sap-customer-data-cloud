package com.gigyarnexample

import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Base64
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts.StartIntentSenderForResult
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.gigya.android.sdk.Gigya
import com.sap.gigya_rn_plugin.GigyaWebAuthnModule
import java.security.MessageDigest


class MainActivity : ReactActivity() {

    private val resultLauncher = registerForActivityResult(
        StartIntentSenderForResult()
    ) { result ->
        Gigya.getInstance().WebAuthn().handleFidoResult(result)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        GigyaWebAuthnModule.resultLauncher = resultLauncher
        getSignature()
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "GigyaRnExample"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


    // Call function to get the application signature used for Facebook login or Fido authentication.
    private fun getSignature() {
        try {
            val info = packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
            for (signature in info.signatures!!) {
                val md = MessageDigest.getInstance("SHA256")
                md.update(signature.toByteArray())
                Log.e(
                    "MY KEY HASH:", Base64.encodeToString(
                        md.digest(),
                        Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP
                    )
                )
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        }
    }

}
