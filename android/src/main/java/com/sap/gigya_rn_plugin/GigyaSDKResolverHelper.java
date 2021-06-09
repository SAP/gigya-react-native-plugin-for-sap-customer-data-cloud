package com.sap.gigya_rn_plugin;

import com.gigya.android.sdk.interruption.IPendingRegistrationResolver;
import com.gigya.android.sdk.interruption.link.ILinkAccountsResolver;

public class GigyaSDKResolverHelper {

    public String interrupt;
    
    public ILinkAccountsResolver linkAccountsResolver;
    public IPendingRegistrationResolver pendingRegistrationResolver;

    public void clear() {
        interrupt = null;
        linkAccountsResolver = null;
        pendingRegistrationResolver = null;
    }
}