/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';

import Dialog from "react-native-dialog";

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Gigya, GigyaError, GigyaInterruption } from 'gigya-react-native-plugin-for-sap-customer-data-cloud';
import { Button } from 'react-native';
import { IResolver, LinkAccountResolver, PendingVerificationResolver } from 'gigya-react-native-plugin-for-sap-customer-data-cloud/src/resolvers';
import { PendingRegistrationResolver } from 'gigya-react-native-plugin-for-sap-customer-data-cloud/src/resolvers';

let linkResolver: LinkAccountResolver | null = null; 

const App = (): React.ReactElement => {
  const [isLoggedIn, updateIsLoggedIn] = useState(Gigya.isLoggedIn());

  const [visible, setVisible] = useState(false);
  const [visibleLink, setVisibleLink] = useState(false);
  const [visibleAccount, setVisibleAccount] = useState(false);

  console.log("is: " + Gigya.isLoggedIn())

  console.log("biometric: " + Gigya.biometric.isSupported())

  console.log("biometric lock: " + Gigya.biometric.isLocked())

  Gigya.initFor("3_KF6Dwf0BoTktLiX54s_rSWRiklW69xCLG8pZa413Z6pkuBGBwQeSK9k19grZfCDe");

  const sendApi = async () => {
    try {
      const senddd = await Gigya.send("socialize.getSDKConfig");
      console.log("send: " + JSON.stringify(senddd));
    } catch (error) {
      console.log("errorSend:" + error);
    }
  };


  const socialLogin = async () => {
    try {
      const senddd = await Gigya.socialLogin("facebook");

      console.log("socialLogin: " + JSON.stringify(senddd));

      
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("errorSend:" + JSON.stringify(e));

      console.log("socialLogin interruption");
      
      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;

          console.log("pendingRegistration:")
          console.log(resolver.regToken)

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
          console.log("conflictingAccounts start")
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

  const sso = async () => {
    try {      const senddd = await Gigya.send("accounts.getAccountInfo"); 
      console.log("send: " + JSON.stringify(senddd));    } 
      catch (error) {   
           console.log("errorSendaaa:" + JSON.stringify(error));  
            }
    try {
      const senddd = await Gigya.sso();

      console.log("sso: " + JSON.stringify(senddd));

      
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      const e = error as GigyaError
      console.log("errorSend:" + JSON.stringify(e));

      console.log("sso interruption");
      
      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;

          console.log("pendingRegistration:")
          console.log(resolver.regToken)

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
          console.log("conflictingAccounts start")
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

  const login = async (login: string, password: string) => {
    console.log("start login");
    try {
      const send = await Gigya.login(login, password);
      console.log("login: " + send);
      updateIsLoggedIn(Gigya.isLoggedIn());
      console.log("login status: "+Gigya.isLoggedIn());
    } catch (error) {
      const e = error as GigyaError
      console.log("login error:" + e);
          
      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {
          const resolver = Gigya.resolverFactory.getResolver(e) as PendingRegistrationResolver;

          console.log("pendingRegistration:")
          console.log(resolver.regToken)

          break
        }
      }

      console.log("errorSend:" + e.errorCode);

    }
  };

  const logout = async () => {
    try {
      const senddd = await Gigya.logout()
      console.log("logout: " + JSON.stringify(senddd));
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      console.log("Logout error:" + error);
    }
  };

  const register = async (login: string, password: string) => {
    try {
      const senddd = await Gigya.register(login, password, { 'sessionExpiration': 0 });
      console.log("register: " + JSON.stringify(senddd));
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {
      const e = error as GigyaError
      console.log("register error:" + e);

      switch (e.getInterruption()) {
        case GigyaInterruption.conflictingAccounts: {
          const resolver = Gigya.resolverFactory.getResolver(e) as LinkAccountResolver;

          console.log("link:")
          console.log(resolver.regToken)

          break
        }
      }

    }
  };

  const getAccount = async () => {
    try {
      const send = await Gigya.getAccount()
      console.log("getAccount: " + JSON.stringify(send));

    } catch (error) {
      console.log("getAccount error:" + error);
    }
  };

  const setAccount = async () => {
    console.log("setAccount called");
    try {
      // Update your example parameters here.
      const send = Gigya.setAccount({profile: { zip: 555555}});
    } catch(error) {
      const e = error as GigyaError
      console.log("setAccount error:" + e);
    }
}


  const showScreenSet = () => {
    Gigya.showScreenSet("Default-RegistrationLogin", (event, data) => {
      console.log(`event: ${event}`);
      if (event == "onLogin") {
        updateIsLoggedIn(Gigya.isLoggedIn())
      }
    })
  };

  // START: Biometric operations

  const optIn = async () => {
      try {
        var operation = await Gigya.biometric.optIn()
        console.log("biometric operation " + operation)
      } catch (e) {
          console.log("opt in error " + e)
      }
  }

  const optOut = async () => {
    try {
      var operation = await Gigya.biometric.optOut()
      console.log("biometric operation " + operation)
    } catch (e) {
        console.log("opt in error " + e)
    } 
  }

  const lockSession = async () => {
    try {
      var operation = await Gigya.biometric.lockSession()
      console.log("biometric operation " + operation)
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (e) {
        console.log("opt in error " + e)
    } 
  }

  const unlockSession = async () => {
    try {
      var operation = await Gigya.biometric.unlockSession()
      console.log("biometric operation " + operation)
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (e) {
        console.log("opt in error " + e)
    } 
  }

  // END: Biometric operations

  enum Method {
    init,
    login,
    register,
    social,
    logout,
    showScreenSet,
    setAccount,
    sso,
    isOptIn,
    optIn,
    optOut,
    lockSession,
    unlockSession
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
    }
  }

  type Link = {
    title: string,
    method: Method,
    description: string
  };

  const links: (Link)[] = [
    {
      title: 'Init',
      method: Method.init,
      description: 'Customize initlize our sdk.',
    },
    {
      title: 'Login',
      method: Method.login,
      description:
        'Login with credentials.',
    },
    {
      title: 'Register',
      method: Method.register,
      description:
        'Register with user/pass.',
    },
    {
      title: 'Social login',
      method: Method.social,
      description:
        'Login/Register with Social provider.',
    },
    {
      title: 'ScreenSet',
      method: Method.showScreenSet,
      description:
        'Pop the Web screenset.',
    },
    {
      title: 'setAccount',
      method: Method.setAccount,
      description:
        'Set account information',
    },
    {
      title: 'SSO',
      method: Method.sso,
      description:
        'Login via SSO',
    },
    {
      title: 'isOptIn',
      method: Method.isOptIn,
      description:
        'Is opt in',
    },
    {
      title: 'optIn',
      method: Method.optIn,
      description:
        'Opt in',
    },
    {
      title: 'optOut',
      method: Method.optOut,
      description:
        'Opt out',
    },
    {
      title: 'lockSession',
      method: Method.lockSession,
      description:
        'Lock Session',
    },

    {
      title: 'unlockSession',
      method: Method.unlockSession,
      description:
        'unlock Session',
    },
    {
      title: 'logout',
      method: Method.logout,
      description:
        'Call Logout.',
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

    var userData: user = {login: "", password: ""};

  return (
    <>
      <Dialog.Container visible={visibleLink}>
        <Dialog.Title>Link To Site</Dialog.Title>
        <Dialog.Input label="email" onChangeText={(email : string) => userData.login = email} />
        <Dialog.Input label="password" onChangeText={(pass : string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSiteLink} />
      </Dialog.Container>
      
      <Dialog.Container visible={visible}>
        <Dialog.Title>Login/Register</Dialog.Title>
        <Dialog.Input label="email" onChangeText={(email : string) => userData.login = email} />
        <Dialog.Input label="password" onChangeText={(pass : string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleLogin} />
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
                if (item.method == Method.logout && !isLoggedIn) {
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
