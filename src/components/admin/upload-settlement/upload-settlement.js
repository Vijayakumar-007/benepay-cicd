import React, { Component } from 'react';
import { html } from "./upload-settlement-html";
import {HTTP} from '../../../service/core/http.service';
import moment from "moment";
import { toast } from 'react-toastify';
import { BenepayUserService } from '../../../service/api/benepay-user.service'
import { dateFormatymd, DefaultDateFormat, OnboardConstants, Pagination, PrivilegeConstants } from '../../../config/constants';
import { StorageKeys, StorageService, TempStorage, USER_TYPE } from '../../../service/core/storage.service';
import { MerchantSelectionContext } from "provider/merchantSelectionProvider";

class UploadSettlement extends Component {
    static contextType = MerchantSelectionContext;
    
    constructor(props) {
        super(props);
        this.state = {
            privileges: TempStorage.userPrivilege,
            loading: false,
            isApiCalled : false,
            titleName: 'Settlement Files',
            fromProviderStartDate: null,
            fromProviderEndDate: null,
            fromProviderSettlemntProvider: null,
            fromProviderMerchantName: null,
            fromProviderMerchantId: null,
            allProviders: [],
            allMerchants: [],
            generatedByBenepayStartDate: null,
            generatedByBenepayEndDate: null,
            generatedByBenepayMerchantName: null,
            generatedByBenepayMerchantId: null,
            searchedFromProviderResult: null,
            searchedGeneratedByBenepayResult: null,
            uploadedFileResult: null,
            uploadFileStatus: null,
            uploadNewSettlementDate: null,
            uploadNewSettlemntProvider: null,
            uploadNewMerchantName: null,
            uploadNewSettlemntFile: null,
            uploadNewFileName: '',
            validationError: [],
            pageNo: Pagination.pageNo,
            pageSize: Pagination.pageSize,
            numPageShow: Pagination.numPageShow,
            totalPages: Pagination.totalPages,
            initalPage: 0,
            toastTitle: '',
            toastBody: '',
            toastShow: false
        }
    }

    // From Provider

    fromProviderClick = async() => {
        this.clearGeneratedByBenepay();
        this.clearUploadFilePage();
        this.setState({'titleName': 'Settlement Files', initalPage: 0 , pageNo: 1});

        this.handleApplyFromProvider(1);
    }

    clearFromProvider = () => {
        this.setState(
            {
                fromProviderStartDate: null,
                fromProviderEndDate: null,
                fromProviderSettlemntProvider: null,
                fromProviderMerchantName: null,
                fromProviderMerchantId: null,
                searchedFromProviderResult: null
            })
    }

    handleApplyFromProvider = async(paramPageNo) => {

        const merchantId = StorageService.get(StorageKeys.merchantId) != "All" ? StorageService.get(StorageKeys.merchantId) : null;
        const merchantName = StorageService.get(StorageKeys.selectedMerchantId) != "All" ? StorageService.get(StorageKeys.selectedMerchantId) : null;

        let searchObj = {
            settlementStartDate: this.state.fromProviderStartDate,
            settlementEndDate: this.state.fromProviderEndDate,
            settlementProvider: this.state.fromProviderSettlemntProvider,
            merchantName: merchantName,
            merchantId: merchantId,
            pageNo: paramPageNo,
            pageSize: this.state.pageSize
        }

        if (this.state.fromProviderStartDate) {
            searchObj.settlementStartDate = moment(this.state.fromProviderStartDate).format(DefaultDateFormat.dateFormatymd)
        }
        if (this.state.fromProviderEndDate) {
            searchObj.settlementEndDate = moment(this.state.fromProviderEndDate).format(DefaultDateFormat.dateFormatymd)
        }

        // console.log("searchedFromProviderResult:", searchObj);

        this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.getFromProvidedResult(searchObj);
        this.setState({ isApiCalled: false , loading: false})
        if (result.data.status === 'FAILED') {
          toast.error(result.data.message)
          return;
        }
        let totalPages = (result.data.totalCount / this.state.pageSize);
        this.setState({
            totalPages: Math.ceil(totalPages)
        });
        await this.setState({ searchedFromProviderResult: result.data.settlementFileResponse });

    }

    handlePaginateGeneratedByBenepay = async(data) => {
        this.setState({initalPage: data.selected});
        this.setState({ pageNo: data.selected + 1 });
        this.handleApplyGeneratedByBenepay(data.selected + 1 );
    }

    // ------------------------------------------------------------------------------------------------
    // GeneratedByBenepay

    generatedByBenepayClick = async() => {
        this.clearFromProvider();
        this.clearUploadFilePage();
        this.setState({'titleName': 'Settlement Files', initalPage: 0 , pageNo: 1});

        this.handleApplyGeneratedByBenepay(1);
    }   

    clearGeneratedByBenepay = () => {
        this.setState(
            {
                generatedByBenepayStartDate: null,
                generatedByBenepayEndDate: null,
                generatedByBenepayMerchantName: null,
                generatedByBenepayMerchantId: null,
                searchedGeneratedByBenepayResult: null
            })
    }

    handleApplyGeneratedByBenepay = async(paramPageNo) => {

        let defaultSearch = true;

        if(this.state.generatedByBenepayStartDate || this.state.generatedByBenepayEndDate || this.state.generatedByBenepayMerchantId){
            defaultSearch = false;
        }

        const merchantId = StorageService.get(StorageKeys.merchantId) != "All" ? StorageService.get(StorageKeys.merchantId) : null;

        let searchObj = {
            startDate: this.state.generatedByBenepayStartDate,
            endDate: this.state.generatedByBenepayEndDate,
            // merchantName: this.state.generatedByBenepayMerchantName,
            merchantId: merchantId,
            pageNo: paramPageNo,
            pageSize: this.state.pageSize,
            defaultSearch: defaultSearch
        }

        if (this.state.generatedByBenepayStartDate) {
            searchObj.startDate = moment(this.state.generatedByBenepayStartDate).format(DefaultDateFormat.dateFormatymd)
        }
        if (this.state.generatedByBenepayEndDate) {
            searchObj.endDate = moment(this.state.generatedByBenepayEndDate).format(DefaultDateFormat.dateFormatymd)
        }

        // console.log("searchedGeneratedByBenepayResult:", searchObj);

        this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.getGeneratedByBenepayResult(searchObj);
        this.setState({ isApiCalled: false , loading: false})
        if (result.data.status === 'FAILED') {
          toast.error(result.data.message)
          return;
        }
        if(result.data.errors.length != 0){
            result.data.errors.forEach(error => {
                toast.error(error.errorMsg)
            });
            return;
        }
        let totalPages = (result.data.totalCount / this.state.pageSize);
        this.setState({
            totalPages: Math.ceil(totalPages)
        });
        await this.setState({ searchedGeneratedByBenepayResult: result.data.reports });

    }

    handlePaginateFromProvider = async(data) => {
        this.setState({initalPage: data.selected});
        this.setState({ pageNo: data.selected + 1 });
        this.handleApplyFromProvider(data.selected + 1 );
    }

    // ------------------------------------------------------------------------------------------------
    // UploadNewFile

    uploadNewClick = () => {
        this.clearFromProvider();
        this.clearGeneratedByBenepay();
        this.clearUploadFilePage();
        this.setState({'titleName': 'Settlement Files > Upload New File', uploadFileStatus : null})
    }

    clearUploadFilePage = () => {
        this.setState(
            {
                uploadNewSettlementDate: null,
                uploadNewSettlemntProvider: null,
                uploadNewMerchantName: null,
                uploadNewSettlemntFile: null,
                uploadNewFileName: '',
                uploadFileStatus: null
            })
    }

    handleUploadFileChange = async(e) => {

        const files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return;
        }
        await this.setState({ uploadNewSettlemntFile: files[0] })
        this.validateUploadSettlementFile()

    }

    validateUploadSettlementFile = async() => {
    
        const file = this.state.uploadNewSettlemntFile;
          const allowedExtensions = ['csv']
          const extension = file.name
            .substr(file.name.lastIndexOf('.') + 1)
            .toLowerCase()
          if ((file.size / 1024 / 1024) > 0.2) {
            toast.info('Please upload file less then 200 KB.');
            return;
          }
          if (allowedExtensions.indexOf(extension) === -1) {

              toast.info('Invalid file Format. Only ' + allowedExtensions.join(', ') + ' is allowed.');
              return;
          }
      
          this.setState({
            uploadNewFileName: file.name,
          })

    }

    handleUploadFileSubmit = async(e) => {
        e.preventDefault();

        if(TempStorage.loginUserRole === USER_TYPE.ADMIN_USER){
            this.uploadNewSettlementFile();
        }else{
            toast.error("Invalid User");
        }

    }

    uploadNewSettlementFile = async() => {
        let formData = new FormData();
        formData.append("file", this.state.uploadNewSettlemntFile);
        formData.append("settlementDate", moment(this.state.uploadNewSettlementDate).format(DefaultDateFormat.dateFormatymd));
        formData.append("settlementProvider", this.state.uploadNewSettlemntProvider);
        formData.append("merchantId", this.state.uploadNewMerchantName);

        this.setState({ isApiCalled: true , loading: true})

        let result = await BenepayUserService.uploadSettlementFile(formData);

        this.setState({ isApiCalled: false , loading: false})

        if (result.data.status === 'FAILED' || result.data.errorCode) {
            toast.error(result.data.message || result.data.errorDescription)
        }
        else if (result.data.errors) {

            // toast.error("File Upload Failed");
            let Error = result.data.errors;
            console.log("ERRROS :", Error , result);
            let errorMessages = '';
            let count = 1;
            Error.forEach(e => {
                errorMessages += `${count}. ${e.errorMsg}\n`;
                // toast.error(e.errorMsg);
                count++;
            });
            this.setToastAndDisplay('File Upload Failed!',  <pre>{errorMessages}</pre>, true);
            await this.setState({validationError: result.data.errors})
            console.log("this.state.validation error ", this.state.validationError);
            return;

        }else{
            toast.success("File Upload Successfully");
            this.setState({uploadFileStatus: 'success', uploadedFileResult: result.data});
        }
    }

    setToastAndDisplay = async(title, body, show) => {
        await this.setState({
            toastTitle: title,
            toastBody: body,
            toastShow: show
        })
    }

    downloadFromSettlementFile = async (e) => {

        let fileId = e.currentTarget.attributes['fileid'].value;
        this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.downloadFromSettlementFile(fileId);
        this.setState({ isApiCalled: false , loading: false})
        if (result.data.status === 'FAILED') {
          toast.error(result.data.message)
        }else{
          window.open(result.data.preSignedS3Url);
        }
        
    }

    downloadGeneratedByBenepayFile = async (e) => {

        let fileId = e.currentTarget.attributes['fileid'].value;
        this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.downloadGeneratedByBenepayFile(fileId);
        this.setState({ isApiCalled: false , loading: false})
        if (result.data.status === 'FAILED') {
          toast.error(result.data.message)
        }else{
          window.open(result.data.preSignedS3Url);
        }
        
    }

    // Default

    getAndSetAllMerchants = async() => {
        // this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.getAllMerchants();
        // this.setState({ isApiCalled: false , loading: false})
        if (result && result.data.status === 'FAILED') {
            toast.error(result.data.message)
        }else{
            await this.setState({allMerchants: result.data});
        }
    }

    getAndSetAllProviders = async() => {
        // this.setState({ isApiCalled: true , loading: true})
        let result = await BenepayUserService.getAllProviders();
        // this.setState({ isApiCalled: false , loading: false})
        if (result && result.data.status === 'FAILED') {
            toast.error(result.data.message)
        }else{
            await this.setState({allProviders: result.data});
        }
    }

    async componentDidMount(){

        this.getAndSetAllMerchants();
        this.getAndSetAllProviders();
        this.handleApplyFromProvider(1);


        if(this.state.privileges && this.state.privileges[PrivilegeConstants.SETTLEMENT_REPORT_GENERATED_BY_BENEPAY] && !this.state.privileges[PrivilegeConstants.SETTLEMENT_REPORT_FROM_PROVIDER]){
            document.getElementById("pills-generated-by-benepay-tab").click();
        }

        if(this.state.privileges && this.state.privileges[PrivilegeConstants.UPLOAD_SETTLEMENT_REPORT] && !this.state.privileges[PrivilegeConstants.SETTLEMENT_REPORT_GENERATED_BY_BENEPAY] && !this.state.privileges[PrivilegeConstants.SETTLEMENT_REPORT_FROM_PROVIDER]){
            document.getElementById("pills-upload-new-tab").click();
        }

    }

    componentDidUpdate(){
        if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
            const { merchantId } = this.state;
            const { merchantValue } = this.context;
            
            if ( merchantId != merchantValue ){
                this.setState({ merchantId: merchantValue }, () => {
                    this.handleApplyFromProvider(1);
                });
            }
        }
    }
    render = () => html.apply(this);

}

export default UploadSettlement;
