import React, {Component, Fragment} from 'react';
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from "react-router-dom";
import Home from './components/home/home'
import AppFrame from "./components/app-frame/app-frame";
import fileUpload from './components/file-upload/file-upload';
import Reports from './components/reports/reports';
import { USER_TYPE } from '../src/service/core/storage.service';
import {TempStorage} from "../src/service/core/storage.service";
import UploadSettlement from "./components/admin/upload-settlement/upload-settlement";
import Merchant from './components/admin/merchants/merchant';
import ChangePasswordForm from './components/admin/change-password/password-change';
import SinglePayment from "./components/customer/payments/single-payment";
import Broadcasts from "./components/admin/broadcast/broadcasts";
import MerchantDashboard from './components/dashboard/merchant-dashboard';
import MerchantProfile from './components/dashboard/merchant-profile/merchant-profile';
import Onboarding from './components/admin/onboarding/onboarding';
import FIRCUpload from 'components/admin/firc-upload/firc-upload';
import TraceDetails from './components/admin/TraceEntryDetails/traceEntry';
import SnapshotDataPage from './components/admin/snapshots/snapshot-data-page';
import Settings from 'components/admin/settings/index';
import paymentRelation from './components/admin/payment-relation/payment-relation';


export default class AppRouter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' component={MerchantDashboard}/>
                <Route path='/' component={AppFrame}/>
            </BrowserRouter>
        );
    }
};

export const GuestRouter = () => {
    return (
        <>
            <Route exact path={`/`}>
                <Redirect to={`/dashboard`}/>
            </Route>

            <Route exact path='/transactions' component={Home}/>
            <Route exact path='/dashboard' component={MerchantDashboard}/>
            <Route exact path='/file-upload' component={fileUpload}/>
            <Route exact path='/reports' component={Reports}/>
            <Route exact path='/singlePayment' component={SinglePayment}/>
            <Route exact path='/changepassword' component={ChangePasswordForm}/>
            <Route exact path={'/new-payment'} component={SinglePayment}/>
            <Route exact path={'/merchant-profile'} component={MerchantProfile}/>

            <Route exact path={'/invoice'}>
                <Redirect to={`/transactions`}/>
            </Route>
            <Route exact path={'/templates'}>
                <Redirect to={`/transactions`}/>
            </Route>
            <Route exact path={'/users'}>
                <Redirect to={`/transactions`}/>
            </Route>
            <Route exact path={'/profile'}>
                <Redirect to={`/merchant-profile`}/>
            </Route>
            <Route exact path={`*`}>
                <Redirect to={`/dashboard`}/>
            </Route>
        </>
    );
};

export const AdminRouter= () => {
    return (
        <>
            <AdminUser>
                <Route exact path='/merchants' component={Merchant}/>
                <Route exact path='/upload-settlement' component={UploadSettlement}/>
                <Route exact path={'/broadcasts'} component={Broadcasts}/>
                <Route exact path={'/onboarding'} component={Onboarding}/>
                <Route exact path={'/onboarding/:merchantId'} component={Onboarding}/>
                <Route exact path={'/firc-upload'} component={FIRCUpload}/>
                <Route exact path={'/trace-details'} component={TraceDetails}/>
                <Route exact path={'/settings'} component={Settings}/>
                <Route exact path={'/snapshot/transactions'} component={SnapshotDataPage}/>
                <Route exact path={'/payment-relation'} component={paymentRelation}/>
            </AdminUser>
        </>
    );
};

function AdminUser({children}){
    if(TempStorage.loginUserRole === USER_TYPE.ADMIN_USER){
        return <>{children}</>;
    }else{
        return <></>;
    }
}
