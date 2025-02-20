import React, { useEffect, useRef, useState } from 'react';
import {
	Grid,
	Button,
	CircularProgress,
	Backdrop,
	FormControl,
	TextField,
	Card,
	Typography
} from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { toast } from 'react-toastify';

//Icons
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

//Components
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { BootstrapInputOld } from "components/$widgets/form-inputs/BootstrapInputOld";
import AlertDialog from "components/$widgets/alertDialog";

//Service
import { DashboardService } from 'service/api/dashboard.service';
import { BenepayUserService } from 'service/api/benepay-user.service';

//Form
import ParametersForm from './form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OnboardConstants } from 'config/constants';
import Utils from 'service/core/utils';

//Styles
const styles = {
	searchButton: {
		color: 'white',
		backgroundColor: 'var(--primary-color)',
		textTransform: 'none',
		whiteSpace: 'nowrap',
		fontSize: '15px',
		width: '30%',
	},
	addNewButton: {
		color: 'white',
		backgroundColor: 'var(--primary-color)',
		textTransform: 'none',
		whiteSpace: 'nowrap',
		fontSize: '15px',
		width: '30%',
	},
	parameterCancelButton: {
		color: 'white',
		backgroundColor: 'var(--light-disabled)',
		textTransform: 'none',
		whiteSpace: 'nowrap',
		fontSize: '15px',
		width: '10%',
		marginRight: '1%'
	},
	parameterListing: {
		marginTop: '20px',
		padding: '1%',
		height: '600px',
		overflow: 'auto'
	},
	inputDisabled:{
		background: '#EDEDED'
	},
	paramDeleteBtn:{
		backgroundColor:'#ececec',
		padding:'3.4%',
		display:'flex',
		alignItems:'center',
		justifyContent:'center'
	}
};

const DefaultParameter = () => {

	const [searchFields, setSearchFields] = useState({
		merchantId: '',
		providerId: ''
	});
	const [loading, setLoading] = useState(false);
	const [parameters, setParameters] = useState([]);
	const [merchantsList, setMerchantsList] = useState([]);
	const [providersList, setProvidersList] = useState([]);
	const [parametersFormPopup, setParametersFormPopup] = useState(false);
	const [formSubmitFlag, setFormSubmitFlag] = useState(false);
	const [parameterValueIsModified, setParameterValueIsModified] = useState(false);
	const [parametersResetPopup, setParametersResetPopup] = useState(false);
	const [formSubmitBtnDisable, setFormSubmitBtnDisable] = useState(false);
	const [parameterDeletePopup, setParameterDeletePopup] = useState(false);
	const [paramIdForDelete, setParamIdForDelete] = useState('');
	const [paramDeleteBtnLoading, setParamDeleteBtnLoading] = useState(false);
	
	const prevParametersRef = useRef([]);
	
	useEffect(() => {
		searchParameters();
		getMerchants();
		getPaymentProviders();
	}, []);

	/**
	 * Search field Onchange method
	 * 
	 * @param {*} e 
	 * @param {*} fieldName 
	 * @param {*} newValue 
	 */
	const handleChange = (e, fieldName, newValue) => {
		try {
			setSearchFields(prevFields => ({
				...prevFields,
				[fieldName]: newValue ? newValue : ''
			}));
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * Updates the provider parameters in the state and stores the previous state
	 *
	 * @param {Object} e - The event object
	 * @param {number|string} id - The unique ID of the parameter to update
	 * @param {string} fieldName - The name of the field to update
	 */
	const updateParameterFormFields = (e, id, fieldName) => {
		let value = e.target.value;

		setParameterValueIsModified(true);
		setParameters((prevParameters) => {

			if(!parameterValueIsModified){
				// Store the current state as the previous state in the ref
				prevParametersRef.current = prevParameters;
			}

			// Return the updated state
			return prevParameters.map((item) =>
				item.beneCollectParameterId === id
					? { ...item, [fieldName]: value }
					: item
			);
		});
	};

	/**
 	* Method for resets the parameters popup
 	*/
	const resetToPreviousParametersPopup = () => {
		setParametersResetPopup(true);
	};

	/**
 	* Resets the parameters state to the previous state
 	*/
	const resetToPreviousParameters = () => {
		setParameters(prevParametersRef.current);
		setParameterValueIsModified(false);
		setParametersResetPopup(false);
	};

	/**
	 * Save Parameters
	 */
	const updatePaymentProvider = async () => {
		try {
			if (parameterValueIsModified) {
				setLoading(true);
	
				// Compare with the previous state and filter the changed objects
				const modifiedParameters = parameters.filter((currentItem) => {
					const previousItem = prevParametersRef.current.find(
						(item) => item.beneCollectParameterId === currentItem.beneCollectParameterId
					);
					// Check if any field has been modified
					return previousItem && (
						currentItem.parameterValue !== previousItem.parameterValue ||
						currentItem.parameterName !== previousItem.parameterName ||
						currentItem.additionalDetails !== previousItem.additionalDetails
					);
				}).map(({ beneCollectParameterId, fkpaymentProviderId, fkmerchantId, parameterName, parameterValue, additionalDetails }) => ({
					beneCollectParameterId,
					parameterName,
					parameterValue,
					fkpaymentProviderId,
					fkmerchantId,
					additionalDetails
				}));

				if (modifiedParameters.length > 0) {
					const response = await DashboardService.updateMerchantParameter(modifiedParameters);

					if (response && response.statusCode == "200") {
						toast.success(response.message);
						setLoading(false);
						setParameterValueIsModified(false);
					}else{
						setLoading(false);
					}
				}else{
					console.log("No parameters have been modified");
				}
			} else {
				console.log("No chages in provider parameters configurations");
			}
		} catch (error) {
			console.log(error);
		}
	}
	/**
	 * Get the list of merchants parameter values
	 */
	const searchParameters = () => {
		try {
			setLoading(true);

			DashboardService.getProviderParameters(
				Utils.setNullWhenEmpty(searchFields.merchantId),
				Utils.setNullWhenEmpty(searchFields.providerId)

			).then(merchantParameterList => {
				setParameters(merchantParameterList);
				setLoading(false);

			}).catch(error => {
				console.error("Error fetching provider parameters:", error);
				setLoading(false);
			});

		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}

	/**
	 * Get the list of merchants
	 */
	const getMerchants = () => {
		try {
			setLoading(true);

			DashboardService.getMerchantSummaryList().then(response => {
				if (Object.keys(response).length !== 0) {
					let merchantsList = response.merchantSummary.filter(merchant => merchant.activeStatus === 1);

					const addOption = { merchantId: 'DEFAULT', merchantName: 'DEFAULT' };
					merchantsList = [addOption, ...merchantsList];

					setMerchantsList(merchantsList);
				}

				setLoading(false);

			}).catch(error => {
				console.error("Error fetching merchant summary:", error);
				setLoading(false);
			});

		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}

	/**
	 * Fetch payment providers
	 */
	const getPaymentProviders = () => {
		try {
			setLoading(true);

			BenepayUserService.getPaymentProviderList("ALL").then(response => {
				if (response !== null) {
					setProvidersList(response.dataList);
				}

				setLoading(false);

			}).catch(error => {
				console.error("Error fetching provider:", error);
				setLoading(false);
			});
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}

	/**
	 * Open Form
	 */
	const saveParameters = () => {
		setFormSubmitFlag(!formSubmitFlag);
	}

	const closeParameterFormPopup = () =>{
		setParametersFormPopup(false);
		handleSubmitBtnDisable(false);
		searchParameters();
	}

	/**
	 * Parameter form save button disable handling
	 */
	const handleSubmitBtnDisable = (value) => {
		setFormSubmitBtnDisable(value);
	}

	/**
	 * Handle Parameters delete
	 */
	const deleteParameter = () =>{
		try {
			setParamDeleteBtnLoading(true);

			DashboardService.deleteParameter(paramIdForDelete).then(response => {
				
				if(response?.statusCode == "200"){
					toast.success(response.message || "Parameter Deleted Successfully");

					searchParameters();
					setParameterDeletePopup(false);
				}
				else if(response?.statusCode == "400"){
					toast.error(response.message || "Unable to delete the parameter");
				}

				setParamDeleteBtnLoading(false);

			}).catch(error => {
				console.error("Error delete parameters:", error);
				setParamDeleteBtnLoading(false);
			});

		} catch (error) {
			console.error(error);
			setParamDeleteBtnLoading(false);
		}
	}

	return (
		<>
			{loading && (
				<div id="semiTransparenDivTest">
					<Backdrop
						sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={true}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</div>
			)}

			<Grid container spacing={3}>
				<Grid item md={2} sm={12} xs={12}>
					<label
						htmlFor="benePayTransactionId"
						className="py-1"
						style={{
							whiteSpace: "nowrap",
							fontWeight: "var(--font-weight-normal)",
							fontSize: "var(--font-x-medium)",
							overflow: "hidden",
							textOverflow: "ellipsis",
							color: 'var(--dark-color)'
						}}
					>
						Merchant Id
					</label>
					<Autocomplete
						id="merchantsName"
						name="merchantId"
						options={merchantsList || []}
						getOptionLabel={(option) => option.merchantName}
						renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
						onChange={(e, newValue) => handleChange(e, 'merchantId', newValue?.merchantId)}
						value={merchantsList.find((option) => option.merchantId === searchFields.merchantId)}
					/>
				</Grid>

				<Grid item md={2} sm={12} xs={12}>
					<label
						htmlFor="benePayTransactionId"
						className="py-1"
						style={{
							whiteSpace: "nowrap",
							fontWeight: "var(--font-weight-normal)",
							fontSize: "var(--font-x-medium)",
							overflow: "hidden",
							textOverflow: "ellipsis",
							color: 'var(--dark-color)'
						}}
					>
						Provider Id
					</label>
					<Autocomplete
						id="providers"
						name="providerId"
						options={providersList}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
						onChange={(e, newValue) => handleChange(e, "providerId", newValue?.value)}
						value={providersList.find((option) => option.value === searchFields.value)}
					/>
				</Grid>

				<Grid item md={4} sm={12} xs={12}
					style={{ display: 'flex', alignItems: 'end' }}
				>
					<Button
						variant="contained"
						className="settlementSaveButton" style={styles.searchButton}
						onClick={searchParameters}
					>
						Search
					</Button>
				</Grid>

				<Grid item md={4} sm={12} xs={12}
					style={{ display: 'flex', alignItems: 'end' }}
				>
					<Button
						variant="contained"
						className="addNewButton" style={styles.addNewButton}
						onClick={() => { setParametersFormPopup(true) }}
					>
						Add New
					</Button>
				</Grid>
			</Grid>

			<Card style={styles.parameterListing}>
				{parameters.length == 0 ?
					<>
						<Grid container spacing={2}>
							<Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<BootstrapLabel shrink>No Records Found!</BootstrapLabel>
							</Grid>
						</Grid>
					</> : ''
				}

				{parameters.map((v, i) =>
					<Grid container spacing={2} style={{ marginTop: i > 0 ? '1rem' : '0' }}>
						<Grid item xs={12} sm={12} md={3}>
							<BootstrapLabel shrink>Parameter Name</BootstrapLabel>
							<FormControl fullWidth>
								<BootstrapInputOld
									name={"parameterName-" + v.beneCollectParameterId}
									value={v.parameterName || ""}
									onChange={(e) => updateParameterFormFields(e, v.beneCollectParameterId, 'parameterName')}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} md={3}>
							<BootstrapLabel shrink>Parameter Value</BootstrapLabel>
							<FormControl fullWidth>
								<BootstrapInputOld
									name={"parameterValue-" + v.beneCollectParameterId}
									value={v.parameterValue || ""}
									onChange={(e) => updateParameterFormFields(e, v.beneCollectParameterId, 'parameterValue')}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} md={3}>
							<BootstrapLabel shrink>Additional Details</BootstrapLabel>
							<FormControl fullWidth>
								<BootstrapInputOld
									name={"additionalDetails-" + v.beneCollectParameterId}
									value={v.additionalDetails || ""}
									onChange={(e) => updateParameterFormFields(e, v.beneCollectParameterId, 'additionalDetails')}
								/>
							</FormControl>
						</Grid>

						{v.fkmerchantId && v.fkmerchantId != OnboardConstants.PARAMETER_DEFAULT_RECORDS ? 
							<Grid item xs={12} sm={12} md={3}
								style={{
									display: 'flex',
									justifyContent: 'start',
									alignItems: 'end'
								}}
							>
								<Button
									variant="contained"
									className="addNewButton" style={styles.paramDeleteBtn}
									onClick={() => { setParameterDeletePopup(true); setParamIdForDelete(v.beneCollectParameterId); }}
								>
									<FontAwesomeIcon icon={faTrashCan} color='red' style={{padding:'1%'}} />
								</Button>
							</Grid>
							:
							<></>
						}
					</Grid>
				)}
			</Card>

			{parameterValueIsModified ? 
				<Grid container spacing={2} style={{ marginTop: '1%' }}>
					<Grid item xl={12} lg={12} md={12} sm={12}
						style={{ display: 'flex', justifyContent: 'end' }}
					>
						<Button
							variant="contained"
							className="parameterCancelButton" style={styles.parameterCancelButton}
							onClick={resetToPreviousParametersPopup}
						>
							Cancel
						</Button>

						<Button
							variant="contained"
							className="parameterSaveButton" style={styles.addNewButton}
							onClick={updatePaymentProvider}
						>
							Save
						</Button>
					</Grid>
				</Grid>
				:
				<></>
			}

			{/* Parameters form */}
			<AlertDialog
				open={parametersFormPopup}
				title="New Parameter"
				cancelBtnLabel="Cancel"
				confirmBtnLabel="Save"
				confirmOnClick={() => saveParameters()}
				cancelOnClick={() => { setParametersFormPopup(false); setFormSubmitFlag(false) }}
				cancelBtnDisabled = {formSubmitBtnDisable}
                confirmBtnDisabled = {formSubmitBtnDisable}
			>
				<ParametersForm
					parametersFormPopup={parametersFormPopup}
					merchants={merchantsList}
					providers={providersList}
					formSubmitFlag={formSubmitFlag}
					saveParameters={saveParameters}
					closeParameterFormPopup={closeParameterFormPopup}
					handleSubmitBtnDisable={handleSubmitBtnDisable}
				/>
			</AlertDialog>

			{/* Parameters rest confirm popup */}
			<AlertDialog
				open={parametersResetPopup}
				title=""
				cancelBtnLabel="Cancel"
				confirmBtnLabel="Confirm"
				confirmOnClick={() => resetToPreviousParameters()}
				cancelOnClick={() => { setParametersResetPopup(false) }}
			>
				 <Grid container style={{ width: '500px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }}>Are you sure you want to reset the parameters to the previous values?</Typography>
                    </Grid>
                </Grid>
			</AlertDialog>

			{/* Parameter delete popup */}
			<AlertDialog
				open={parameterDeletePopup}
				title=""
				cancelBtnLabel="Cancel"
				confirmBtnLabel="Confirm"
				confirmOnClick={() => deleteParameter()}
				cancelOnClick={() => { setParameterDeletePopup(false); setParamIdForDelete(""); }}
				cancelBtnDisabled = {paramDeleteBtnLoading}
                confirmBtnDisabled = {paramDeleteBtnLoading}
			>
				<Grid container style={{ width: '500px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }}>Are you sure you want to delete this ?</Typography>
                    </Grid>
                </Grid>
			</AlertDialog>
		</>
	);
}

export default DefaultParameter;
