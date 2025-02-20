import React from "react";
import { Card, FormControl, FormHelperText, Grid, InputAdornment, TextField, Typography, alpha } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@material-ui/core";
import { Image, View } from '@aws-amplify/ui-react';
import IconButton from "@mui/material/IconButton";
import { ButtonPrimary, ButtonSecondary } from "../../$widgets/buttons/form-button";
import ConfirmDialog from "../../$widgets/dialog";
import logo from "../../../assets/images/benepay-transperent.png";
import "./password-change.scss"
import { messages } from "../../../config/constants";

const StyledTextField = styled(TextField)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px !important',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      color: ""
    },
  },
}));

export function html() {

  const {
    showCurrentPassword,
    showNewPassword,
    showConfirmNewPassword,
    showDialog,
    confirmNewPasswordError,
    currentPasswordError,
    newPasswordError,
  } = this.state;

  const { device } = this.props;

  return (
    <Card className="passwordChanageCard">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <View textAlign="center" >
            <Image className="logo-class"
              alt="Bernepay logo"
              src={logo}
              width="100%"
            />
          </View>
        </Grid>

        <Grid item xs={12}>

          <Grid container>
            <Grid item xs={6}>
              <Typography 
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Change Password
              </Typography>
            </Grid>
          </Grid>

        </Grid>

        <Grid item xs={12}>

          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <StyledTextField
                  className="current-password-tab"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={this.currentPassword}
                  onChange={this.handleCurrentPasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.toggleCurrentPasswordVisibility}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
              <FormHelperText className="error-message" style={{ color: 'red' }} >{currentPasswordError}</FormHelperText>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <StyledTextField
              className="new-password-input"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={this.newPassword}
              onChange={this.handleNewPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.toggleNewPasswordVisibility}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormHelperText className="error-message" style={{ color: 'red' }} >{newPasswordError}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <StyledTextField
              className="confirm-new-password-input"
              variant="outlined"
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={this.confirmNewPassword}
              onChange={this.handleConfirmNewPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.toggleConfirmNewPasswordVisibility}
                    >
                      {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>

                  </InputAdornment>

                )
              }}
            />
            <FormHelperText className="error-message" style={{ color: 'red' }} >{confirmNewPasswordError}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth >
            <ButtonPrimary className="change-password"
              variant="contained"
              onClick={async () => {
                let formValid = await this.ValidatePassword();

                if (formValid) {
                  this.setState({ showDialog: true });
                }
              }}
            >
              Change Password
            </ButtonPrimary>
            {showDialog && (
              <ConfirmDialog
                title="Warning"
                open={true}
                setOpen={true}
                dialogPadding={0}
              >
                <b>Confirmation</b>
                <br />
                <br />

                <p>{messages.reloginConfirmation}</p>

                <ButtonSecondary
                  className="buttonSecondary"
                  onClick={this.handleCancel}
                >
                  Cancel
                </ButtonSecondary>
                <ButtonPrimary
                  className="buttonPrimary ml-1"
                  onClick={this.changePassword} >
                  confirm
                </ButtonPrimary>
              </ConfirmDialog>)}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <ButtonSecondary className="cancell"
              variant="contained"
              onClick={this.handleCancel}>
              Cancel
            </ButtonSecondary>
          </FormControl>
        </Grid>

      </Grid>

    </Card>
  );
} 