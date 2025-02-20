import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import BackupIcon from '@material-ui/icons/BackupOutlined';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { useHistory } from "react-router-dom";
import PaymentIcon from '@material-ui/icons/Payment';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { GuestRouter } from '../../../app-router';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import './app-nav-drawer.scss'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import { StorageKeys, StorageService, TempStorage, USER_TYPE } from "../../../service/core/storage.service";
import AccountBalance from '@material-ui/icons/AccountBalance';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LockResetIcon from '@mui/icons-material/LockReset';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { data } from 'jquery';

// Icons

// import {ReactComponent as MenuIcon2} from '../../../assets/icons/menu.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import benepayFavicon from "../../../assets/images/FavIcon-benepay.png";
import { faChartPie, faCreditCard, faFileImport, faReceipt, faUserGroup, faFile, faFolderOpen, faBuildingColumns, faUserTie, faKey, faArrowRightFromBracket, faBars, faTowerBroadcast, faUser, faSquarePlus, faGear, faUserLock, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from 'service/api/dashboard.service';
import Loader from '../loader';
import AuthService from 'service/core/auth.service';
import { PrivilegeConstants } from 'config/constants';

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    position: 'relative',
    height: '90vh',
    background: '#fafafa',
    marginTop: '15px'
  },
  content: {
    flexGrow: 1,
    padding: '0 24px',
  },
}));

function ResponsiveDrawer(props) {
  const { window, navbarToggle, setNavbarToggle } = props;
  const [toggleNavbar, setToggleNavbar] = useState(navbarToggle);
  // const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menu, setMenu] = useState('Dashboard');
  const [drawerWidth, setDrawerWidth] = useState(270);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    logoUrl: '',
    merchantName: '',
    email: '',
    merchantType:''
  });

  const getUserInfo = async () => {
    try {
      setLoading(true);

      await Auth.currentSession().then((res) => {
        let jwt = res["idToken"]["jwtToken"];
        StorageService.set(StorageKeys.clientJwt, jwt);
        setPrivileges();
      });
      const response = await DashboardService.getUserInfo();
      if (!response) {
        return;
      }
      setUserInfo({
        logoUrl: response.logo,
        merchantName: response.merchantName,
        email: response.email,
        merchantType: response.merchantType,
        payViaScreen: response.payViaScreen

      });

      StorageService.set(StorageKeys.autoReqTrans, response.autoReqTransaction);
      StorageService.set(StorageKeys.merchantTxnMode, response.merchantTxnMode);
      StorageService.set(StorageKeys.merchantName, response.merchantName);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    getUserInfo();
    if (location.pathname.includes('dashboard')) {
      setMenu('Dashboard')
      return
    }

    if (location.pathname.includes('broadcasts')) {
      setMenu('Broadcasts')
      return;
    }

    if (location.pathname.includes('merchants')) {
      setMenu('Merchant Summary')
      return;
    }
    if (location.pathname.includes('file-upload')) {
      setMenu('Upload')
      return;
    }
    if (location.pathname.includes('firc-upload')) {
      setMenu('FIRC')
      return;
    }
    if (location.pathname.includes('merchant-profile')) {
      setMenu('Profile')
      return
    }
    if (location.pathname.includes('home')) {
      setMenu('Dashboard')
      return
    }
    if (location.pathname.includes('Users')) {
      setMenu('Users')
      return
    }
    if (location.pathname.includes('upload-settlement')) {
      setMenu('Settlement')
      return
    }
    if (location.pathname.includes('reports')) {
      setMenu('Reports')
      return
    }
    if (location.pathname.includes('changepassword')) {
      setMenu('Change Password')
      return
    }
    if (location.pathname.includes('broadcasts')) {
      setMenu('Broadcasts')
      return
    } 
    if (location.pathname.includes('trace-details')) {
      setMenu('Trace Details')
      return;
    }

    if (location.pathname.includes('transaction-snapshot')) {
      setMenu('Transactions Snapshot')
      return;
    }

    if (location.pathname.includes('settings')) {
      setMenu('Settings')
      return;
    }
    
    if (location.pathname.includes('payment-relation')) {
      setMenu('Payment Relations')
      return;
    }
   
  },[location.pathname])

  const signOut = async () => {
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

  const redirectToRequestedPage = (path, isSettlementRequested, selectedMenu) => {
    setMenu(selectedMenu)
    if (isSettlementRequested) {
      history.push({ pathname: path, state: { isSettlementRequested: true } })
      return;
    }
    history.push(path)
  }

  const merchantItems = [
    {
      text: 'Dashboard',
      icon: faChartPie,
      onClick: () => redirectToRequestedPage("/dashboard", false, 'Dashboard'),
      isVisible: true
    },
    {
      text: 'Transactions',
      icon: faCreditCard,
      onClick: () => redirectToRequestedPage("/transactions", false, 'Transactions'),
      isVisible: true
    },
    {
      text: 'Create',
      icon: faCreditCard,
      onClick: () => redirectToRequestedPage("/singlePayment", false, 'Create')
    },
    {
      text: 'Upload',
      icon: faFileImport,
      onClick: () => redirectToRequestedPage("/file-upload", false, 'Upload'),
      isVisible: true
    },
    // {
    //   text: 'Invoice',
    //   icon: faReceipt,
    //   onClick: () => redirectToRequestedPage("/invoice", false, 'Invoice'),
    // },
    {
      text: 'Profile',
      icon: faUser,
      onClick: () => redirectToRequestedPage("/merchant-profile", false, 'Profile'),
      isVisible: true
    },
    // {
    //   text: 'Users',
    //   icon: faUserGroup,
    //   onClick: () => redirectToRequestedPage("/users", false, 'Users'),
    // },
    {
      text: 'Reports',
      icon: faFile,
      onClick: () => redirectToRequestedPage("/reports", false, 'Reports'),
      isVisible: true
    },
    // {
    //   text: 'Templates',
    //   icon: faFolderOpen,
    //   onClick: () => redirectToRequestedPage("/templates", false, 'Templates')
    // }
  ];

  const loginFunctionItems = [
    {
      text: 'Change Password',
      icon: faKey,
      onClick: () => redirectToRequestedPage("/changepassword", false, 'Change Password'),
      isVisible: true
    },
    {
      text: 'Sign Out',
      icon: faArrowRightFromBracket,
      onClick: () => signOut(),
      isVisible: true
    },
  ]

  const benePayUserItems = [
    {
      text: 'Broadcasts',
      icon: faTowerBroadcast,
      onClick: () => redirectToRequestedPage("/broadcasts", false, 'Broadcasts'),
      isVisible: true
    },
    {
      text: 'Settlement',
      icon: faBuildingColumns,
      onClick: () => redirectToRequestedPage("/upload-settlement", false, 'Settlement'),
      isVisible: true
    },
    {
      text: 'Merchant Summary',
      icon: faUserTie,
      onClick: () => redirectToRequestedPage("/merchants", false, 'Merchant'),
      isVisible: true
    },
    {
      text: 'Trace Details',
      icon: faUserTie,
      onClick: () => redirectToRequestedPage("/trace-details", false, 'trace-details'),
      isVisible: true
    },
    {
      text: 'Transactions Snapshot',
      icon: faReceipt,
      onClick: () => redirectToRequestedPage("/snapshot/transactions", false, 'transaction-snapshot'),
      isVisible: true
    },
    {
      text: 'Payment Relations',
      icon: faUserTie,
      onClick: () => redirectToRequestedPage("/payment-relation", true, 'payment-relation'),
      isVisible: true
    }
    
  ];

  let menuItems = [];

  const isAdminUser = TempStorage.loginUserRole === USER_TYPE.ADMIN_USER;

  // Add loginFunctionItems for all users
  // menuItems = menuItems.concat(loginFunctionItems);


  const drawer = (
    <div>
      <List>
        {menuItems.map(({ text, icon: Icon, onClick, isVisible }, index) => (
              <ListItem button key={text} onClick={onClick}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} style={{ color: menu === text && '#346799' }} />
              </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const toggleNav = () => {
    // console.log("In here for test", navbarToggle);
    let val = !props.navbarToggle;
    // props.navbarToggle = !props.navbarToggle;
    setToggleNavbar(!toggleNavbar);
    setNavbarToggle(val);

    // console.log("In here for test2", navbarToggle);
  }

  const [selectedMerchantMenu, setSelectedMerchantMenu] = useState(merchantItems);
  const [selectedLoginMenu, setSelectedLoginMenu] = useState(loginFunctionItems);
  const [selectedAdminMenu, setSelectedAdminMenu] = useState(benePayUserItems);

  const setPrivileges = async () => {
    try {
      console.log("Priviles Set Successfully");
      
      let result = await DashboardService.getPrivileges();

      if(result){
        TempStorage.userPrivilege = result;
        console.log("RES", result, );
        
        StorageService.set(StorageKeys.privilege, result);
        

        if (location.pathname.includes('dashboard') && !result[[PrivilegeConstants.DASHBOARD_SCREEN]]) {
          if(!result[PrivilegeConstants.TRANSACTION_SEARCH] && !result[PrivilegeConstants.REFUND_SEARCH]){
            redirectToRequestedPage("/merchant-profile", false, 'Profile')
          }else{
            redirectToRequestedPage("/transactions", false, 'Transactions')
          }
        }

        setSelectedAdminMenu([
          {
            text: 'FIRC',
            icon: faFileUpload,
            onClick: () => redirectToRequestedPage("/firc-upload", false, 'FIRC'),
            isVisible: result[PrivilegeConstants.FIRC_FILE_UPLOAD]
          },
          {
            text: 'Broadcasts',
            icon: faTowerBroadcast,
            onClick: () => redirectToRequestedPage("/broadcasts", false, 'Broadcasts'),
            isVisible: true
          },
          {
            text: 'Settlement',
            icon: faBuildingColumns,
            onClick: () => redirectToRequestedPage("/upload-settlement", false, 'Settlement'),
            isVisible: result[PrivilegeConstants.SETTLEMENT_REPORT_GENERATED_BY_BENEPAY] || result[PrivilegeConstants.SETTLEMENT_REPORT_FROM_PROVIDER] || result[PrivilegeConstants.UPLOAD_SETTLEMENT_REPORT]
          },
          {
            text: 'Merchant Summary',
            icon: faUserTie,
            onClick: () => redirectToRequestedPage("/merchants", false, 'Merchant'),
            isVisible: true
          },
          {
            text: 'Trace Details',
            icon: faUserTie,
            onClick: () => redirectToRequestedPage("/trace-details", false, 'trace-details'),
            isVisible: result[PrivilegeConstants.TRACE_ENTRY_SCREEN]
          },
          {
            text: 'Transactions Snapshot',
            icon: faReceipt,
            onClick: () => redirectToRequestedPage("/snapshot/transactions", false, 'transaction-snapshot'),
            isVisible: result[PrivilegeConstants.TRANSACTION_SNAPSHOT]
          },
          {
            text: 'Payment Relations',
            icon: faUserTie,
            onClick: () => redirectToRequestedPage("/payment-relation", true, 'payment-relation'),
            isVisible: true
          },
          {
            text: 'Settings',
            icon: faGear,
            onClick: () => redirectToRequestedPage("/settings", false, 'Settings'),
            isVisible: result[PrivilegeConstants.SETTINGS_MENU]
          }
       
        ]);

        setSelectedLoginMenu([
          {
            text: 'Change Password',
            icon: faKey,
            onClick: () => redirectToRequestedPage("/changepassword", false, 'Change Password'),
            isVisible: result[PrivilegeConstants.CHANGE_PASSWORD_SCREEN]
          },
          {
            text: 'Sign Out',
            icon: faArrowRightFromBracket,
            onClick: () => signOut(),
            isVisible: true
          },
        ]);

        setSelectedMerchantMenu([
          {
            text: 'Dashboard',
            icon: faChartPie,
            onClick: () => redirectToRequestedPage("/dashboard", false, 'Dashboard'),
            isVisible: result[PrivilegeConstants.DASHBOARD_SCREEN]
          },
          {
            text: 'Transactions',
            icon: faCreditCard,
            onClick: () => redirectToRequestedPage("/transactions", false, 'Transactions'),
            isVisible: result[PrivilegeConstants.TRANSACTION_SEARCH] || result[PrivilegeConstants.REFUND_SEARCH]
          },
          {
            text: 'Create',
            icon: faSquarePlus,
            onClick: () => redirectToRequestedPage("/singlePayment", false, 'Create'),
            isVisible:  result[PrivilegeConstants.CREATE_PAYMENT]
          },
          {
            text: 'Upload',
            icon: faFileImport,
            onClick: () => redirectToRequestedPage("/file-upload", false, 'Upload'),
            isVisible: result[PrivilegeConstants.PAYMENT_FILE_UPLOAD] || result[PrivilegeConstants.REFUND_FILE_UPLOAD]
          },
          {
            text: 'Profile',
            icon: faUser,
            onClick: () => redirectToRequestedPage("/merchant-profile", false, 'Profile'),
            isVisible: true
          },
          {
            text: 'Reports',
            icon: faFile,
            onClick: () => redirectToRequestedPage("/reports", false, 'Reports'),
            isVisible: result[PrivilegeConstants.SETTLEMENT_SEARCH_REPORT]
          },
        ]);
        
        props.setUserPrivileges(result);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <div id="sideNavbar" style={{background: 'white', borderRight: '1px solid #AECDF4'}}>
      <CssBaseline />
      <nav aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden> */}
        <Hidden xsDown implementation="css">
          {/* <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer> */}
          <div className='transition' style={navbarToggle ? {width: '270px', height: '100vh', display: "flex", flexDirection: 'column', justifyContent:'space-between', padding: '0 1rem'} : {width: '64px', height: '100vh', display: "flex", flexDirection: 'column', justifyContent:'space-between', padding: '0 1rem'}}>
            <div>
              <div style={{height: '72px', minWidth:"64px", overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', marginRight: '1rem', cursor: 'pointer'}}>
                  <FontAwesomeIcon icon={faBars} color='var(--primary-color)' style={{ aspectRatio: 'auto', height: 'var(--icons-size-xs-standard)'}} onClick={toggleNav} />
                </div>
                {navbarToggle && <img src={benepayFavicon} alt='Benepay' />}
              </div>
              <div>
              {selectedMerchantMenu.length > 0 && <>
                  <ul  style={{textDecoration: "none", padding: '0'}}>
                    {selectedMerchantMenu.map(({ text, icon, onClick, isVisible }, index) => {
                      return (
                        isVisible && 
                      <>
                          {userInfo.merchantType == 4 && (text == "Upload" || text == "Reports") || !userInfo.payViaScreen && (text == "Create") ? <> </> :  
                        <li key={`MenuItem${index}`} onClick={onClick} className={navbarToggle? `` : `items-center`} style={{display: 'flex', alignItems: 'center', height: 'var(--gap)', minWidth: '64px', margin: '12px 0', cursor: 'pointer', overflow: 'hidden'}}>
                          {/* <div style={{fill: 'white', color: 'white'}}><Icon /></div> */}
                          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: 'var(--height-menu)', marginRight: '1rem'}}>
                            <FontAwesomeIcon icon={icon} color={menu === text ? 'var(--secondary-color)': "var(--primary-color)" } style={menu === text ? { aspectRatio: 'auto', height: 'var(--icons-size-standard)'} : { aspectRatio: 'auto', height: 'var(--icons-size-standard)'}} />
                          </div>
                          {navbarToggle && 
                            <h4 style={menu === text ? {fontSize: 'var(--font-large)', color: "var(--secondary-color)", fontWeight: 'medium', marginTop: '10px'} : {fontSize: 'var(--font-large)', color: "var(--primary-color)", fontWeight: 'normal', marginTop: '10px'}}>{text}</h4>
                          }
                        </li>
                        }
                      </>
                      );
                    })}
                  </ul>
                </>}
                {selectedAdminMenu.length > 0 && isAdminUser && <>
                  <ul style={{textDecoration: "none", borderBottom: '1px solid #B4D2FA', padding: '0'}}>
                    {selectedAdminMenu.map(({ text, icon, onClick, isVisible }, index)=> {
                      return (
                        isVisible && 
                      <>
                        <li key={`AdminItem${index}`} onClick={onClick} style={{display: 'flex', alignItems: 'center', height: 'var(--gap)', margin: '12px 0', cursor: 'pointer'}}>
                          {/* <div style={{fill: 'white', color: 'white'}}><Icon /></div> */}
                          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: 'var(--height-menu)', marginRight: '1rem'}}>
                            <FontAwesomeIcon icon={icon} color={menu === text ? 'var(--secondary-color)': "var(--primary-color)" } style={menu === text ? { aspectRatio: 'auto', height: 'var(--icons-size-standard)'} : { aspectRatio: 'auto', height: 'var(--icons-size-xs-standard)'}} />
                          </div>
                          {navbarToggle && 
                            <h4 style={menu === text ? {fontSize: 'var(--font-x-large)', color: "var(--secondary-color)", fontWeight: 'medium', marginTop: '10px'} : {fontSize: 'var(--font-large)', color: "var(--primary-color)", fontWeight: 'normal', marginTop: '10px'}}>{text}</h4>
                          }
                        </li>
                      </>
                      );
                    })}
                  </ul>
                </>}
              </div>
            </div>
            <div>
              {selectedLoginMenu.length > 0 && <>
                <ul style={{textDecoration: "none" , padding: '0'}}>
                  {selectedLoginMenu.map(({ text, icon, onClick, isVisible }, index)=> {
                    return (
                      isVisible && 
                    <>
                      <li key={`Login${index}`} onClick={onClick} style={{display: 'flex', alignItems: 'center', height: 'var(--gap)', margin: '12px 0', cursor: 'pointer'}}>
                        {/* <div style={{fill: 'white', color: 'white'}}><Icon /></div> */}
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: 'var(--height-menu)', marginRight: '1rem'}}>
                          <FontAwesomeIcon icon={icon} color={menu === text ? 'var(--secondary-color)': "var(--primary-color)" } style={menu === text ? { aspectRatio: 'auto', height: '24px'} : { aspectRatio: 'auto', height: 'var(--icons-size-xs-standard)'}} />
                        </div>
                        {navbarToggle && 
                          <h4 style={menu === text ? {fontSize: 'var(--font-x-large)', color: "var(--secondary-color)", fontWeight: 'medium', marginTop: '10px'} : {fontSize: 'var(--font-large)', color: "var(--primary-color)", fontWeight: 'normal', marginTop: '10px'}}>{text}</h4>
                        }
                      </li>
                    </>
                    );
                  })}
                </ul>
              </>}
            </div>
          </div>
        </Hidden>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
