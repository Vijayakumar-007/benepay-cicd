import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { html } from "./app-header.html";
import { withSnackbar } from "notistack";
import { connect } from "react-redux";
import { StorageService, TempStorage, StorageKeys, USER_TYPE } from "../../../service/core/storage.service";
import AuthService from "../../../service/core/auth.service";
import Action from "../../../redux/action";
import { DashboardService } from "../../../service/api/dashboard.service";
import { Auth } from '@aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import Validator from 'service/core/validator';
import { PrivilegeConstants } from 'config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faArrowRightFromBracket, faAddressCard} from '@fortawesome/free-solid-svg-icons'



class AppHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beneficiaryName: '',
            drawerOpen: false,
            logoUrl: '',
            merchantName: '',
            activeMenu: 'transaction',
            anchorElUser: false,
            anchorElNav: false,
            anchorElViewDetails: '',
            email:'',
            merchantsList: "",
            selectedMerchant: "",
            merchantId: "",
            loginFunctionItems: [
                {
                    text: 'Profile',
                    icon: faAddressCard,
                    onClick: () => this.navigateToProfile(),
                    isVisible: true
                },
                {
                  text: 'Change Password',
                  icon: faKey,
                  onClick: () => this.navigateToChangePassword(),
                  isVisible: true
                },
                {
                  text: 'Sign Out',
                  icon: faArrowRightFromBracket,
                  onClick: () => this.signOut(),
                  isVisible: true
                },
              ]
        }
    }

    toggleDrawer = () => {
        this.setState((state) => {
            return {
                drawerOpen: !state.drawerOpen
            }
        })
    }

    getMerchantName = (merchantName) => {

    }

    handleLogout = () => {
        StorageService.clearAll();
        TempStorage.loggedInUser = {};
        TempStorage.authToken = '';
        this.props.history.push('/guest-login')
    };

    getUserInfo = async () => {
        const response = await DashboardService.getUserInfo()
        if (!response) {
            return
        }       
        
        this.setState({ logoUrl: response?.logo, merchantName: response?.merchantName ,email:response?.email });
        StorageService.set(StorageKeys.merachantActive, response?.activated);
        StorageService.set(StorageKeys.loggedInMerchantID, response?.merchantId);
        StorageService.set(StorageKeys.partialPaymentAllowedForMerchant, response?.allowPartialPayments);
    }

    onExit = () => {
        if (this.props.location.pathname === '/guest/beneficiary-details' || this.props.location.pathname === '/guest/claim-summary') {
            new Action(this).emitCommonEvent();
        } else {
            this.handleLogout();
        }
    };

    signOut = async () => {
        try {
            await AuthService.signOut(false);
        } catch (error) {  
            toast("Something went wrong, please try again later", {
                position: toast.POSITION.BOTTOM_CENTER,
                className: "toast-message toast-error",
            });
            // console.log('error signing out: ', error);
        }
    }

    handleNavigateToNewPayment = (route) => {
        this.setState({activeMenu: 'Create Payment'});    
        this.props.history.push('/new-payment');
        this.setState((state) => {
            return {
                drawerOpen: !state.drawerOpen
            }
        });
    }
    handleNavigate = () => {
        this.setState({activeMenu: 'transaction'})    
        this.props.history.push('/transactions');
        this.setState((state) => {
            return {
                drawerOpen: !state.drawerOpen
            }
        });
    };

    handleDashboardNavigate = () => {
        this.setState({activeMenu: 'Dashboard'});    
        this.props.history.push('/dashboard');
        this.setState((state) => {
            return {
                drawerOpen: !state.drawerOpen
            }
        });
    }

    decideNavigationForPayment() {
        this.props.history.push('/home')

    }

    async componentDidMount() {
        
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"]
            StorageService.set(StorageKeys.clientJwt, jwt);
        })
        this.getUserInfo()

        if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
            const response = await DashboardService.getMerchantSummaryList();
            console.log("merchant summary respomse", response)
            const addOption = { merchantId: "All", merchantName: "All", activeStatus: 1 };
            response.merchantSummary = [addOption, ...response.merchantSummary]; //Add a All option in merchants array

            if (Object.keys(response).length !== 0) {
                this.setState({ merchantsList: response.merchantSummary.filter(merchant => merchant.activeStatus === 1) });
            }

            const storedMerchantId = StorageService.get(StorageKeys.selectedMerchantId);
            if (storedMerchantId !== "All") {
                StorageService.set(StorageKeys.selectedMerchantId, "All");
                StorageService.set(StorageKeys.merchantId, "All");
            }
        }
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.userPrivileges !== this.props.userPrivileges) {
            this.setState({ userPrivileges: this.props.userPrivileges, loginFunctionItems: [
                {
                    text: 'Profile',
                    icon: faAddressCard,
                    onClick: () => this.navigateToProfile(),
                    isVisible: true
                },
                {
                  text: 'Change Password',
                  icon: faKey,
                  onClick: () => this.navigateToChangePassword(),
                  isVisible: this.props.userPrivileges[PrivilegeConstants.CHANGE_PASSWORD_SCREEN]
                },
                {
                  text: 'Sign Out',
                  icon: faArrowRightFromBracket,
                  onClick: () => this.signOut(),
                  isVisible: true
                },
              ] });
        }
    }

    handleViewDetails = (event) => {
        this.setState({
            anchorElViewDetails: true
        })
    };

    handleCloseViewDetails = () => {
        this.setState({
            anchorElViewDetails: false
        })
    };

    handleOpenUserMenu = () => {
        this.setState({
            anchorElUser: true
        })
    };

    handleOpenNavMenu = (event) => {
        this.setState({
            anchorElNav: true
        })
    };

    handleCloseNavMenu = () => {
        this.setState({
            anchorElNav: false
        })
    };

    handleCloseUserMenu = () => {
        this.setState({
            anchorElUser: false
        })
    };

    navigateToChangePassword = async () => {
        // console.log('navigateToChangePassword')
        const { history } = this.props;
        history.push('/changepassword');
    };

    navigateToProfile = async () => {
        // console.log('navigateToProfile')
        const { history } = this.props;
        history.push('/profile');
    };

    getMerchantId = (e, v) => {
        if (Validator.isNotEmpty(v) && Validator.isNotEmpty(v.merchantId)) {
            this.setState({
                merchantId: v.merchantId,
                selectedMerchant: v.merchantName,
            });
            StorageService.set(StorageKeys.merchantId, v.merchantId);
            StorageService.set(StorageKeys.selectedMerchantId, v.merchantName);
        }

        if (v == null) {
            this.setState({ selectedMerchant: null, merchantId: null });
        }
    };

    // componentDidMount = async () => {
    //     console.log("IN here", this.props);
    // }

    render = () => html.apply(this);
    
}

function mapStateToProps(state) {
    return {
        commonEvent: state.commonEvent,
        device: state.device,
    }

}


export default connect(mapStateToProps)(withRouter(withSnackbar(AppHeader)));
