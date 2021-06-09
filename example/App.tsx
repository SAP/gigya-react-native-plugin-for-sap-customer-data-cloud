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
import { LinkAccountResolver, PendingVerificationResolver } from 'gigya-react-native-plugin-for-sap-customer-data-cloud/resolvers';
import { PendingRegistrationResolver } from 'gigya-react-native-plugin-for-sap-customer-data-cloud/resolvers';

const App = (): React.ReactElement => {
  const [isLoggedIn, updateIsLoggedIn] = useState(Gigya.isLoggedIn());

  const [visible, setVisible] = useState(false);

  console.log("is: " + Gigya.isLoggedIn())

  Gigya.initFor("3_KF6Dwf0BoTktLiX54s_rSWRiklW69xCLG8pZa413Z6pkuBGBwQeSK9k19grZfCDe");

  const sendApi = async () => {
    try {
      const senddd = await Gigya.send("socialize.getSDKConfig");
      console.log("sendd: " + JSON.stringify(senddd));
    } catch (error) {
      console.log("errorSend:" + error);
    }
  };


  const socialLogin = async () => {
    try {
      const senddd = await Gigya.socialLogin("facebook");

      console.log("sendd: " + JSON.stringify(senddd));

      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      console.log("errorSend:" + error);

      const e = new GigyaError(error)
      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {
          const resolver = Gigya.resolverFactory.getResolver<PendingRegistrationResolver>(e)

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
          const resolver = Gigya.resolverFactory.getResolver<LinkAccountResolver>(e)

          console.log("link:")
          console.log(resolver.regToken)
          const accounts = await resolver.getConflictingAccount()
          console.log("account:")
          console.log(JSON.stringify(accounts))

          Alert.prompt(
            "Site Link Account",
            "Login with user and pass",
            [
              {
                text: "Cancel",
                onPress: () => Alert.alert("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: 'login',
                onPress: async (data) => {
                  const userData: user = data as unknown as user;
                  const loginToSite = await resolver.linkToSite(userData.login, userData.password)
                  console.log("link to site:")
                  console.log(JSON.stringify(loginToSite))

                  updateIsLoggedIn(Gigya.isLoggedIn())
                }
              }
            ],
            'login-password'
          );
        }
      }
    }
  };

  const login = async (login: string, password: string) => {
    try {
      const senddd = await Gigya.login(login, password);
      console.log("sendd: " + senddd);
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      console.log("login error:" + error);
    
      const e = error as GigyaError;
      
      switch (e.getInterruption()) {
        case GigyaInterruption.pendingRegistration: {
          const resolver = Gigya.resolverFactory.getResolver(e)

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
      console.log("sendd: " + JSON.stringify(senddd));
      updateIsLoggedIn(Gigya.isLoggedIn())
    } catch (error) {
      console.log("errorSend:" + error);
    }
  };

  const register = async (login: string, password: string) => {
    try {
      const senddd = await Gigya.register(login, password, { 'sessionExpiration': 0 });
      console.log("sendd: " + JSON.stringify(senddd));
      updateIsLoggedIn(Gigya.isLoggedIn())

    } catch (error) {
      console.log("register error:" + error);

      const e = error as GigyaError;
      switch (e.getInterruption()) {
        case GigyaInterruption.conflictingAccounts: {
          const resolver = Gigya.resolverFactory.getResolver<LinkAccountResolver>(e)

          console.log("link:")
          console.log(resolver.regToken)

          break
        }
      }

    }
  };

  const showScreenSet = () => {
    Gigya.showScreenSet("Default-RegistrationLogin", (event, data) => {
      console.log(`event: ${event}`);
      if (event == "onLogin") {
        updateIsLoggedIn(Gigya.isLoggedIn())
      }
    })
  };

  enum Method {
    init,
    login,
    register,
    social,
    logout,
    showScreenSet
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

    const dispose = () => {
      userData.login = ""
      userData.password = ""
    };


    var userData: user = {login: "", password: ""};

  return (
    <>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Login/Register</Dialog.Title>
        <Dialog.Input label="email" onChangeText={(email : string) => userData.login = email} />
        <Dialog.Input label="password" onChangeText={(pass : string) => userData.password = pass} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleLogin} />
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
