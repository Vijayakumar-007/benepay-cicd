import React, { Component, Fragment } from 'react';
import AppFooter from "./app-footer/app-footer";
import AppHeader from "./app-header/app-header";
import AppNavDrawer from "../$widgets/app-nav-drawer/app-nav-drawer";
import { StorageService, StorageKeys } from "../../service/core/storage.service";
import Action from "../../redux/action";
import { connect } from "react-redux";
// import {Route} from "../../app-router";
import { BrowserRouter, HashRouter as Router, Redirect, Route, Switch, Outlet } from "react-router-dom";
import { GuestRouter, AdminRouter } from "../../app-router";
import AuthService from "../../service/core/auth.service";
import { toast } from 'react-toastify';
import { Auth } from "aws-amplify";
import { Alert, AlertTitle } from '@material-ui/lab';
import { DashboardService } from 'service/api/dashboard.service';
import { Grid, Box, Stack, Typography } from '@mui/material';
import ConfirmDialog from 'components/$widgets/dialog';
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';
import { ButtonPrimary, ButtonSecondary } from 'components/$widgets/buttons/form-button';
import { style } from 'dom-helpers';

class AppFrame extends Component {

    background = "white";
    padding = "8px 24px";

    constructor(props) {
        super(props);

        this.state = {
            navbarToggle: true,
            sessionTime: null,
            userActive: false,
            merchantActive: "active",
            userPrivileges: {},
            showModal: false,
            countdown: 30,
        }
    }
    intervalId = null;
    countdownInterval = null;

    render() {
        const { match, device } = this.props;

        const setNavbarToggle = (val) => {
            this.setState({
                navbarToggle: val
            })
        }

        const setUserPrivileges = (val) => {
            this.setState({
                userPrivileges: val
            })
        }

        return (
            
            <>
                <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', margin: '0', padding: '0', background: '#F6F6F6' }}>

                    <AppNavDrawer navbarToggle={this.state.navbarToggle} setNavbarToggle={setNavbarToggle} setUserPrivileges={setUserPrivileges} />

                    <div id="mainOutletContainer" className='transition scrollbar-none' style={this.state.navbarToggle ? { width: `calc(100vw - 270px)`, maxWidth: '100%', height: '100vh', overflow: 'hidden', position: 'relative', margin: "0" } : { width: `calc(100vw - 64px)`, maxWidth: '100%', height: '100vh', overflow: 'hidden', position: 'relative', margin: "0" }}>
                        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '72px' }}>
                            <AppHeader userPrivileges={this.state.userPrivileges} />
                        </div>
                        <div id="outletContainer" className="" style={{ backgroundColor: 'var(--light-color)', width: '100%', height: `calc(100% - 72px)`, marginTop: '72px', overflowY: 'scroll', overflowX: 'hidden', padding: '0 16px' }}>
                            <main className={'app-container'} style={{ minHeight: '100%', marginTop: '16px', background: this.background, padding: this.padding }}>

                                {this.state.merchantActive == "inactive" && <Alert severity="warning">
                                    <AlertTitle>Warning</AlertTitle>
                                    The merchant not activated for this User. Please contact at benepay.io.
                                </Alert>}

                                <GuestRouter />
                                <AdminRouter />
                            </main>
                            <div style={{ marginTop: '16px' }}>
                                <AppFooter />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Session Expiration Modal */}
                
                <ConfirmDialog open={this.state.showModal}>
                    <Box sx={{ width: 400}}>
                        <Grid container spacing={{ xs: 2, md: 3 }}
                           >
                            <Grid xs={12} mt={1} paddingBottom={3}>
                                <Typography style={{ fontSize: '18px !important' }}>You have been inactive for a while. You will be logged out  automatically after <strong>{this.state.countdown} seconds</strong>.</Typography>
                                <Typography style={{ fontSize: '18px !important', marginTop: '1%' }}> To continue, please click "Cancel".</Typography>
                            </Grid>
                            <Grid container spacing={2} paddingLeft={5}>
                                <Grid item xs={6}>
                                    <ButtonSecondary width={100}  onClick={this.handleCancel}>Cancel</ButtonSecondary>
                                </Grid>
                                <Grid item xs={6}>
                                    <ButtonPrimary  width={100} onClick={this.handleOk}>Ok</ButtonPrimary>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </ConfirmDialog>
               
            </>
        );


    }
    handleOk = () => {
        console.log("OK button clicked. Signing out...");
        this.performSignOut(); // Call the sign-out logic
    };
    
    handleCancel = async () => {
        clearInterval(this.countdownInterval);
        await AuthService.refreshSessionToken();
        
        this.setState({ showModal: false, userActive: true });
    };
    
    performSignOut = async () => {
        console.log("inside the performSignOut");

        this.setState({ showModal: false });
        clearInterval(this.countdownInterval);
        await AuthService.signOut();
    };

    onWindowResize = () => {
        const device = {
            width: document.documentElement.clientWidth,
            scale: 0,
            breakpoint: 'xs'
        }
        if (device.width > 1024) {
            device.scale = 3;
            device.breakpoint = 'lg';
            this.props.dispatch({ type: Action.UpdateDevice, device });
        } else if (device.width > 720) {
            device.scale = 2;
            device.breakpoint = 'md';
            this.props.dispatch({ type: Action.UpdateDevice, device });
        } else if (device.width > 600) {
            device.scale = 1;
            device.breakpoint = 'sm';
            this.props.dispatch({ type: Action.UpdateDevice, device });
        } else {
            device.scale = 0;
            device.breakpoint = 'xs';
            this.props.dispatch({ type: Action.UpdateDevice, device });
        }
    };


    componentDidMount = async () => {
        try {
            await Auth.currentSession().then(res => {
                let jwt = res["idToken"]["jwtToken"]
                StorageService.set(StorageKeys.clientJwt, jwt);
            })

            this.onWindowResize();
            window.addEventListener('resize', this.onWindowResize);


            this.isMerchantActive();
            this.handleSession();
            this.detectEvents();
            this.checkIdle();
        } catch (error) {
            console.log("error", error);
        }
    }

    // method to watch the system is idle
    checkIdle = () => {
        if (typeof this.sessionIntervalId != "undefined") {
            clearInterval(this.sessionIntervalId);
        }

        this.sessionIntervalId = setInterval(() => {
            // checking the user made even in every 15 minutes
            // reset the user active flag
            this.setState({ userActive: false }, () => {

                // set timeout and force session out the user 
                setTimeout(() => {
                    if (!this.state.userActive) {
                        console.log("Session kicking out...");
                        // force sign-out for inactive session
                        // AuthService.signOut();

                        this.setState({ showModal: true, countdown: 30 });

                        // Start the countdown timer
                        this.countdownInterval = setInterval(() => {
                            this.setState((prevState) => {
                                if (prevState.countdown <= 5) {
                                    clearInterval(this.countdownInterval);
                                    clearInterval(this.sessionIntervalId);
                                    this.performSignOut();
                                }
                                return { countdown: prevState.countdown - 5 };
                            });
                        }, 5000);
                    }
                }, 5000);

            });
        }, 15 * 60000);
    }

    // method to check the system event is idle
    detectEvents = () => {

        // generic method for update the activity when events triggered
        const eventUpdate = () => {
            if( this.state.showModal ){
                return;
            }

            this.checkIdle();

            // set user active when event update
            if (!this.state.userActive) {
                this.setState({ userActive: true });
            }
        }

        // expected dom events to detect the event
        document.onmousemove = eventUpdate
        document.onkeydown = eventUpdate
    }

    handleSession = async () => {

        var sessionExpirationTime = await AuthService.getSessionTime();
        
        // Convert the expiration time to a JavaScript Date object
        var expirationDate = new Date(sessionExpirationTime * 1000);
        // var expirationDate = new Date();
        // expirationDate.setMinutes(expirationDate.getMinutes() + 2)
        // console.log("expirationDate",expirationDate);
        
        // session expiration will check in every 20 seconds
        this.intervalId = setInterval(async () => {
            var currentTime = new Date();

            var seconds = (expirationDate.getTime() - currentTime.getTime()) / 3000;

            // Check if the session is about to expire
            if (seconds < 30) {
                // clearInterval(this.intervalId);

                // referesh the session token        
                AuthService.refreshSessionToken();
                
                sessionExpirationTime = await AuthService.getSessionTime();

                // Convert the expiration time to a JavaScript Date object
                expirationDate = new Date(sessionExpirationTime * 1000);
            }
        }, 20000);
    }

    isMerchantActive = async () => {
        const response = await DashboardService.getUserInfo()
        if (response) {
            this.setState({ merchantActive: response?.activated ? "active" : "inactive" });
        }
    }

    componentWillUnmount() {
        // Clear the interval when the component is unmounted
        clearInterval(this.intervalId);
        clearInterval(this.sessionIntervalId);
    }

}




function mapStateToProps(state) {
    return {
        device: state.device,
    }
}

export default connect(mapStateToProps)(AppFrame);
