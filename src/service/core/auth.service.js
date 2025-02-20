import { StorageKeys, StorageService, TempStorage } from "./storage.service";
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

export default class AuthService {
    static isUserLoggedIn() {
        const user = TempStorage.loggedInUser;
        const authToken = TempStorage.authToken;
        // return Boolean(user) && Boolean(authToken);
        return true;
    }

    static getUser() {
        return StorageService.getObj(StorageKeys.user) || {}
    }

    static getSessionTime = async () => {
        try {
            // Get the current active user session
            const session = await Auth.currentSession();
            const sessionExpirationTime = session.getIdToken().payload.exp;
            
            return sessionExpirationTime;
        } catch (error) {
            console.error('Error checking session time:', error);
        }

        return false;
    };

    static refreshSessionToken = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const currentSession = await Auth.currentSession();

        user.refreshSession(currentSession.refreshToken, (err, session) => {
            StorageService.set(StorageKeys.clientJwt, session.getIdToken().getJwtToken())
        });
    }

    static signOut = async (showMessage = true) => {
        try {
            StorageService.clearAll();
            StorageService.clearAllLocalStorage();
            StorageService.clearAllTempStorage();

            console.log("session out initiated...");
            
            if (showMessage) {
                toast.info("Session has expired. Please log in again.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    onClose: async () => {
                        await Auth.signOut()
                    },
                });
            } else {
                await Auth.signOut();
            }

            console.log("User session out successfully...")
        } catch (error) {
            if (showMessage) {
                toast.error("Something went wrong, please try again later", {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false
                });
            }
        }
    }
}