import React, { Component } from 'react';
import { html } from './merchant.html'; // Importing HTML template
import { toast } from 'react-toastify';
import Utils from '../../../service/core/utils';
import { BenepayUserService } from '../../../service/api/benepay-user.service';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Auth } from "aws-amplify";
import { StorageKeys, StorageService, TempStorage } from "../../../service/core/storage.service";
import PermissionGuard from 'components/$widgets/permission/permissionGuard';
import { PrivilegeConstants } from 'config/constants';
import { Tooltip } from "@mui/material";
import { DashboardService } from 'service/api/dashboard.service';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
/**
 * @author Vijayakumar
 * 
 * Class created to handle merchants and merchant summary events
 */
class Merchant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      self: '',
      merchantSummary: [],
      rowsWithId: [],
      merchantName: "",
      merchantEmail: "",
      merchantIdSearch: "",
      selectedRowsWithId: [],
      rowsWithIdALL: [],
      columns: [
        { field: 'merchantId', headerName: 'ID', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'parentCustomerId', headerName: 'Parent customer', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'merchantName', headerName: 'Name', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'emailIdForNotifications', headerName: 'Email', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'phone', headerName: 'Phone', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'status', headerName: 'Status', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'merchantAddress', headerName: 'Address', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header' },
        { field: 'Action', headerName: 'Action', width: 325, flex: 1, headerClassName: 'merchant-summary-blue-header', align: 'center', headerAlign: 'center', renderCell: this.renderActions },
      ],
      merchantId: '0',
      pageSize: { pageSize: 5, page: 0 }, // Initial page size
      openActivatepopup: false,
      openDeActivatepopup: false,
      disableDeactivateBtns: false,
      disableActivateBtns: false,
      openErrorActivatePopop: false,
      errorMessage: '',
      filterApplied:false,
    };
  }

  renderActions = (params) => {

    const merchantData = this.state.rowsWithId.find(
      (row) => row.merchantId === params.row.merchantId
    );

    if (!merchantData) {
      return null;
    }
    const { editedRowIndex } = this.state;
    // const isEditing = editedRowIndex === params.rowIndex;

    return (
      <div>

        <PermissionGuard userPermission={PrivilegeConstants.MERCHANT_SUMMARY_ACTION_BTN}>

          <EditNoteIcon style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => this.handleEditClick(params)}>
            <span>Edit</span>
          </EditNoteIcon>

          {merchantData.activeStatus !== null && (merchantData.activeStatus == 0 || merchantData.activeStatus == 3) ? (

            <Tooltip title="Activate">
              <VerifiedUserIcon
                style={{ cursor: 'pointer', color: 'green' }}
                onClick={() => this.setState({ openActivatepopup: true, merchantId: params.row.merchantId })}
              />
            </Tooltip>
          ) : (
            
            <Tooltip title="Deactivate">
              <RemoveModeratorIcon
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => this.setState({ openDeActivatepopup: true, merchantId: params.row.merchantId })}
              />
            </Tooltip>
          )}

        </PermissionGuard>
      </div>
    );
  };

  handleEditClick = (param) => {
    if (param && param.row && param.row.merchantId) {
      this.setState({
        merchantId: param.row.merchantId,
      }, () => {
        let encryptValue = Utils.encrypt(this.state.merchantId);
        this.props.history.push("/onboarding/" + encryptValue);
      });
    }
  };

  confirmDeActivateMerchant = async () => {

    this.setState({ isLoading: true, disableDeactivateBtns: true });

    if (this.state.merchantId) {
      const res = await DashboardService.deActivateMerchantDetails(this.state.merchantId);

      if (res.statusCode == "200") {
        this.setState({ disableDeactivateBtns: false, openDeActivatepopup: false }, () => {
          setTimeout(async () => {
            toast.success(res.message);
            await this.getAllMerchant()
          }, 1000);
          this.setState({ isLoading: false })
        });
      }
    } else {
      this.setState({ openDeActivatepopup: false }, () => {
        toast.error("Unable To De-Activate Merchant");
      });
    }
  }

  confirmActivateMerchant = async () => {

    this.setState({ isLoading: true, disableActivateBtns: true });

    if (this.state.merchantId) {
      const res = await DashboardService.activateMerchantDetails(this.state.merchantId);

      if (res.statusCode == "200") {
        this.setState({ disableActivateBtns: false, openActivatepopup: false }, () => {
          setTimeout(async () => {
            toast.success(res.message);
            await this.getAllMerchant()
          }, 1000);
          this.setState({ isLoading: false })

        });
      } else {
        this.setState({ isLoading: false, ActMhtconfirmBtnDisable: false });
        var splittedMessages = res.message.split('.');
        this.setState({
          openErrorActivatePopop: true,
          errorMessage: res.message ? splittedMessages : 'Unable To Activate Merchant. Please Check The Provided Data'
        });
      }
    } else {
      this.setState({ disableActivateBtns: false, openActivatepopup: false }, () => {
        toast.error("Unable To Activate Merchant");
      });
    }
  }
  getFormattedAddress(addr) {
    let addressComponents = [];

    if (addr) {
      if (addr.address1) addressComponents.push(addr.address1);
      if (addr.address2) addressComponents.push(addr.address2);
      if (addr.city) addressComponents.push(addr.city);
      if (addr.postalcode) addressComponents.push(addr.postalcode);
      if (addr.state) addressComponents.push(addr.state);
      if (addr.country) addressComponents.push(addr.country);
      if (addr.phoneCtryCode && addr.phoneNo) {
        addressComponents.push(addr.phoneCtryCode + " " + addr.phoneNo);
      }
    } else {
      return '-';
    }

    return addressComponents.join(', ').trim();
  }


  GetMerchantSummaryIds = async() => {
    let arr = this.state.merchantSummary.map((row, index) => ({
      ...row,
      id: index,
      parentCustomerId: row.parentCustomerId != null ? row.parentCustomerId : '-',
      status: row.activeStatus !== null ? row.activeStatus == 0 ? 'In-Active' : row.activeStatus == 3 ? 'Deactivated' : 'Active' : 'Unknown',
      phone: (row.tradingAddr?.phoneNo !== null && row.tradingAddr?.phoneNo !== undefined) ?
        (row.tradingAddr.phoneCtryCode ? `${row.tradingAddr.phoneCtryCode} ${row.tradingAddr.phoneNo}` : row.tradingAddr.phoneNo)
        : '-',
      emailIdForNotifications: (row.primaryContact?.emailId !== null && row.primaryContact?.emailId !== undefined) ? row.primaryContact.emailId : '-',
      merchantAddress: this.getFormattedAddress(row.tradingAddr),
      deleteMerchantBD: false,
      deleteServiceAndPreference: false,
      deleteNotificationDetails: false,
      deleteMerchantND: false,
      activateMerchant: false,
      deleteOnboardND: false,
    }));
    
    this.setState({
      rowsWithIdALL: arr,
      rowsWithId: arr,
      selectedRowsWithId:arr
    })
  };

  handleDownloadClick = () => {
    const { rowsWithId, columns, pageSize } = this.state;
    //commented lines can use for download data based on row and page size not fully implemented

    // let  currentPageSize = this.state.pageSize.pageSize; 
    // console.log("pageSize",pageSize);
    // if (currentPageSize === -1) {
    //   currentPageSize = rowsWithId.length; // Set to the total number of rows
    // }
    // const currentPageRows = rowsWithId.slice(0, currentPageSize); // Get rows for current page
    const currentDate = new Date();
    const formattedDate = Utils.formatTwoDigitMonth(currentDate);
    const csvHeaders = columns.map((column) => column.headerName).join(",");
    // const csvData = currentPageRows.map((row) => columns.map((column) => row[column.field]).join(",")).join("\n");
    const csvData = this.state.rowsWithId.map((row) => this.state.columns.map((column) => row[column.field]).join(",")).join("\n");
    const csvContent = csvHeaders + "\n" + csvData;
    const filename = `merchant_summary_${formattedDate}.csv`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };


  getAllMerchant = async () => {
    try {
      // Setting API call flag
      this.setState({ isApiCalled: true, loading: true })

      const result = await BenepayUserService.getMerchants();
      if (result.data && result.data.merchantSummary) {
        // Updating the component state with merchant summary data
        this.setState({ merchantSummary: result.data.merchantSummary }, () =>{
          this.GetMerchantSummaryIds();
        })
        
        this.setState({ loading: false });
      }

      if (result.data.status !== '200') {
        // Displaying an error toast message if the API response has an error
        toast.error(result.data.message);
        return;
      }

    } catch (error) {
      console.error(error);
    }
  };

  //Redirect to Onboarding
  navigateToOnboarding = () => {
    this.props.history.push("/onboarding");
  };

  searchWithTheFields = () => {
    let allData = this.state.rowsWithIdALL;
    if (this.state.merchantId.length > 0) {

      this.setState({filterApplied : true});

      const re = RegExp(`.*${this.state.merchantIdSearch.toLowerCase().split('').join('.*')}.*`);
      allData = allData.filter(item => item.merchantId.toLowerCase().match(re));
    }

    if (this.state.merchantName.length > 0) {

      this.setState({filterApplied : true});

      const re2 = RegExp(`.*${this.state.merchantName.toLowerCase().split('').join('.*')}.*`);
      allData = allData.filter(item => item.merchantName.toLowerCase().match(re2));
    }

    if(this.state.merchantIdSearch.length == 0 && this.state.merchantName.length == 0){
      this.setState({filterApplied : false});
    }

    this.setState({ rowsWithId: allData })
  }


  componentDidMount = async () => {
    await Auth.currentSession().then(res => {
      let jwt = res["idToken"]["jwtToken"];
      StorageService.set(StorageKeys.clientJwt, jwt);
    });

    // Calling the method to fetch merchant data when the component mounts
    this.getAllMerchant()
  }

  // Rendering the component using the HTML template
  render = () => html.apply(this);
}

export default Merchant;
