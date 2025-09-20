/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useRef, useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  AppState
} from 'react-native';

import Dialog from "react-native-dialog";
import Toast from 'react-native-simple-toast';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Gigya, GigyaError, GigyaInterruption} from 'gigya-react-native-plugin-for-sap-customer-data-cloud';

import { Button } from 'react-native';

import { IResolver, LinkAccountResolver, PendingVerificationResolver, PendingRegistrationResolver } from 'gigya-react-native-plugin-for-sap-customer-data-cloud';

let linkResolver: LinkAccountResolver | null = null;

const App = (): React.ReactElement => {

  const [visible, setVisible] = useState(false);
  const [visibleCustomId, setVisibleCustomId] = useState(false);
  const [visibleLink, setVisibleLink] = useState(false);
  const [visibleAccount, setVisibleAccount] = useState(false);

  console.log("RE-RENDER START ---------------")
  console.log("logged in state =  " + Gigya.isLoggedIn())
  console.log("biometric supported = " + Gigya.biometric.isSupported() + ", biometric opt-in =  " + Gigya.biometric.isOptIn() + ", biometric locked = " + Gigya.biometric.isLocked())
  console.log("RE-RENDER END -----------------")

  //START -  Foreground/Background app state tracker.
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Check biometric state on forground change.
        if (Gigya.biometric.isLocked()) {
          console.log("biometric state on forground change =  isLocked. calling unlockSession");
          unlockSession()
        } else if (Gigya.biometric.isOptIn()) {
          console.log("biometric state on forground change = opt-in but not locked. Idle");
        }
      } else {
        if (Gigya.biometric.isOptIn() && !Gigya.biometric.isLocked()) {
          // This code snippet can be commented in if automatic biometric lock is required for testing.
          //console.log("biometric state = opt-in - locking session automatically on background transition");
          //lockSession()
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  //END -  Foreground/Background app state tracker.

  Gigya.initFor("4_mL-YkAEegR9vzt6QvHWI5Q", "us1-st2.gigya.com");

  // Login state constant needs to be set only after SDK initialization!
  const [isLoggedIn, updateIsLoggedIn] = useState(Gigya.isLoggedIn());

  // Social login test implementation - currently testing web provider "linkedIn"
  const socialLogin = async () => {
    try {
      const request = await Gigya.socialLogin("linkedin");
      console.log("Social login success:\n" + JSON.stringify(request));

      // update logged in state
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {

      const e = error as GigyaError
      console.log("Social login error:\n" + JSON.stringify(e));

      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {

          console.log("socialLogin interruption: pending registration");

          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;
          console.log(resolver.regToken)

          // Test resolving using missing fields. This is relevant only for specific test site configuration.
          try {
            const setAccount = await resolver.setAccount({ "profile": { "zip": "34234" } })
            console.log("setAccount: " + JSON.stringify(setAccount));
            updateIsLoggedIn(Gigya.isLoggedIn())
          } catch (e) {
            console.log("setAccount error:" + e);
          }

          break
        }
        case GigyaInterruption.conflictingAccounts: {
          console.log("socialLogin interruption: conflictingAccounts");

          linkResolver = Gigya.resolverFactory.getResolver(e) as LinkAccountResolver;
          console.log("link:")
          console.log(linkResolver.regToken)
          const accounts = await linkResolver.getConflictingAccount()
          console.log("account:")
          console.log(JSON.stringify(accounts))
          setVisibleLink(true);
        }
      }
    }
  };

  // SSO (Single Sign-On) test implementation. This SSO method does not use WebViews!!
  const sso = async () => {
    try {
      console.log("sso sent")
      const request = await Gigya.sso();

      console.log("sso succcess:\n" + JSON.stringify(request));
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {
      const e = error as GigyaError
      console.log("sso error:\n" + JSON.stringify(e));

      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {

          console.log("sso interruption: pending registration");
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;
          console.log(resolver.regToken)

          // Test resolving using missing fields. This is relevant only for specific test site configuration.
          try {
            const setAccount = await resolver.setAccount({ "profile": { "zip": "34234" } })
            console.log("setAccount: " + JSON.stringify(setAccount));
            updateIsLoggedIn(Gigya.isLoggedIn())
          } catch (e) {
            console.log("setAccount error:" + e);
          }

          break
        }
        case GigyaInterruption.conflictingAccounts: {
          console.log("sso interruption: conflictingAccounts");
          linkResolver = Gigya.resolverFactory.getResolver(e) as LinkAccountResolver;

          console.log("link:")
          console.log(linkResolver.regToken)
          const accounts = await linkResolver.getConflictingAccount()
          console.log("account:")
          console.log(JSON.stringify(accounts))

          setVisibleLink(true);
        }
      }
    }
  };

  // Login test implementation using credentials pair.
  const login = async (login: string, password: string) => {
    try {
      const request = await Gigya.login(login, password);
      console.log("login success:\n" + request);
      updateIsLoggedIn(Gigya.isLoggedIn());
    } catch (error) {
      const e = error as GigyaError
      console.log("login error:\n" + JSON.stringify(e));

      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {

          console.log("login interruption: pending registration");

          // Test should continue using regToken when site is configured.
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;
          console.log(resolver.regToken)

          break
        }
      }
    }
  };

   // Login test implementation using custom identifer.
  const loginWithCustomId = async (identifer: string, password: string) => {
    try {
      const request = await Gigya.loginWithCustomId(identifer, "gigya.com/identifiers/customIdentifiers/nationalId", password);
      console.log("login with custom id success:\n" + request);
      updateIsLoggedIn(Gigya.isLoggedIn());
    } catch (error) {
      const e = error as GigyaError
      console.log("login error:\n" + JSON.stringify(e));

      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {

          console.log("login interruption: pending registration");

          // Test should continue using regToken when site is configured.
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;
          console.log(resolver.regToken)

          break
        }
      }
    }
  };

  // Logout test implementation.
  const logout = async () => {
    try {
      const request = await Gigya.logout()
      // Option to test invalidate session method directly instead of login.
      //const request = await Gigya.invalidateSession()
      console.log("logout:\n " + JSON.stringify(request));
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("Logout error:" + JSON.stringify(e));
      updateIsLoggedIn(Gigya.isLoggedIn())
    }
  };

  // Register test implementation using credentials pair.
  const register = async (login: string, password: string) => {
    try {
      const request = await Gigya.register(login, password, { 'sessionExpiration': 0 });
      console.log("register\n: " + JSON.stringify(request));
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {
      const e = error as GigyaError
      console.log("register error:\n" + JSON.stringify(e));

      switch (e.getInterruption()) {
        case GigyaInterruption.conflictingAccounts: {

          console.log("register interruption: conflictingAccounts");

          // Test should continue link flow when configured.
          const resolver = Gigya.resolverFactory.getResolver(e) as LinkAccountResolver;
          console.log(resolver.regToken)

          break
        }
      }

    }
  };

  // Get account info test implementation. Currently used to log response only. no effect in test application structure.
  const getAccount = async () => {
    try {
      const request = await Gigya.getAccount()
      console.log("getAccount:\n " + JSON.stringify(request));

    } catch (error) {
      const e = error as GigyaError
      console.log("getAccount error:\n" + JSON.stringify(e));
    }
  };

  // Set account info test implementation.
  const setAccount = async () => {
    try {
      // Update your example parameters here.
      const request = await Gigya.setAccount({ profile: { zip: 555555 } });
      console.log("setAccount:\n " + JSON.stringify(request));

    } catch (error) {
      const e = error as GigyaError
      console.log("setAccount error:\n" + JSON.stringify(e));
    }
  }

  // Show screenset test implementation. Currently using defualt site default created screen-set.
  const showScreenSet = () => {
    Gigya.showScreenSet("Default-RegistrationLogin", (event, data) => {

      // Test app currently only listening to login event on stream. Add relevant event callbacks if needed.
      console.log(`event: ${event} ${data}`);
      if (event == "onLogin") {
        updateIsLoggedIn(Gigya.isLoggedIn())
      }
    })
  };

  //START - Biometric operations

  // Biometric opt-in test implementation.
  const optIn = async () => {
    try {
      var operation = await Gigya.biometric.optIn()
      console.log("Biometric Opt-In: " + JSON.stringify(operation))
      console.log("Biometric Opt-In state = " + Gigya.biometric.isOptIn())

    } catch (error) {
      const e = error as GigyaError
      console.log("Biometric Opt-In operation error:\n" + JSON.stringify(e))
    }
  }

  // Biometric opt-out test implementation.
  const optOut = async () => {
    try {
      var operation = await Gigya.biometric.optOut()
      console.log("Biometric Opt-Out: " + JSON.stringify(operation))
      console.log("Biometric Opt-In state = " + Gigya.biometric.isOptIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("Biometric Opt-Out operation error:\n" + JSON.stringify(e))
      console.log("Session is unrecoverable - force invalidating session")
      await Gigya.invalidateSession()
      console.log("Session invalidated")
      updateIsLoggedIn(Gigya.isLoggedIn())
    }
  }

  // Biometric lock session test implementation.
  const lockSession = async () => {
    try {
      var operation = await Gigya.biometric.lockSession()
      console.log("Biometric lock session: " + JSON.stringify(operation))
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      // This case actually is redundant because SDK logic to lock the session is just to remove the session date from the heap.
      const e = error as GigyaError
      console.log("Biometric lock session error:\n" + JSON.stringify(e))
    }
  }

  // Biometric unlock session test implementation.
  const unlockSession = async () => {
    try {
      var operation = await Gigya.biometric.unlockSession()
      console.log("Biometric unlock session: " + JSON.stringify(operation))
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("Biometric unlock session error:\n" + JSON.stringify(e))
      console.log("Session is unrecoverable - force logging out session")
      logout()
    }
  }

  //END - Biometric operations

  //START - WebAuthn operations

  // FIDO/Passkey login test implementation.
  const webAuthnLogin = async () => {
    try {
      var operation = await Gigya.webAuthn.passkeyLogin()
      console.log("webAuthnLogin success:\n" + JSON.stringify(operation))
      Toast.show('WebAuthn login success', Toast.SHORT);
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("webAuthnLogin error:\n" + JSON.stringify(e))
    }
  }

  // FIDO/Passkey register implemntation.
  const webAuthnRegister = async () => {
    try {
      var operation = await Gigya.webAuthn.passkeyRegister()
      console.log("webAuthnRegister success:\n" + JSON.stringify(operation))
      Toast.show('WebAuthn registration success', Toast.SHORT);
    } catch (error) {
      const e = error as GigyaError
      console.log("webAuthnRegister error:\n" + JSON.stringify(e))
    }
  }

  //  FIOD/Passkey revoke test implementation.
  const webAuthnRevoke = async () => {
    try {
      var operation = await Gigya.webAuthn.passkeyRevoke("SE6cksXVBxJUnPvC/epe6g==")
      console.log("webAuthnRevoke success:\n" + JSON.stringify(operation))
      Toast.show('WebAuthn revoke success', Toast.SHORT);
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("webAuthnRevoke:\n" + JSON.stringify(e))
    }
  }

  const webAuthnGetCredentials = async () => {
    try {
      var operation = await Gigya.webAuthn.passkeyGetCredentials()
      console.log("webAuthnGetCredentials success:\n" + JSON.stringify(operation))
      Toast.show('webAuthnGetCredentials revoke success', Toast.SHORT);
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("webAuthnGetCredentials:\n" + JSON.stringify(e))
    }
  }

  //END - WebAuthn operations

  // Get auth code (exchange) test implementation.
  const getAuthCode = async () => {
    try {
      var code = await Gigya.getAuthCode()
      console.log("getAuthCode code: " + code)
    } catch (error) {
      const e = error as GigyaError
      console.log("getAuthCode error:\n" + JSON.stringify(e))
    }
  }

  // App method enumeration.
  enum Method {
    init,
    login,
    loginWithCustomId,
    register,
    social,
    logout,
    showScreenSet,
    setAccount,
    getAccount,
    sso,
    isOptIn,
    optIn,
    optOut,
    lockSession,
    unlockSession,
    webAuthnLogin,
    webAuthnRegister,
    webAuthnRevoke,
    webAuthnGetCredentials,
    getAuthCode
  }

  const [activeMethod, setActiveMethod] = useState(Method.init);

  const runMethod = (method: Method) => {
    switch (method) {
      case Method.init: {
        break
      }
      case Method.login: {
        setVisible(true)
        setActiveMethod(method)
        break
      }
      case Method.loginWithCustomId: {
        setVisibleCustomId(true)
        setActiveMethod(method)
        break
      }
      case Method.register: {
        setVisible(true)
        setActiveMethod(method)
        break
      }
      case Method.social: {
        socialLogin()
        break
      }
      case Method.logout: {
        logout()
        break
      }
      case Method.showScreenSet: {
        showScreenSet()
        break
      }
      case Method.getAccount: {
        getAccount()
        break
      }
      case Method.setAccount: {
        setVisibleAccount(true)
        setAccount()
        break
      }
      case Method.sso: {
        sso()
        break
      }
      case Method.isOptIn: {
        Gigya.biometric.isOptIn()
        break
      }
      case Method.optIn: {
        optIn()
        break
      }
      case Method.optOut: {
        optOut()
        break
      }
      case Method.lockSession: {
        lockSession()
        break
      }
      case Method.unlockSession: {
        unlockSession()
        break
      }
      case Method.webAuthnLogin: {
        webAuthnLogin()
        break
      }
      case Method.webAuthnRegister: {
        webAuthnRegister()
        break
      }
      case Method.webAuthnGetCredentials: {
        webAuthnGetCredentials()
        break
      }
      case Method.webAuthnRevoke: {
        webAuthnRevoke()
        break
      }
      case Method.getAuthCode: {
        getAuthCode()
        break
      }
    }
  }

  enum ShowIn {
    notLogged,
    loggedIn,
    both
  }

  type Link = {
    title: string,
    method: Method,
    description: string,
    show: ShowIn
  };


  // UI widget mapping.

  const links: (Link)[] = [
    {
      title: 'Init',
      method: Method.init,
      description: 'Customize initlize our sdk.',
      show: ShowIn.both
    },
    {
      title: 'Login',
      method: Method.login,
      description:
        'Login with credentials.',
      show: ShowIn.notLogged
    },
    {
      title: 'Login with Custom ID',
      method: Method.loginWithCustomId,
      description:
        'Login with Custom ID.',
      show: ShowIn.notLogged
    },
    {
      title: 'Register',
      method: Method.register,
      description:
        'Register with user/pass.',
      show: ShowIn.notLogged
    },
    {
      title: 'Social login',
      method: Method.social,
      description:
        'Login/Register with Social provider.',
      show: ShowIn.notLogged
    },
    {
      title: 'ScreenSet',
      method: Method.showScreenSet,
      description:
        'Pop the Web screenset.',
      show: ShowIn.both
    },
    {
      title: 'getAccount',
      method: Method.getAccount,
      description:
        'Get account information',
      show: ShowIn.loggedIn
    },
    {
      title: 'setAccount',
      method: Method.setAccount,
      description:
        'Set account information',
      show: ShowIn.loggedIn
    },
    {
      title: 'SSO',
      method: Method.sso,
      description:
        'Login via SSO',
      show: ShowIn.notLogged
    },
    {
      title: 'isOptIn',
      method: Method.isOptIn,
      description:
        'Is opt in',
      show: ShowIn.both
    },
    {
      title: 'optIn',
      method: Method.optIn,
      description:
        'Opt in',
      show: ShowIn.loggedIn
    },
    {
      title: 'optOut',
      method: Method.optOut,
      description:
        'Opt out',
      show: ShowIn.loggedIn
    },
    {
      title: 'lockSession',
      method: Method.lockSession,
      description:
        'Lock Session',
      show: ShowIn.loggedIn
    },

    {
      title: 'unlockSession',
      method: Method.unlockSession,
      description:
        'unlock Session',
      show: ShowIn.notLogged
    },
    {
      title: 'WebAuthn Login',
      method: Method.webAuthnLogin,
      description:
        'WebAuthn Login',
      show: ShowIn.notLogged
    },
    {
      title: 'WebAuthn Register',
      method: Method.webAuthnRegister,
      description:
        'WebAuthn Register',
      show: ShowIn.loggedIn
    },
    {
      title: 'WebAuthn getCredentials',
      method: Method.webAuthnGetCredentials,
      description:
        'WebAuthn getCredentials',
      show: ShowIn.loggedIn
    },
    {
      title: 'WebAuthn Revoke',
      method: Method.webAuthnRevoke,
      description:
        'WebAuthn Revoke',
      show: ShowIn.loggedIn
    },
    {
      title: 'Get AuthCode',
      method: Method.getAuthCode,
      description:
        'Get AuthCode',
      show: ShowIn.loggedIn
    },
    {
      title: 'logout',
      method: Method.logout,
      description:
        'Call Logout.',
      show: ShowIn.loggedIn
    },

  ];

  type user = {
    login: string,
    password: string
  };

  const handleCancel = () => {
    setVisible(false)
    setVisibleLink(false)
    setVisibleAccount(false)
    setVisibleCustomId(false)
    dispose()
  };

  const handleLogin = () => {
    setVisible(false)
    console.log(activeMethod)
    switch (activeMethod) {
      case Method.login: {
        login(userData.login, userData.password)
        dispose()
        break
      }
      case Method.register: {
        register(userData.login, userData.password)
        dispose()
        break
      }
    }
    dispose()
  };

  const handleLoginWithCustomId = () => {
    setVisibleCustomId(false)
    console.log(activeMethod)
    switch (activeMethod) {
      case Method.loginWithCustomId: {
        loginWithCustomId(userData.login, userData.password)
        dispose()
        break
      }
    }
    dispose()
  };

  const handleSetAccount = () => {
    setVisibleAccount(false)
    console.log(activeMethod)
    setAccount()
    dispose
  }

  const handleSiteLink = async () => {
    console.log(linkResolver);
    const loginToSite = await linkResolver?.linkToSite(userData.login, userData.password);
    console.log("link to site:");
    console.log(JSON.stringify(loginToSite));

    updateIsLoggedIn(Gigya.isLoggedIn());
    setVisibleLink(false);
  };

  const dispose = () => {
    userData.login = ""
    userData.password = ""
  };

  var userData: user = { login: "", password: "" };

  return (
    <>
      <Dialog.Container visible={visibleLink}>
        <Dialog.Title>Link To Site</Dialog.Title>
        <Dialog.Input label="email" onChangeText={(email: string) => userData.login = email} />
        <Dialog.Input label="password" onChangeText={(pass: string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSiteLink} />
      </Dialog.Container>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Login/Register</Dialog.Title>
        <Dialog.Input label="email" onChangeText={(email: string) => userData.login = email} />
        <Dialog.Input label="password" onChangeText={(pass: string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleLogin} />
      </Dialog.Container>

      <Dialog.Container visible={visibleCustomId}>
        <Dialog.Title>Login with Custom ID</Dialog.Title>
        <Dialog.Input label="identifer" onChangeText={(identifer: string) => userData.login = identifer} />
        <Dialog.Input label="password" onChangeText={(pass: string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleLoginWithCustomId} />
      </Dialog.Container>

      <Dialog.Container visible={visibleAccount}>
        <Dialog.Title>Set account info (must have a valid session)</Dialog.Title>
        <Dialog.Description>Update your example parameters within the setAccount methood</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSetAccount} />
      </Dialog.Container>

      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text style={styles.header}>Welcome to Gigya(SAP) React Plugin</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>User Status:</Text>
              <Text style={styles.sectionDescription}>
                {isLoggedIn ? <Text style={styles.greenText}>Logged in</Text> : <Text style={styles.redText}>Not Logged in</Text>}
              </Text>
            </View>
            <View style={styles.container}>
              {links.map((item, index) => {
                if (item.show == ShowIn.loggedIn && !isLoggedIn || item.show == ShowIn.notLogged && isLoggedIn) {
                  return null
                }
                return (
                  <React.Fragment key={index}>
                    <View style={styles.separator} />
                    <TouchableOpacity
                      accessibilityRole={'button'}
                      onPress={() => { runMethod(item.method) }}
                      style={styles.linkContainer}>
                      <Text style={styles.link}>{item.title}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.black,
    backgroundColor: Colors.grey,
    textAlign: 'center',
    padding: 16,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },

  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  linkContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  link: {
    flex: 2,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.primary,
  },
  description: {
    flex: 3,
    paddingVertical: 16,
    fontWeight: '400',
    fontSize: 18,
    color: Colors.dark,
  },
  separator: {
    backgroundColor: Colors.light,
    height: 1,
  },
  redText: {
    color: 'red',
  },
  greenText: {
    color: 'green'
  }
});

export default App;
