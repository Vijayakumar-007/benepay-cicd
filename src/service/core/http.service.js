import axios from 'axios';
import {baseUrl} from "../../config/urlConfig";
import {toast} from 'react-toastify'
import {StorageKeys, StorageService} from "../core/storage.service";
import AuthService from './auth.service';


export const HTTP = axios.create({
    baseURL: baseUrl,
    headers: { 'accept': 'application/json' }
});

HTTP.interceptors.response.use(undefined, (error) => {
        if (error.message === 'Network Error' && !error.response) {
            console.error(error.message);
            return false;
            // toast.error('Something went wrong, Please try again later');
        }
        
        
        const {status} = error.response;

        if (status === 401) {
            AuthService.signOut(false);

            return false;
        }

        if (status === 403) {
            return toast.error('Access is denied');
        }
        
        if (status === 404) {
            return toast.error('404 Not Found');
        }

        if (status === 500) {

            console.error('Server Error, Please try again in some time');
            if(error && error.response && error.response.data["Error Message"] && error.response.data["Error Message"] == "Access is denied"){
                toast.error('Access is denied');
            }
            return false;
            // return toast.error('Server Error, Please try again in some time');
        }
    }
);


HTTP.interceptors.request.use(request => {
    request.headers['Authorization'] = "Bearer " + StorageService.get(StorageKeys.clientJwt);
    return request;
 });