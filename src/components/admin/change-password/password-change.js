import { Component } from "react";
import { Auth } from "aws-amplify";
import { html } from "./password-change.html"
import { toast } from 'react-toastify';
import { StorageService, StorageKeys } from "../../../service/core/storage.service";
import { messages } from "../../../config/constants";
import AuthService from "service/core/auth.service";

/**
 * Component to handle the validation and API process for change password form
 * 
 * @author Vijayakumar
 */
class ChangePasswordForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      currentUser: null,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      confirmNewPasswordError: " ",
      currentPasswordError: " ",
      newPasswordError: " "
    };
  }

  /**
   * Function for validate the password
   */
  ValidatePassword = async () => {
    let valid = true;

    try {
      const currentAuthenticatedUser = StorageService.get(StorageKeys.userEmail);

      if (!currentAuthenticatedUser) {
        this.setState({ confirmNewPasswordError: messages.userPasswordError });

        return false;
      }

      if (!this.state.currentPassword) {
        this.setState({ currentPasswordError: messages.fieldRequired });

        return false;
      }

      try {
        const user = await Auth.signIn(currentAuthenticatedUser, this.state.currentPassword);

        if (!user) {
          this.setState({ currentPasswordError: messages.incorrectCurrentPasswordError });
        }
      } catch (error) {
        this.setState({ currentPasswordError: messages.incorrectCurrentPasswordError });
        return false;
      }

      if (!this.state.newPassword) {
        this.setState({ newPasswordError: messages.fieldRequired });
        return false;
      }

      
      let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/;


      if (this.state.newPassword.length < 5 || !passwordPattern.test(this.state.newPassword)) {
        this.setState({ newPasswordError: messages.chartacterValidationError });
        return false;
      }

      if (!this.state.confirmNewPassword) {
        this.setState({ confirmNewPasswordError: messages.fieldRequired });
        return false;
      }

      if (this.state.newPassword !== this.state.confirmNewPassword) {
        this.setState({ confirmNewPasswordError: messages.passwordNotMatchError });
        return false;
      }

      if (this.state.currentPassword === this.state.newPassword) {
        this.setState({ confirmNewPasswordError: messages.sameCurrentAndOldPasswordError });
        return false;
      }
    } catch (error) {
      toast.error(messages.catchError + error.message);

      valid = false;
    }

    return valid;
  };

  /**
   * Funtion for changing password using amplify auth
   */
  changePassword = async () => {
    try {
      const currentAuthenticatedUser = StorageService.get(StorageKeys.userEmail);
      const user = await Auth.signIn(currentAuthenticatedUser, this.state.currentPassword);

      const newPassword = this.state.newPassword;
      const response = await Auth.changePassword(user, this.state.currentPassword, newPassword);

      if (response === 'SUCCESS') {
        toast.success(messages.successfullPasswordChange);

        setTimeout(async () => {
          await AuthService.signOut(false);
        }, 1000);
      }
    } catch (error) {
      toast.error(`${messages.catchError}:${error.message}`);
    }
  };

  /**
   * Function to handle changes in the current password input field.
   */
  handleCurrentPasswordChange = (event) => {
    this.setState({ currentPassword: event.target.value, currentPasswordError: '' });
  };

  /**
   * Function to handle changes in the New password input field.
   * 
   * @param {*} event 
   */
  handleNewPasswordChange = (event) => {
    this.setState({ newPassword: event.target.value, newPasswordError: '' });
  };

  /**
   * Function to handle changes in the confirm-new password input field.
   * 
   * @param {*} event 
   */
  handleConfirmNewPasswordChange = (event) => {
    this.setState({ confirmNewPassword: event.target.value, confirmNewPasswordError: '' });
  };

  /**
   * Funtion for toggle eye icon in current password input field
   */
  toggleCurrentPasswordVisibility = () => {
    if (this.state.showCurrentPassword == true) {
      this.setState({ showCurrentPassword: false });
    }
    else {
      this.setState({ showCurrentPassword: true });
    }
  };

  /**
   * Funtion for toggle eye icon in new-password input field
   */
  toggleNewPasswordVisibility = () => {
    if (this.state.showNewPassword == true) {
      this.setState({
        showNewPassword: false,
      });
    }
    else {
      this.setState({
        showNewPassword: true,
      });
    }
  };

  /**
   * Funtion for toggle eye icon in  confirm-new-password input field
   */
  toggleConfirmNewPasswordVisibility = () => {
    if (this.state.showConfirmNewPassword == true) {
      this.setState({
        showConfirmNewPassword: false,
      });
    }
    else {
      this.setState({
        showConfirmNewPassword: true,
      });
    }
  };

  /**
   * Funtion for cancel the changing password and go back to home screen
   */
  handleCancel = () => {
    this.props.history.push('/dashboard');
  };

  render = () => html.apply(this);
}

export default ChangePasswordForm;
