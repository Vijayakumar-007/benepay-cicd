import {
  Button,
  Heading,
  Image,
  Text,
  View,
  useAuthenticator,
  useTheme,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "font-awesome/css/font-awesome.min.css";
import { SnackbarProvider } from "notistack";
import React, {useEffect} from "react";
import CacheBuster from "react-cache-buster";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStore } from "redux";
import AppRouter from "../../app-router";
import logo from "../../assets/images/benepay-transperent.png";
import { config } from "../../config/config";
import "../../i18n";
import FrameReducer from "../../redux/reducer/frame.reducer";
import {
  StorageKeys,
  StorageService,
  TempStorage,
  USER_TYPE,
} from "../../service/core/storage.service";
import Utils from "../../service/core/utils";
import "./root.scss";
import { version } from '../../../package.json';
import { DashboardService } from "service/api/dashboard.service";
import { MerchantSelectionProvider } from "provider/merchantSelectionProvider";
import AuthService from "service/core/auth.service";
import { toast } from 'react-toastify';
// import { useClearCache } from 'react-clear-cache';

const store = createStore(FrameReducer);

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image alt="Bernepay logo" src={logo} width="100%" />
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={`${tokens.colors.neutral["80"]}`}>
          Copyright © {new Date().getFullYear()} BenePay Ltd. All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <>
          <Heading
            level={3}
            style={{textAlign:'center', marginTop:'4%'}}
          >
            Welcome Back!
          </Heading>
          
          <Heading
            level={5}
            style={{textAlign:'center', marginTop:'4%'}}
          >
            Sign in to continue
        </Heading>
      </>
      );
    },
    Footer() {
      const { toResetPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toResetPassword}
            size="small"
            variation="link"
            style={{marginBottom:"5%"}}
          >
            Forgot Password ?
          </Button>
        </View>
      );
    },
  },
};

function Root({ user }) {
  setInitialData(user);

  useEffect(() => {
    const validateUser = async (user) => {
      var token = user.signInUserSession.idToken.jwtToken;

      StorageService.set(StorageKeys.clientJwt, token);

      // Check if the user is activated
      const merchant = await DashboardService.getUserInfo();

      if (!merchant.activated) {
        toast.warning("Your account is inactive. You will be logged out shortly.", {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            onClose: async () => {
              StorageService.delete(StorageKeys.clientJwt);
              await AuthService.signOut(false);
            }
        });
        
      }
    };

    if (user) {
      validateUser(user);
    }
  }, [user]);

  console.log("app version", Utils.getVersion());
  return (
    <Provider store={store}>
      <React.Suspense fallback={<div>loading...</div>}>
        <SnackbarProvider maxSnack={3}>
          {/* <Authenticator components={components}> */}
          {/* <div> */}
          {/* <p>user looged in</p> */}
          {/* </div> */}
          <CacheBuster
            currentVersion={version}
            isEnabled={true}
            isVerboseMode={true} //If true, the library writes verbose logs to console.
            metaFileDirectory={"."} //If public assets are hosted somewhere other than root on your server.
          >
            <MerchantSelectionProvider>
            <AppRouter />
            </MerchantSelectionProvider>
          </CacheBuster>
          {/* </Authenticator> */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
          />
        </SnackbarProvider>
      </React.Suspense>
    </Provider>
  );
}

function setInitialData(user) {

    if (config.isLocal) {
        TempStorage.loggedInUser = StorageService.getObj(StorageKeys.user) || {};
        TempStorage.authToken = StorageService.get(StorageKeys.clientJwt) || '';
    }

    let role = '';
    // if(user.signInUserSession.accessToken.payload["cognito:groups"]){
    //   role = user.signInUserSession.accessToken.payload["cognito:groups"][0];
    // }

    // if(role === "admin"){
    //     TempStorage.loginUserRole = USER_TYPE.ADMIN_USER;
    // }
    // else{
    //     TempStorage.loginUserRole = null;
    // }

    if(user.signInUserSession.idToken.payload["custom:customer_id"]){
      role = user.signInUserSession.idToken.payload["custom:customer_id"];
    }

    if(role.toUpperCase() === "BENEPAY-ADMIN"){
      TempStorage.loginUserRole = USER_TYPE.ADMIN_USER;
    }
    else{
      TempStorage.loginUserRole = null;
    }

    StorageService.set(StorageKeys.userEmail, user.attributes.email)

}

export default withAuthenticator(Root, {
  components,
});
