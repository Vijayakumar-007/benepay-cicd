import React, { Component } from 'react';
import { html } from "./logo.html";
import { toast } from 'react-toastify';
import { DashboardService } from '../../../../../service/api/dashboard.service';

//Constants
import { OnboardConstants, messages } from '../../../../../config/constants';
import Validator from '../../../../../service/core/validator';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';

class Logo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            merchantId: props.merchantId,
            value: 0,
            save: '',
            delete: '',
            selectedFile: '',
            getPreValue: '',
            loading: false,
        }
    }
    fileInputRef = React.createRef();

    componentDidMount =async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });

        this.handleStage();
    }

    componentDidUpdate = () => {
        this.handleStage();
    }

    //Please don't comment or remove any lines in the saveImg, deleteLogo and getPreValueOfLogo statements
    //!Be careful if you make any change in the componentDidUpdate
    handleStage = () => {
        if (this.props.saveImg) {
            //Give a parameter of tab index
            this.props.saveImgCallback(OnboardConstants.logoTabVal);
            this.uploadMerchantLogo();
        }

        if (this.props.deleteLogo) {
            //Give a parameter of tab index
            this.props.deleteImgCallback(OnboardConstants.logoTabVal);
            this.setState({ openLogodeletepopup: true })
        }

        if (this.props.getPreValueOfLogo) {
            //Give a parameter of tab index
            this.props.getPreValueCallback(OnboardConstants.logoTabVal);
            this.fetchLogo();
        }
    }


    handleFileChange = (event) => {
        // Update the state with the selected file
        const selectedFile = event.target.files[0];

        // Validate the file type using the Validator class
        if (Validator.isValidLogoType(selectedFile)) {
            this.setState({ selectedFile });
            this.setState({ imagePreview: null });

            // Create a temporary URL for the   preview
            const imagePreview = URL.createObjectURL(selectedFile);
            this.setState({ imagePreview });

        } else {
            // Clear the selected file and show an error toast with allowed file types
            this.setState({ selectedFile: null, imagePreview: null });
            const allowedTypesString = Validator.getAllowedLogoTypes().join(', ');
            toast.error(`${messages.invalidLogoType}(${allowedTypesString}).`);
        }
    };

    /**
     * Encrypting the file
     * @param {*} file 
     * @returns 
     */
    getBase64FromFile = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    /**
     * Save the merchant logo in the amazon s3 bucket
     */
    uploadMerchantLogo = async () => {
        var sendRes = { logoUpload: false, message: false };

        if (this.state.selectedFile && this.state.selectedFile instanceof File) {

            this.setState({ loading: true });

            let enfile = await this.getBase64FromFile(this.state.selectedFile);
            enfile = enfile.split(',')[1];

            let reqObj = {
                merchantId: this.props.merchantId,
                file: enfile,
                fileName: this.state.selectedFile.name,
                deleteLogo: false
            }

            const res = await DashboardService.saveMerchantLogo(reqObj);

            if (res && res.statusCode == "200" && res !== undefined && res !== null) {
                //Method handle the delete and clear button show/hide
                this.props.resetBtnConfigFlag(OnboardConstants.logoTabVal);

                this.setState({ save: this.SAVE_DONE, loading: false });
                sendRes.logoUpload = true;
                sendRes.message = true;

            } else {
                this.setState({ loading: false });
            }
        }
        else {
            sendRes.logoUpload = true;
            sendRes.message = false;
        }

        this.props.imgSaveResponse(sendRes);
    };

    /**
     * Fetch the merchant logo and set in the image tag
     */
    fetchLogo = async () => {
        let merchantId = this.state.merchantId;

        if (merchantId) {
            this.setState({ loading: true });

            const res = await DashboardService.fetchMerchantBasicDetails(merchantId);

            if (res && res.merchantBasicDetails) {
                var data = res.merchantBasicDetails[0];

                if (data && data.merchantLogoUrl !== null) {
                    //Method handle the delete and clear button show/hide
                    this.props.resetBtnConfigFlag(OnboardConstants.logoTabVal);

                    this.setState({
                        selectedFile: data.merchantLogoUrl,
                        imagePreview: data.merchantLogoUrl,
                    });
                }
            }

            this.setState({ loading: false });
        }
    }

    handleClear = () => {
        // this.fileInputRef.current.value = "";
        this.setState({
            selectedFile: null,
            imagePreview: null,
        });
    };

    /**
     * Delete logo in the amazon s3 bucket and remove logo url in the database logo column
     */
    handleDeleteLogo = async () => {

        this.setState({ loading: true });

        let reqObj = {
            merchantId: this.state.merchantId,
            file: null,
            fileName: null,
            deleteLogo: true
        }

        const res = await DashboardService.saveMerchantLogo(reqObj);

        let sendRes = { deleteLogo: false };

        if (res && res.statusCode == "200" && res !== undefined && res !== null) {
            this.setState({ delete: this.DELETE_DONE, openLogodeletepopup: false, loading: false },
                () => this.handleClear());
            sendRes.deleteLogo = true;

            this.props.imgSaveResponse(sendRes);
        } else {

            this.setState({ delete: '', loading: false });
            this.props.imgSaveResponse(sendRes);
        }
    };

    handleUploadClick = () => {
        this.fileInputRef.current.click();
    };

    render = () => html.apply(this);
}
export default (Logo);
