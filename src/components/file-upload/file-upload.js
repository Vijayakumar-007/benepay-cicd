import React, { Component, useState } from 'react'
import { html } from './fileUpload.v2.html'
import "./file-upload.scss"
import { CustomerService } from '../../service/api/customer.service'
import { toast } from 'react-toastify'
import { StorageKeys, StorageService, TempStorage } from '../../service/core/storage.service'
import { Auth } from '@aws-amplify/auth';
import color from '@material-ui/core/colors/amber'
import { Pagination, PrivilegeConstants } from '../../config/constants'
import GetAppIcon from "@material-ui/icons/GetApp";
import moment from "moment";
import { DateFormat } from "../../enum/common.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faDownload,
  faArrowsRotate,
  faCircleCheck,
  faTriangleExclamation,
  faHourglassHalf,
  faExclamation,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import StatusCreator from "./support-components/statusCreater"
import { DashboardService } from '../../service/api/dashboard.service'
import Utils from '../../service/core/utils'
import PermissionGuard from 'components/$widgets/permission/permissionGuard'

class fileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privileges: TempStorage.userPrivilege,
      paymentFile: null,
      fileName: '',
      uploadedFiles: [],
      isApiCalled: false,
      validationError: [],
      fileType: [],
      uploadType: 'payment',
      refundErrors: [],
      fileErrorCSVHeaders: [
        {
          label: "File Id",
          key: "refId"
        },
        {
          label: "Input Request",
          key: "inputRequest"
        },
        {
          label: "Error Code",
          key: "errorCode"
        },
        {
          label: "Received Date",
          key: "receivedDate"
        },
        {
          label: "Error Description",
          key: "errorDesc"
        }
      ],
      csvData: {},
      pageNo: Pagination.pageNo,
      pageSize: Pagination.pageSize,
      totalPages: Pagination.totalPages,
      fileRefType: "payment",
      initalPage: 0,
      pageNoForRedirect: null,
      errorDetailsModel: false,
      selectedStatusForError: "",
      menuOpen: false,
      allowPaymentByFile: true,
      allowRefundByFile: true,
      merchantTimeZone: "",
    }
    this.anchorRef = React.createRef();
  }

  handleChange = (ev) => {
    this.getUploadedFiles(ev.target.value);
    this.setState({ uploadType: ev.target.value })
    console.log(ev.target.value);
    this.setState({validationError : []});
  }



  handleClose = () => {
    this.setState({ isFileUploaded: true });
  }

  handleFileChange = async (e) => {
    const files = e.target.files || e.dataTransfer.files
    if (!files.length) {
      return
    }
    console.log(e.target.files)
    await this.setState({ paymentFile: files[0] })
    this.validateFile()
  }

  validateFile = () => {
    const file = this.state.paymentFile;
    const allowedExtensions = ['csv', 'xls', 'xlsx']
    const extension = file.name
      .substr(file.name.lastIndexOf('.') + 1)
      .toLowerCase()
    if ((file.size / 1024 / 1024) > 0.2) {
      toast.info('Please upload file less then 200 KB.')
      return
    }
    if (allowedExtensions.indexOf(extension) === -1) {
      toast.info('Invalid file Format. Only ' + allowedExtensions.join(', ') + ' is allowed.');
      return;
    }

    this.setState({
      fileName: file.name,
    })
    this.uploadFile()
  }

  uploadFile = async () => {
    try {
      this.setState({ validationError: [], isApiCalled: true });
  
      const userEmail = StorageService.get(StorageKeys.userEmail);
      let formData = new FormData();
      formData.append('file', this.state.paymentFile);
  
      let file = await this.getBase64FromFile(this.state.paymentFile);
      file = file.split(',')[1];
  
      const req = {
        file,
        userEmail,
        fileName: this.state.fileName
      };
  
      let result = '';
      console.log(this.state.uploadType + "filetype");
  
      if (this.state.uploadType.toString().toLowerCase() === 'payment') {
        result = await CustomerService.uploadFile(req);
      } else {
        result = await CustomerService.refundFile(req);
        result.data.message = "File has been Successfully Uploaded";
      }
  
      this.setState({ paymentFile: null, isApiCalled: false });
  
      if (result.data.status === 'FAILED' || result.data.errorCode) {
        toast.error(result.data.message || result.data.errorDescription);
        return;
      }
  
      if (result.data.validationError) {
          toast.error("File Upload Failed!");
          await this.setState({ validationError: result.data.validationError });
          console.log("this.state.validation error ", this.state.validationError);
          return;
      }
  
      if(result.data && result.data.message && this.state.uploadType.toString().toLowerCase() === 'payment'){
        toast.success("File upload successful")
      }

      if(result.data && result.data.message && this.state.uploadType.toString().toLowerCase() === 'refund'){
        toast.success("File validation successful! Please check back in some time for upload status!")
      }
  
      this.getUploadedFiles(this.state.uploadType, this.state.pageNo);
    } catch (error) {
      console.error("Error occurred during file upload:", error);
      toast.error("An error occurred during file upload. Please try again.");
      this.setState({ isApiCalled: false });
    }
  }

  downloadErrorListInCsv = async (fileId) => {
    console.log("file Id ", fileId)
    const csvData = {
      filename: `refund-errors-${fileId}`,
      headers: this.state.fileErrorCSVHeaders,
      data: this.state.refundErrors
    }
    await this.setState({ csvData })
    console.log("csv data ", this.state.csvData);
  }

  getErrorList = async (fileId, activeStatus) => {
    this.setState({ isApiCalled: true, selectedStatusForError: activeStatus})
    console.log("file id ", fileId)
    const response = await CustomerService.fetchErrorSummaryList(fileId)
    this.setState({ isApiCalled: false })
    console.log("response ", response.data.rejectedTransactionList)
    if (response && response.data && response.data.rejectedTransactionList) {
      this.setState({ refundErrors: response.data.rejectedTransactionList, errorDetailsModel: true })
      this.downloadErrorListInCsv(fileId)
    }
  }

  clearError = () => {
    this.setState({ validationError: [] });
  }

  getBase64FromFile = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  getUploadedFiles = async (fileType, paramPageNo) => {

    if(fileType != this.state.fileRefType){
      this.setState({initalPage: 0,pageNoForRedirect:null});
      paramPageNo = 1;
    }
    paramPageNo = paramPageNo || 1;
  
    this.setState({ isApiCalled: true , fileRefType: fileType })
    console.log("file Type ", fileType)
    const result = await CustomerService.getUploadedFilesList(fileType, paramPageNo , this.state.pageSize)
    this.setState({ isApiCalled: false })
    if (result.data.status === 'FAILED') {
      toast.error(result.data.message)
      return;
    }
    if (result.data.files && result.data.files.length > 0) {
      // Sort files based on the creationDate in descending order
      result.data.files.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))

    }
    // console.log("SUSHMIT PRINTITNG :", result.data);
    let totalPages = (result.data.totalCount / this.state.pageSize);
    this.setState({
      totalPages: Math.ceil(totalPages)
    });
    await this.setState({ pageNoForRedirect: result.data.pageNo, initalPage: result.data.pageNo - 1, uploadedFiles: result.data.files });
  }

  handlePageChangePayment = async (data) => {
    this.setState({initalPage: data.selected});
    this.setState({ pageNo: data.selected + 1 });
    // console.log("Trying to print: ",this.state.fileRefType);
    this.getUploadedFiles(this.state.fileRefType, data.selected + 1 );
  }

  downloadPaymentFileResponse = async (fileId) => {
    this.setState({ isApiCalled: true })
    const response = await CustomerService.fetchPaymentFileResponse(fileId);
    this.setState({ isApiCalled: false })
    if (!response) {
      return;
    }
    if (response.data && response.data['Error Code'] && response.data['Error Code'].includes('500')) {
      toast.error('File does not exist!');
      return;
    }
    const blob = this.base64toBlob(response.data.content, 'text/csv');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.data.fileName + '.csv');
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.data.fileName
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    console.log("payment response ", response);
  }

  base64toBlob = function (base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    // var byteCharacters = decodeURIComponent(escape(window.atob(base64Data)))
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  //   async downloadPaymentFileResponse(fileId) {
  //     const download = await CustomerService.fetchPaymentFileResponse(fileId);
  //     const url = window.URL.createObjectURL(new Blob([download]));
  //     console.log("url ", url)
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', fileId.split('/')[3]); //or any other extension
  //     console.log(fileId)
  //     document.body.appendChild(link);
  //     link.click();
  // }

  getFormattedAttribute = (error) => {
    switch (error.attribute || error.errorCode) {
      case 'fileName':
        return 'File Name';
      case 'fileSize':
        return 'File Size';
      case 'fileDuplicate':
        return 'File Duplicate';
      default:
        return error.attribute || error.errorCode;
    }
  };

  getMerchantPreferences = async () => {
    let result = await DashboardService.getMerchantPreferences();
    if(result){
      this.setState({
        allowPaymentByFile: result.allowPaymentByFile,
        allowRefundByFile: result.allowRefundByFile,
      })
    }
  }

  componentDidMount = async () => {
    await Auth.currentSession().then(res => {
      console.log("Res ", res);
      let jwt = res["idToken"]["jwtToken"]
      StorageService.set(StorageKeys.clientJwt, jwt);
    })
    
    this.getUploadedFiles(this.state.uploadType, 1);

    if(this.state.privileges && !this.state.privileges[PrivilegeConstants.PAYMENT_FILE_UPLOAD] && this.state.privileges[PrivilegeConstants.REFUND_FILE_UPLOAD]){
      document.getElementById("ReundFileUploadMenu").click();
    }
    this.getMerchantPreferences();
  }


  // New UI

  uploadedPaymentFiles = () => {
    const cols = [
      {
        field: "fileName",
        headerName: "File Name",
        // width: 280,
        sortable: false,
        minWidth: 210,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "creationDate",
        headerName: "Submitted Timestamp",
        // width: 240,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        sortable: false,
        minWidth: 350,
         valueGetter: (params) => {
          return `${params.value}`;
        },
      },
      {
        field: "status",
        headerName: "Uploaded Status",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 150,
        align: "left",
        sortable: false,
        headerAlign: "left",
        renderCell: (params) => {
          return (<>
            <StatusCreator rowStatus={params.row.status}/>
          </>)
        }
      },
      {
        field: "totalTransactions",
        headerName: "Total Transactions",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        align: 'center',
        sortable: false,
        headerAlign: "center",
        minWidth: 130,
        renderCell: (params) => {
          return (<>
            <p>{params ? `${params.row.totalTransactions}` : "0"}</p>
            </>)
        }
      },
      {
        field: "validTransaction",
        headerName: "Uploaded Transactions",
        minWidth: 130,
        align: 'center',
        sortable: false,
        headerAlign: "center",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      // {
      //   field: "2",
      //   headerName: "Error Details",
      //   width: 20,
      //   align: "center",
      //   headerAlign: "center",
      //   sortable: false,
      //   headerClassName: "serachedPaymentResultListHeaderColor",
      //   cellClassName: "table-cell-classname-actions",
      //   flex: 1,
      //   minWidth: 20,
      //   disableColumnMenu: true,
      //   sortable: false,
      //   border: 0,
      //   renderCell: (params) => {
      //     return (
      //       <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faDownload} onClick={() =>
      //         (this.state.uploadType === "payment" && (params.row.status === "INVALID" || params.row.status === "FAILED")) && this.getErrorList(params.row.fileId, params.row.status)
      //       } 
      //       style={{ color:'#B00020' ,opacity: ((this.state.uploadType === "payment" && (params.row.status === "INVALID" || params.row.status === "FAILED"))) ? 1 : 0.5 }}
      //       />
      //     );
      //   },
      // },
      {
        headerName: "Payment Link Report",
        width: 20,
        align: "center",
        headerAlign: "center",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-actions",
        flex: 1,
        minWidth: 20,
        disableColumnMenu: true,
        sortable: false,
        border: 0,
        renderCell: (params) => {
          return (
            <PermissionGuard userPermission={PrivilegeConstants.PAYMENT_LINK_REPORT_UPLOAD} fallback={
                <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faFileArrowDown} style={{ color:'var(--primary-color)' ,opacity: 0.5 }}/>
            }>
              <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faFileArrowDown} onClick={() =>
                (this.state.uploadType === "payment" && (params.row.outputFilePath !== '' && params.row.outputFilePath !== null)) && this.downloadPaymentFileResponse(params.row.fileId) ||
                (this.state.uploadType === "Refund" && (params.row.status !== "COMPLETED" || params.row.status !== "UPLOADED") && this.getErrorList(params.row.fileId, params.row.status))
              } 
              style={{ color:'var(--primary-color)' ,opacity: (this.state.uploadType === "payment" && (params.row.outputFilePath === '' || params.row.outputFilePath === null) || (this.state.uploadType === "Refund" && params.row.status === "COMPLETED" || params.row.status === "UPLOADED")) && 0.5 }}
              />
            </PermissionGuard>
          );
        },
      },
    ];

    return cols;
  };

  uploadedRefundFiles = () => {
    const cols = [
      {
        field: "fileName",
        headerName: "File Name",
        // width: 280,
        minWidth: 210,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        sortable: false
      },
      {
        field: "creationDate",
        headerName: "Submitted Timestamp",
        // width: 240,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        sortable: false,
        minWidth: 350,
        valueGetter: (params) => { 
          return `${params.value}`;
        },
      },
      {
        field: "status",
        headerName: "Uploaded Status",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 150,
        align: "left",
        sortable: false,
        headerAlign: "left",
        renderCell: (params) => {
          return (<>
            <StatusCreator rowStatus={params.row.status}/>
          </>)
        }
      },
      {
        field: "totalTransactions",
        headerName: "Total Transactions",
        // width: 240,
        sortable: false,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 130,
        align: 'center',
        headerAlign: "center",
        renderCell: (params) => {
          return (<>
            <p>{params && params.row.totalTransactions !== null ? `${params.row.totalTransactions}` : "0"}</p>
            </>)
        }
      },
      {
        field: "validTransaction",
        headerName: "Successful Refunds",
        minWidth: 170,
        align: 'center',
        sortable: false,
        headerAlign: "center",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "2",
        headerName: "Error Details",
        width: 20,
        align: "center",
        headerAlign: "center",
        sortable: false,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-actions",
        flex: 1,
        minWidth: 20,
        disableColumnMenu: true,
        sortable: false,
        border: 0,
        renderCell: (params) => {
          return (
            <PermissionGuard userPermission={PrivilegeConstants.DOWNLOAD_ERROR_SUMMARY} fallback={
              <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faDownload} style={{ color:'#B00020' ,opacity: 0.5 }}
              />
            }>
              <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faDownload} onClick={() =>
                (this.state.uploadType === "Refund" && (params.row.status === "INVALID" || params.row.status === "FAILED") && this.getErrorList(params.row.fileId, params.row.status))
              } 
              style={{ color:'#B00020' ,opacity: ((this.state.uploadType === "Refund" && (params.row.status === "INVALID" || params.row.status === "FAILED"))) ? 1 : 0.5 }}
              />
            </PermissionGuard>
          );
        },
      },
      {
        field: "1",
        headerName: "Download Refund File",
        align: "center",
        headerAlign: "center",
        sortable: false,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-actions",
        flex: 1,
        minWidth: 20,
        disableColumnMenu: true,
        sortable: false,
        border: 0,
        renderCell: (params) => {
          return (
          <PermissionGuard userPermission={PrivilegeConstants.DOWNLOAD_UPLOADED_REFUND_FILE} fallback={
            <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faFileArrowDown} 
            style={{
              color:'#495370',
              opacity: 0.5
              }}
            />
          }>
            <FontAwesomeIcon className={"mx-2 cursor-pointer"} icon={faFileArrowDown} onClick={() =>
              params.row.status === "COMPLETED" &&
              this.downloadPaymentFileResponse(
                params.row.fileId
              )
            }
            style={{
              color:'#495370',
              opacity:
              params.row.status !== "COMPLETED" && 0.5,
              }}
            />
          </PermissionGuard>
          );
        },
      },

    ];

    return cols;
  };

  handleRowsPerPage = async (event) => {
    await this.setState({
      pageSize: event.target.value,
    });

    this.getUploadedFiles(this.state.uploadType, 1);
  };

  handleToggle = () => {
    this.setState((prevState) => ({ menuOpen: !prevState.menuOpen }));
  };

  handleMenuClose = (event) => {
    if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
      return;
    }

    this.setState({ menuOpen: false });
  };

  handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({ menuOpen: false });
    }
  };

  handleTemplateDownload = async (fileType, fileCategory) => {
    const result = await DashboardService.downloadTemplate(fileType, fileCategory)
    // console.log("response", result)
    if (result.content && result.fileName) {
      Utils.downloadBase64File(result.content, result.fileName);
    } else {
      toast(result.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
    }
  }

  getMerchantPreferences = async () => {
    let result = await DashboardService.getMerchantPreferences();
    if(result){
      this.setState({
        merchantTimeZone:result.merchantTimeZone
      })
    }
  }

  render = () => html.apply(this)

}
export default fileUpload