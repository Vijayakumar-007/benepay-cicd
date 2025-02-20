import {StorageKeys, StorageService} from "../service/core/storage.service";
import {Environment} from "../enum/common.enum";

export class config {

    static env = process.env.REACT_APP_ENVIRONMENT;

    static version = {
        majorRevision: 4,  // (new UI, lots of new features, conceptual change, etc.)
        minorRevision: 0,  // (maybe a change to a search box, 1 feature added, collection of bug fixes)
        bugFixes: 3,  // (Only bug fixes not new feature)
    };

    static get axios() {
        return {
            headers: {
                token: StorageService.get(StorageKeys.token)
            }
        }
    };

    static snackbarConfig = (type = 'info') => {
        return {
            variant: type,
            anchorOrigin: {vertical: 'top', horizontal: 'right'},
            persistent: true,
            // iconVariant: type
        }
    };

    static loginErrorMessage = {
        lessThanEqualToThree: "The information you have entered is incorrect, please check and try again.",
        equalToFour: "The information you have entered is incorrect. This is your last attempt, if you enter it wrong again, your details will be blocked",
        equalToFive: "You have entered incorrect information and for security reasons we blocked your details. Please try again after 24 hours",
        greaterThanEqualToSix: `This claim(s) is blocked until ${new Date(new Date().getTime() - (24 * 60 * 60 * 1000))}. Please try again later`
    }

    static get isLocal() {
        if (window.location.hostname === 'localhost') {
            return true;
        }
        return false;
    }
}
